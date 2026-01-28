import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Building2, Package, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/layout/PageLayout";
import { VendorCard } from "@/components/vendors/VendorCard";
import { CompareFloatingBar } from "@/components/compare/CompareFloatingBar";
import { useCaseStudy, useCaseStudies } from "@/hooks/useCaseStudies";
import { format } from "date-fns";

export default function CaseStudyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: caseStudy, isLoading, error } = useCaseStudy(slug || "");
  const { data: allCaseStudies } = useCaseStudies();

  // Related case studies (same industry or vendor)
  const relatedCaseStudies = allCaseStudies
    ?.filter(
      (cs) =>
        cs.id !== caseStudy?.id &&
        (cs.industry_id === caseStudy?.industry_id ||
          cs.vendor_id === caseStudy?.vendor_id)
    )
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

  if (error || !caseStudy) {
    return (
      <PageLayout>
        <div className="container-page py-12 text-center">
          <h1 className="text-2xl font-bold">Case Study not found</h1>
          <p className="mt-2 text-muted-foreground">
            The case study you're looking for doesn't exist.
          </p>
          <Link to="/case-studies">
            <Button className="mt-4">Browse Case Studies</Button>
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
            to="/case-studies"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Case Studies
          </Link>
        </div>
      </div>

      <article className="container-page py-12">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              {caseStudy.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {caseStudy.industry && (
                <Link
                  to={`/industries/${caseStudy.industry.slug}`}
                  className="flex items-center gap-1 hover:text-accent"
                >
                  <Building2 className="h-4 w-4" />
                  {caseStudy.industry.name}
                </Link>
              )}
              {caseStudy.vendor && (
                <Link
                  to={`/vendors/${caseStudy.vendor.slug}`}
                  className="flex items-center gap-1 hover:text-accent"
                >
                  <Package className="h-4 w-4" />
                  {caseStudy.vendor.name}
                </Link>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(caseStudy.published_at), "MMMM d, yyyy")}
              </span>
            </div>
          </header>

          {/* Featured Image */}
          {caseStudy.featured_image && (
            <div className="mb-8 overflow-hidden rounded-lg">
              <img
                src={caseStudy.featured_image}
                alt={caseStudy.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Summary */}
          {caseStudy.summary && (
            <div className="mb-8 rounded-lg bg-muted/50 p-6">
              <p className="text-lg text-muted-foreground">{caseStudy.summary}</p>
            </div>
          )}

          {/* Metrics */}
          {caseStudy.metrics && caseStudy.metrics.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Key Results</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {caseStudy.metrics.map((metric, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border p-4"
                  >
                    <CheckCircle className="h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm">{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-accent prose-strong:text-foreground">
            {caseStudy.content ? (
              <div dangerouslySetInnerHTML={{ __html: caseStudy.content }} />
            ) : (
              <p>{caseStudy.summary}</p>
            )}
          </div>

          {/* Related Vendor */}
          {caseStudy.vendor && (
            <section className="mt-12 border-t pt-12">
              <h2 className="mb-6 text-xl font-semibold">Featured Vendor</h2>
              <VendorCard vendor={caseStudy.vendor} />
            </section>
          )}

          {/* Related Case Studies */}
          {relatedCaseStudies && relatedCaseStudies.length > 0 && (
            <section className="mt-12 border-t pt-12">
              <h2 className="mb-6 text-xl font-semibold">Related Case Studies</h2>
              <div className="grid gap-6 sm:grid-cols-3">
                {relatedCaseStudies.map((cs) => (
                  <Link key={cs.id} to={`/case-studies/${cs.slug}`}>
                    <Card className="card-hover h-full">
                      <CardContent className="p-4">
                        <h3 className="line-clamp-2 font-medium">{cs.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {cs.summary}
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