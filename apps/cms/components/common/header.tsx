import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cachedDirectusQueries } from "@/lib/directus/directus-cached";

export async function Header() {
  const navigationMenu = await cachedDirectusQueries.navigation.getById("main");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Logo */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              HarmonyX CMS
            </span>
          </Link>

          {/* Navigation Menu */}
          <nav className="flex items-center gap-4 text-sm lg:gap-6">
            <Link
              href="/posts"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Posts
            </Link>
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <span className="font-bold">HarmonyX</span>
        </Button>

        {/* Right Side Actions */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search can be added here */}
          </div>

          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin">Admin</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
