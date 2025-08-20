import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { signIn as nextSignIn, signOut as nextSignOut } from ".";
import { getAuthSession } from "./action";
import { User } from "next-auth";

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const session = await getAuthSession();
      if (session) {
        setUser(session?.user ?? null);
      }
    };
    checkUser();
  }, []);

  const signIn = (email: string, password: string) => {
    // Call the signIn function from the auth module
    nextSignIn("directus", {
      email,
      password,
      redirect: false,
    });
  };
  const signOut = () => {
    // Call the signOut function from the auth module
    nextSignOut();
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
