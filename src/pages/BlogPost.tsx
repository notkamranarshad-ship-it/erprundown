import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/layout/PageLayout";
import { VendorCard } from "@/components/vendors/VendorCard";
import { CompareFloatingBar } from "@/components/compare/CompareFloatingBar";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import { format } from "date-fns";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || "");
  const { data: allPosts } = useBlogPosts();

  // Related posts (same category)
  const relatedPosts = allPosts
    ?.filter((p) => p.id !== post?.id && p.category === post?.category)
    .slice(0, 3);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container-page py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-32 rounded bg-muted" />
            <div className="h-64 rounded-lg bg-muted" />
            <div className="h-96 rounded-lg bg-muted" />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !post) {
    return (
      <PageLayout>
        <div className="container-page py-12 text-center">
          <h1 className="text-2xl font-bold">Article not found</h1>
          <p className="mt-2 text-muted-foreground">
            The article you're looking for doesn't exist.
          </p>
          <Link to="/blog">
            <Button className="mt-4">Browse Articles</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container-page py-4">
          <Link
            to="/blog"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      <article className="container-page py-12">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <header className="mb-8">
            {post.category && (
              <Badge variant="secondary" className="mb-4">
                {post.category}
              </Badge>
            )}
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author_name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(post.published_at), "MMMM d, yyyy")}
              </span>
              {post.updated_at !== post.published_at && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Updated {format(new Date(post.updated_at), "MMM d, yyyy")}
                </span>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-8 overflow-hidden rounded-lg">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-accent prose-strong:text-foreground">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p>{post.excerpt}</p>
            )}
          </div>

          {/* Related Vendors */}
          {post.vendors && post.vendors.length > 0 && (
            <section className="mt-12 border-t pt-12">
              <h2 className="mb-6 text-xl font-semibold">Related Vendors</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {post.vendors.slice(0, 4).map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} showCompare={false} />
                ))}
              </div>
            </section>
          )}

          {/* Related Industries */}
          {post.industries && post.industries.length > 0 && (
            <section className="mt-12 border-t pt-12">
              <h2 className="mb-4 text-xl font-semibold">Related Industries</h2>
              <div className="flex flex-wrap gap-2">
                {post.industries.map((ind) => (
                  <Link key={ind.id} to={`/industries/${ind.slug}`}>
                    <Badge variant="outline" className="hover:bg-muted">
                      {ind.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <section className="mt-12 border-t pt-12">
              <h2 className="mb-6 text-xl font-semibold">Related Articles</h2>
              <div className="grid gap-6 sm:grid-cols-3">
                {relatedPosts.map((p) => (
                  <Link key={p.id} to={`/blog/${p.slug}`}>
                    <Card className="card-hover h-full">
                      <CardContent className="p-4">
                        <h3 className="line-clamp-2 font-medium">{p.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {p.excerpt}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      <CompareFloatingBar />
    </PageLayout>
  );
}