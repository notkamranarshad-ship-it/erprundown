import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLayout } from "@/components/layout/PageLayout";
import { BlogTableOfContents } from "@/components/blog/BlogTableOfContents";
import { BlogSidebarCTA } from "@/components/blog/BlogSidebarCTA";
import { BlogContentRenderer } from "@/components/blog/BlogContentRenderer";
import { BlogInlineCTA } from "@/components/blog/BlogInlineCTA";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { AuthorBioHeader } from "@/components/blog/AuthorBioHeader";
import { AuthorBioFull } from "@/components/blog/AuthorBioFull";
import { VendorCard } from "@/components/vendors/VendorCard";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import { format } from "date-fns";

// Default author info
const DEFAULT_AUTHOR = {
  name: "Kamran Arshad",
  title: "Founder at ERPRundown",
  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
};

const DEFAULT_VERIFIED_BY = {
  name: "Umair Khan",
  title: "Chairman Folio3",
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || "");
  const { data: allPosts } = useBlogPosts();

  // Related posts (same category)
  const relatedPosts = allPosts
    ?.filter((p) => p.id !== post?.id && p.category === post?.category)
    .slice(0, 3);

  // Estimate reading time
  const wordCount = post?.content?.split(/\s+/).length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Share functionality
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post?.title || "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container-page py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-32 rounded bg-muted" />
            <div className="h-[400px] rounded-2xl bg-muted" />
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="hidden lg:block lg:col-span-2">
                <div className="h-48 rounded-lg bg-muted" />
              </div>
              <div className="lg:col-span-7 space-y-4">
                <div className="h-12 rounded bg-muted" />
                <div className="h-4 rounded bg-muted w-3/4" />
                <div className="h-4 rounded bg-muted w-1/2" />
                <div className="h-64 rounded bg-muted" />
              </div>
              <div className="hidden lg:block lg:col-span-3">
                <div className="h-64 rounded-lg bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !post) {
    return (
      <PageLayout>
        <div className="container-page py-24 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blog">
            <Button size="lg">Browse All Articles</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <div className="border-b border-border/50 bg-muted/30">
        <div className="container-page py-4">
          <Link
            to="/blog"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero Section with Featured Image */}
      <section className="relative">
        {post.featured_image ? (
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-r from-primary/10 to-accent/10" />
        )}
      </section>

      {/* Main Content with 3-Column Layout */}
      <article className="container-page relative -mt-32 pb-16">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-2">
            {post.content && <BlogTableOfContents content={post.content} />}
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-7">
            {/* Article Header */}
            <header className="bg-background rounded-2xl p-8 shadow-lg border border-border/50 mb-8">
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {post.category && (
                  <Badge className="bg-primary text-primary-foreground">
                    {post.category}
                  </Badge>
                )}
                {post.industries?.slice(0, 2).map((ind) => (
                  <Link key={ind.id} to={`/industries/${ind.slug}`}>
                    <Badge variant="outline" className="hover:bg-muted">
                      {ind.name}
                    </Badge>
                  </Link>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Info with Author Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(post.published_at), "MMMM d, yyyy")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {readingTime} min read
                  </span>
                </div>
                <AuthorBioHeader
                  authorName={post.author_name || DEFAULT_AUTHOR.name}
                  authorImage={DEFAULT_AUTHOR.image}
                />
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground mr-2">Share:</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Facebook className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </header>

            {/* Article Content */}
            <div className="bg-background rounded-2xl p-8 shadow-sm border border-border/50">
              {post.content ? (
                <>
                  <BlogContentRenderer content={post.content} />
                  
                  {/* Full Author Bio at end of content */}
                  <div className="mt-12 pt-8 border-t border-border">
                    <AuthorBioFull
                      authorName={post.author_name || DEFAULT_AUTHOR.name}
                      authorTitle={post.author_title || DEFAULT_AUTHOR.title}
                      authorImage={DEFAULT_AUTHOR.image}
                      verifiedByName={post.verified_by_name || DEFAULT_VERIFIED_BY.name}
                      verifiedByTitle={post.verified_by_title || DEFAULT_VERIFIED_BY.title}
                    />
                  </div>
                  
                  {/* Inline CTA after content */}
                  <BlogInlineCTA
                    title="Ready to Find Your Perfect ERP?"
                    description="Get personalized recommendations based on your industry and requirements."
                  />
                </>
              ) : (
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Related Vendors */}
              {post.vendors && post.vendors.length > 0 && (
                <section className="mt-12 pt-8 border-t border-border">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Featured Vendors</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {post.vendors.slice(0, 4).map((vendor) => (
                      <VendorCard key={vendor.id} vendor={vendor} showCompare={false} />
                    ))}
                  </div>
                </section>
              )}

              {/* Related Posts */}
              {relatedPosts && relatedPosts.length > 0 && (
                <RelatedPosts posts={relatedPosts} />
              )}
            </div>
          </main>

          {/* Right Sidebar - CTA */}
          <aside className="hidden lg:block lg:col-span-3">
            <BlogSidebarCTA vendorSlugs={post.vendors?.map(v => v.slug) || []} />
          </aside>
        </div>

        {/* Mobile TOC & CTA */}
        <div className="lg:hidden mt-8 space-y-6">
          <BlogSidebarCTA vendorSlugs={post.vendors?.map(v => v.slug) || []} />
        </div>
      </article>
    </PageLayout>
  );
}
