"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  FileText,
  ImageIcon,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  BarChart3,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Posts",
    href: "/admin/posts",
    icon: FileText,
    children: [
      { name: "All Posts", href: "/admin/posts" },
      { name: "New Post", href: "/admin/posts/new" },
      { name: "Categories", href: "/admin/categories" },
    ],
  },
  {
    name: "Pages",
    href: "/admin/pages",
    icon: FileText,
    children: [
      { name: "All Pages", href: "/admin/pages" },
      { name: "New Page", href: "/admin/pages/new" },
    ],
  },
  {
    name: "Media",
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "Posts",
    "Pages",
  ]);
  const pathname = usePathname();

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <LayoutDashboard className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground">
              Modern CMS
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const isExpanded = expandedItems.includes(item.name);
            const hasChildren = item.children && item.children.length > 0;

            return (
              <div key={item.name}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    collapsed && "justify-center px-2",
                    isActive &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                  asChild={!hasChildren}
                  onClick={
                    hasChildren ? () => toggleExpanded(item.name) : undefined
                  }
                >
                  {hasChildren ? (
                    <div className="flex w-full items-center">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.name}</span>
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 transition-transform",
                              isExpanded && "rotate-90"
                            )}
                          />
                        </>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex w-full items-center gap-3"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.name}</span>}
                    </Link>
                  )}
                </Button>

                {/* Children */}
                {hasChildren && isExpanded && !collapsed && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children?.map((child) => (
                      <Button
                        key={child.href}
                        variant={
                          pathname === child.href ? "secondary" : "ghost"
                        }
                        size="sm"
                        className={cn(
                          "w-full justify-start h-8",
                          pathname === child.href &&
                            "bg-sidebar-accent text-sidebar-accent-foreground"
                        )}
                        asChild
                      >
                        <Link href={child.href}>{child.name}</Link>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Quick Actions */}
      {!collapsed && (
        <>
          <Separator />
          <div className="p-4">
            <div className="space-y-2">
              <Button size="sm" className="w-full justify-start gap-2" asChild>
                <Link href="/admin/posts/new">
                  <Plus className="h-4 w-4" />
                  New Post
                </Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-start gap-2 bg-transparent"
                asChild
              >
                <Link href="/admin/pages/new">
                  <Plus className="h-4 w-4" />
                  New Page
                </Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
