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
import {
  cachedDirectusQueries,
  enhancedQueries,
} from "@/lib/directus/directus-cached";
import { Layout } from "@/components/common/layout";
import { Post } from "@/lib/directus/directus-schemas";
import { DirectusUser } from "@directus/sdk";

export default async function PostsPage() {
  // Use cached queries for public-facing content
  const posts = await cachedDirectusQueries.posts.getAll({
    limit: 20,
  });

  // Use enhanced queries for popular content
  const popularPosts = await enhancedQueries.getPopularPosts(5);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Blog Posts</h1>
                <p className="text-muted-foreground">
                  Discover our latest articles and tutorials - Fast Refresh is
                  working!
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/">← Back Home</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Popular Posts Section */}
          {popularPosts && popularPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Popular Posts</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularPosts.slice(0, 3).map((post: Post) => (
                  <Card
                    key={post.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <Badge variant="destructive">Popular</Badge>
                          <Link href={`/posts/${post.slug || post.id}`}>
                            <CardTitle className="text-lg hover:text-primary cursor-pointer transition-colors">
                              {post.title}
                            </CardTitle>
                          </Link>
                        </div>
                      </div>
                      <CardDescription className="text-sm leading-relaxed">
                        {(post.author as DirectusUser).first_name}{" "}
                        {(post.author as DirectusUser).last_name}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Posts Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
            <div className="grid gap-6">
              {posts?.map((post: any) => (
                <Card
                  key={post.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <Badge variant="secondary">{post.status}</Badge>
                        <Link href={`/posts/${post.slug || post.id}`}>
                          <CardTitle className="text-xl hover:text-primary cursor-pointer transition-colors">
                            {post.title}
                          </CardTitle>
                        </Link>
                      </div>
                    </div>
                    <CardDescription className="text-base leading-relaxed">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span>By {(post.author as DirectusUser).first_name} {(post.author as DirectusUser).last_name}</span>
                        <span>
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                        {post.slug && <span>{post.slug}</span>}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/posts/${post.slug || post.id}`}>
                          Read More →
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No posts message */}
            {(!posts || posts.length === 0) && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posts found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function generateMetadata() {
  const posts = await cachedDirectusQueries.posts.getAll({ limit: 1 });

  return {
    title: "Blog Posts - HarmonyX CMS",
    description: `Discover our latest articles and tutorials. ${posts?.length || 0} posts available.`,
    openGraph: {
      title: "Blog Posts - HarmonyX CMS",
      description: "Discover our latest articles and tutorials.",
      type: "website",
    },
  };
}
