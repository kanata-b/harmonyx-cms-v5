import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { directusQueries } from "@/lib/directus/directus-queries";
import type { Posts } from "@/server/schema";
import { Post } from "@/lib/directus/directus-schemas";

export default async function AdminPostsPage() {
  // Use direct queries for admin interfaces to ensure fresh data
  const allPosts = await directusQueries.posts.getAll({
    // Include unpublished posts for admin view
    limit: 50,
  });

  const publishedPosts =
    allPosts?.filter(
      (post: Post) => post.status === "published"
    ) || [];
  const draftPosts =
    allPosts?.filter(
      (post: Post) => post.status === "draft"
    ) || [];
  const inReviewPosts =
    allPosts?.filter(
      (post: Post) => post.status === "in_review"
    ) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Manage Posts</h1>
              <p className="text-muted-foreground">
                Create, edit, and manage your blog posts
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/admin/posts/new">Create New Post</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin">← Back to Admin</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allPosts?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {publishedPosts.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {draftPosts.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Archived</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {inReviewPosts.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Posts</h2>

          {allPosts?.map((post: Post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          post.status === "published"
                            ? "default"
                            : post.status === "draft"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {post.status}
                      </Badge>
                      <Badge variant="outline">ID: {post.id}</Badge>
                    </div>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <CardDescription>{post.author?.toString()}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/posts/${post.id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/posts/${post.slug || post.id}`}>
                        Preview
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>Author: {post.author?.toString()}</span>
                    <span>
                      Created: {(post.date_created) ? new Date(post.date_created).toLocaleDateString() : "Unknown"}
                    </span>
                    <span>
                      Updated: {(post.date_updated) ? new Date(post.date_updated).toLocaleDateString() : "Unknown"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {(!allPosts || allPosts.length === 0) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No posts found. Create your first post!
              </p>
              <Button asChild className="mt-4">
                <Link href="/admin/posts/new">Create New Post</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
