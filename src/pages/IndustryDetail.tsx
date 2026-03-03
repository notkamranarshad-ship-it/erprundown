import { useParams, Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { VendorCard } from "@/components/vendors/VendorCard";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { PartnerCard } from "@/components/partners/PartnerCard";
import { CompareFloatingBar } from "@/components/compare/CompareFloatingBar";
import { useIndustry } from "@/hooks/useIndustries";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { usePartners } from "@/hooks/usePartners";

export default function IndustryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: industry, isLoading, error } = useIndustry(slug || "");
  const { data: blogPosts } = useBlogPosts();
  const { data: allPartners } = usePartners({ industry: industry?.name });

  // Related blog posts (first 3)
  const relatedPosts = blogPosts?.slice(0, 3);
  const recommendedPartners = allPartners?.slice(0, 3);

  // Parse core_problems if it exists
  const coreProblems = (industry as any)?.core_problems as string[] | null;

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container-page py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-32 rounded bg-muted" />
            <div className="h-48 rounded-lg bg-muted" />
            <div className="h-96 rounded-lg bg-muted" />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !industry) {
    return (
      <PageLayout>
        <div className="container-page py-12 text-center">
          <h1 className="text-2xl font-bold">Industry not found</h1>
          <p className="mt-2 text-muted-foreground">
            The industry you're looking for doesn't exist.
          </p>
          <Link to="/industries">
            <Button className="mt-4">Browse Industries</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const vendorsToShow = industry.vendors?.slice(0, 5) || [];
  const hasMoreVendors = (industry.vendors?.length || 0) > 5;

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container-page py-4">
          <Link
            to="/industries"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Industries
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-page">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            ERP for {industry.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            {industry.summary ||
              `Discover the best ERP solutions designed for the ${industry.name} industry.`}
          </p>
        </div>
      </section>

      <div className="container-page py-12 space-y-12">
        {/* Overview */}
        {industry.overview && (
          <section>
            <h2 className="mb-4 text-2xl font-semibold">Overview</h2>
            <div className="prose max-w-none text-muted-foreground">
              <p>{industry.overview}</p>
            </div>
          </section>
        )}

        {/* Core Problems */}
        {coreProblems && coreProblems.length > 0 && (
          <section>
            <h2 className="mb-4 text-2xl font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-accent" />
              Core Industry Challenges
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {coreProblems.map((problem, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                    {i + 1}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{problem}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Requirements */}
        {industry.key_requirements && (
          <section>
            <h2 className="mb-4 text-2xl font-semibold">Key ERP Requirements</h2>
            <div className="prose max-w-none text-muted-foreground">
              <p>{industry.key_requirements}</p>
            </div>
          </section>
        )}

        {/* Recommended Vendors */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              Recommended Vendors for {industry.name}
            </h2>
            {hasMoreVendors && (
              <Link to="/vendors">
                <Button variant="outline" size="sm">
                  View All Vendors <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
          {vendorsToShow.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vendorsToShow.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-muted-foreground">
                No vendors available for this industry yet.
              </p>
              <Link to="/vendors">
                <Button variant="link">Browse all vendors</Button>
              </Link>
            </div>
          )}
        </section>

        {/* Recommended Partners */}
        {recommendedPartners && recommendedPartners.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                Recommended Partners
              </h2>
              <Link to="/partners">
                <Button variant="outline" size="sm">
                  View All Partners <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedPartners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))}
            </div>
          </section>
        )}

        {/* Related Blog Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Related Articles</h2>
              <Link to="/blog">
                <Button variant="outline" size="sm">
                  View All Articles <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}
      </div>

      <CompareFloatingBar />
    </PageLayout>
  );
}
