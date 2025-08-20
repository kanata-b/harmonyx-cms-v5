import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cachedDirectusQueries } from "@/lib/directus/directus-cached";
import { 
  Search, 
  Menu, 
  X, 
  Home, 
  FileText, 
  Settings,
  ChevronDown 
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export async function Header() {
  const navigationMenu = await cachedDirectusQueries.navigation.getById("main");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 lg:px-8">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-3 mr-8">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60">
              <span className="text-primary-foreground font-bold text-sm">H</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                HarmonyX
              </span>
              <span className="text-sm text-muted-foreground ml-2">CMS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" size="sm" asChild className="text-sm font-medium">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm font-medium">
                  <FileText className="h-4 w-4 mr-2" />
                  Posts
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/posts" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    All Posts
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/posts?category=news" className="flex items-center">
                    News
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/posts?category=tutorials" className="flex items-center">
                    Tutorials
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Center - Search Bar (Desktop) */}
        <div className="flex-1 max-w-md mx-8 hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search posts..." 
              className="w-full pl-10 pr-4 h-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Search Button (Mobile) */}
          <Button variant="ghost" size="sm" className="lg:hidden">
            <Search className="h-4 w-4" />
          </Button>

          <ThemeToggle />
          
          <Button 
            variant="default" 
            size="sm" 
            asChild 
            className="hidden sm:flex bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Link href="/admin" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Admin
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60">
                    <span className="text-primary-foreground font-bold text-sm">H</span>
                  </div>
                  HarmonyX CMS
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-4">
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Search posts..." 
                    className="w-full pl-10 pr-4"
                  />
                </div>

                {/* Mobile Navigation */}
                <nav className="space-y-2">
                  <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                    <Link href="/" className="flex items-center gap-3">
                      <Home className="h-4 w-4" />
                      Home
                    </Link>
                  </Button>
                  
                  <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                    <Link href="/posts" className="flex items-center gap-3">
                      <FileText className="h-4 w-4" />
                      All Posts
                      <Badge variant="secondary" className="ml-auto">12</Badge>
                    </Link>
                  </Button>
                  
                  <div className="pl-4 space-y-1">
                    <Button variant="ghost" size="sm" asChild className="w-full justify-start text-muted-foreground">
                      <Link href="/posts?category=news">News</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="w-full justify-start text-muted-foreground">
                      <Link href="/posts?category=tutorials">Tutorials</Link>
                    </Button>
                  </div>
                  
                  <Button variant="default" size="sm" asChild className="w-full justify-start mt-4">
                    <Link href="/admin" className="flex items-center gap-3">
                      <Settings className="h-4 w-4" />
                      Admin Panel
                    </Link>
                  </Button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
