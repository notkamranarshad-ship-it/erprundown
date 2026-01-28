import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { VendorCard } from "@/components/vendors/VendorCard";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { CaseStudyCard } from "@/components/case-studies/CaseStudyCard";
import { CompareFloatingBar } from "@/components/compare/CompareFloatingBar";
import { useIndustry } from "@/hooks/useIndustries";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useCaseStudies } from "@/hooks/useCaseStudies";

export default function IndustryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: industry, isLoading, error } = useIndustry(slug || "");
  const { data: caseStudies } = useCaseStudies({ industryId: industry?.id });
  const { data: blogPosts } = useBlogPosts();

  // Filter blog posts that relate to this industry
  // Note: We'll need to enhance this once we have the full relation data
  const relatedPosts = blogPosts?.slice(0, 3);

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

      <div className="container-page py-12">
        {/* Overview */}
        {industry.overview && (
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Overview</h2>
            <div className="prose max-w-none text-muted-foreground">
              <p>{industry.overview}</p>
            </div>
          </section>
        )}

        {/* Key Requirements */}
        {industry.key_requirements && (
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Key ERP Requirements</h2>
            <div className="prose max-w-none text-muted-foreground">
              <p>{industry.key_requirements}</p>
            </div>
          </section>
        )}

        {/* Recommended Vendors */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold">
            Recommended Vendors for {industry.name}
          </h2>
          {industry.vendors && industry.vendors.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {industry.vendors.map((vendor) => (
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

        {/* Case Studies */}
        {caseStudies && caseStudies.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold">
              {industry.name} Case Studies
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudies.slice(0, 3).map((cs) => (
                <CaseStudyCard key={cs.id} caseStudy={cs} />
              ))}
            </div>
          </section>
        )}

        {/* Related Blog Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl font-semibold">Related Articles</h2>
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