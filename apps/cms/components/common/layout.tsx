import { Header } from "@/components/common/header";
import { cachedDirectusQueries, enhancedQueries } from "@/lib/directus/directus-cached";
import { Pages } from "@/server/schema";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export async function Layout({ children }: PublicLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

async function Footer() {
  const navigationMenu = await cachedDirectusQueries.navigation.getById("footer");

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Next.js
            </a>{" "}
            and{" "}
            <a
              href="https://directus.io"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Directus
            </a>
            .
          </p>
        </div>

        {/* Footer Navigation */}
        
      </div>
    </footer>
  );
}
