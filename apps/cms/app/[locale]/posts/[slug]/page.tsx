import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, User, Eye } from "lucide-react";
import { notFound } from "next/navigation";
import { cachedDirectusQueries } from "@/lib/directus/directus-cached";
import type { DirectusUser, DirectusFile } from "@directus/sdk";
import type { Metadata } from "next";

interface PostDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await cachedDirectusQueries.posts.getBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title || 'Untitled Post',
    description: post.description || 'A blog post from our CMS',
    openGraph: {
      title: post.title || 'Untitled Post',
      description: post.description || 'A blog post from our CMS',
      type: 'article',
      publishedTime: post.published_at || post.date_created || undefined,
      modifiedTime: post.date_updated || undefined,
      authors: [getAuthorName(post.author)],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title || 'Untitled Post',
      description: post.description || 'A blog post from our CMS',
    }
  };
}

// Helper functions
const getImageUrl = (image: string | DirectusFile<any> | null): string => {
  if (!image) return "/placeholder.svg";
  
  const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
  
  if (typeof image === "string") {
    const url = `${directusUrl}/assets/${image}`;
    console.log('Generated string URL:', url);
    return url;
  }
  
  if (image?.id) {
    const url = `${directusUrl}/assets/${image.id}`;
    console.log('Generated object URL:', url);
    return url;
  }
  
  return "/placeholder.svg";
};

const formatDate = (date: string | null): string => {
  if (!date) return "Unknown date";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", 
    day: "numeric",
  });
};

const getAuthorName = (author: string | DirectusUser<any> | null): string => {
  if (!author) return "Unknown Author";
  if (typeof author === "string") return author;
  return `${author.first_name || ""} ${author.last_name || ""}`.trim() || author.email || "Unknown Author";
};

const getAuthorAvatar = (author: string | DirectusUser<any> | null): string => {
  if (!author) return "/placeholder-user.jpg";
  if (typeof author === "string") return "/placeholder-user.jpg";
  return author.avatar ? getImageUrl(author.avatar) : "/placeholder-user.jpg";
};

const getStatusColor = (status: "draft" | "in_review" | "published"): "default" | "secondary" | "destructive" => {
  switch (status) {
    case "published": return "default";
    case "in_review": return "secondary"; 
    case "draft": return "destructive";
    default: return "secondary";
  }
};

const estimateReadTime = (content: string | null): string => {
  if (!content) return "1 min read";
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTime = Math.ceil(words / 200); // Average reading speed
  return `${readTime} min read`;
};

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  
   const { slug } = await params;

  const post = await cachedDirectusQueries.posts.getBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/posts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Posts
            </Link>
          </Button>

          <div className="space-y-4">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <Badge variant={getStatusColor(post.status)} className="text-sm">
                {post.status.replace('_', ' ').toUpperCase()}
              </Badge>
              {post.published_at && (
                <Badge variant="outline" className="text-sm">
                  <Eye className="mr-1 h-3 w-3" />
                  Published
                </Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
              {post.title || "Untitled Post"}
            </h1>

            {post.description && (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {post.description}
              </p>
            )}

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={getAuthorAvatar(post.author)}
                    alt={getAuthorName(post.author)}
                  />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{getAuthorName(post.author)}</span>
              </div>

              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(post.published_at || post.date_created)}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{estimateReadTime(post.content)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Image */}
          {post.image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <Image
                src={getImageUrl(post.image)}
                alt={post.title || "Post image"}
                width={800}
                height={400}
                className="w-full h-auto object-cover"
                unoptimized
              />
            </div>
          )}

          <Card>
            <CardContent className="prose prose-gray dark:prose-invert max-w-none pt-6">
              {post.content ? (
                <div
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  className="space-y-6 leading-relaxed"
                />
              ) : (
                <p className="text-muted-foreground italic">No content available.</p>
              )}
            </CardContent>
          </Card>

          {/* Author Bio */}
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={getAuthorAvatar(post.author)}
                    alt={getAuthorName(post.author)}
                  />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">About {getAuthorName(post.author)}</h3>
                  <p className="text-muted-foreground">
                    {typeof post.author === 'object' && post.author?.title ? 
                      post.author.title : 
                      "A passionate developer and writer sharing insights about modern web development, best practices, and emerging technologies."
                    }
                  </p>
                  
                  {/* Additional author info */}
                  {typeof post.author === 'object' && post.author && (
                    <div className="text-sm text-muted-foreground space-y-1">
                      {post.author.location && (
                        <p>📍 {post.author.location}</p>
                      )}
                      {post.author.email && (
                        <p>✉️ {post.author.email}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Post Metadata */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Post Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Status:</span>
                  <Badge variant={getStatusColor(post.status)} className="ml-2">
                    {post.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                
                {post.published_at && (
                  <div>
                    <span className="font-medium">Published:</span>
                    <span className="ml-2">{formatDate(post.published_at)}</span>
                  </div>
                )}
                
                <div>
                  <span className="font-medium">Created:</span>
                  <span className="ml-2">{formatDate(post.date_created)}</span>
                </div>
                
                {post.date_updated && (
                  <div>
                    <span className="font-medium">Last Updated:</span>
                    <span className="ml-2">{formatDate(post.date_updated)}</span>
                  </div>
                )}
                
                {post.slug && (
                  <div className="md:col-span-2">
                    <span className="font-medium">Slug:</span>
                    <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">/{post.slug}</code>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/posts">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Posts
              </Link>
            </Button>

            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1 sm:flex-none">
                <Link href="/">Home</Link>
              </Button>
              
              {post.status === 'published' && (
                <Button asChild variant="default" className="flex-1 sm:flex-none">
                  <Link href={`/posts/${post.slug || post.id}`}>
                    View Live Post
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
