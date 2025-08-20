import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, FileText, Eye, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Posts", value: "24", change: "+12%", icon: FileText },
    { title: "Total Views", value: "12,543", change: "+8%", icon: Eye },
    { title: "Active Users", value: "1,234", change: "+23%", icon: Users },
    { title: "Growth Rate", value: "15.3%", change: "+5%", icon: TrendingUp },
  ];

  const recentPosts = [
    {
      id: 1,
      title: "Getting Started with Next.js 15",
      status: "published",
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Building a Modern CMS",
      status: "draft",
      date: "2024-01-14",
    },
    {
      id: 3,
      title: "TypeScript Best Practices",
      status: "published",
      date: "2024-01-13",
    },
  ];

  const recentPages = [
    { id: 1, title: "About Us", status: "published", date: "2024-01-12" },
    { id: 2, title: "Contact", status: "published", date: "2024-01-11" },
    { id: 3, title: "Privacy Policy", status: "draft", date: "2024-01-10" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {"Welcome back! Here's what's happening with your content."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/posts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from
                  last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>
              Your latest blog posts and articles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{post.title}</h4>
                    <p className="text-sm text-muted-foreground">{post.date}</p>
                  </div>
                  <Badge
                    variant={
                      post.status === "published" ? "default" : "secondary"
                    }
                  >
                    {post.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Pages</CardTitle>
            <CardDescription>Your latest static pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{page.title}</h4>
                    <p className="text-sm text-muted-foreground">{page.date}</p>
                  </div>
                  <Badge
                    variant={
                      page.status === "published" ? "default" : "secondary"
                    }
                  >
                    {page.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
