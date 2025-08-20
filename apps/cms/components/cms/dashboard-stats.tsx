"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Eye, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function DashboardStats() {
  const { data: postsData } = trpc.posts.list.useQuery({ limit: 1000 });

  const stats = [
    {
      title: "Total Posts",
      value: postsData?.posts?.length || 0,
      description: "Published content",
      icon: FileText,
      trend: "+12%",
    },
    {
      title: "Total Pages",
      value: 0, // Simplified for now
      description: "Static pages",
      icon: FileText,
      trend: "+3%",
    },
    {
      title: "Page Views",
      value: "24,567",
      description: "This month",
      icon: Eye,
      trend: "+18%",
    },
    {
      title: "Active Users",
      value: "1,234",
      description: "Monthly active",
      icon: Users,
      trend: "+8%",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">{stat.trend}</span>
              <span>{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
