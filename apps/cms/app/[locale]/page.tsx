import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { enhancedQueries } from "@/lib/directus/directus-cached";
import { Layout } from "@/components/common/layout";
import { DirectusUser } from "@directus/sdk";

export default async function HomePage() {
  const popularPosts = await enhancedQueries.getPopularPosts(3);

  if (popularPosts.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              No Popular Posts Found
            </h2>
            <p className="text-center text-muted-foreground">
              It seems there are no popular posts at the moment. Please check
              back later.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              HarmonyX CMS
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              A fast, scalable content management system built with Next.js 15+,
              tRPC, and Directus
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/admin">Admin Dashboard</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/posts">View Posts</Link>
              </Button>
            </div>
          </div>

          {/* Popular Posts Preview */}
          {popularPosts && popularPosts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-center mb-8">
                Popular Content
              </h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {popularPosts.slice(0, 3).map((post) => (
                  <Card
                    key={post.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <Link
                          href={`/posts/${post.slug || post.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {post.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {(post.author as DirectusUser)?.first_name}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚡ Fast & Lightweight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Built with Next.js 15+ and optimized for performance with
                  intelligent caching and minimal bundle size.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🔧 Type-Safe APIs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  End-to-end type safety with tRPC, Zod validation, and
                  TypeScript for reliable development.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🚀 Production Ready
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Docker support, Redis caching, PostgreSQL database, and
                  Directus CMS for scalable content management.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
