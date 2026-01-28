import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Calendar, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/layout/PageLayout";
import { VendorCard } from "@/components/vendors/VendorCard";
import { LeadForm } from "@/components/forms/LeadForm";
import { CompareFloatingBar } from "@/components/compare/CompareFloatingBar";
import { useVendor, useVendors } from "@/hooks/useVendors";
import { useCaseStudies } from "@/hooks/useCaseStudies";
import { useCompare } from "@/hooks/useCompare";
import { format } from "date-fns";

export default function VendorDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: vendor, isLoading, error } = useVendor(slug || "");
  const { isInCompare, toggleCompare, canAddMore } = useCompare();

  // Get related vendors (same industries)
  const { data: allVendors } = useVendors();
  const relatedVendors = allVendors
    ?.filter(
      (v) =>
        v.id !== vendor?.id &&
        v.industries?.some((ind) =>
          vendor?.industries?.some((vi) => vi.id === ind.id)
        )
    )
    .slice(0, 3);

  // Get case studies for this vendor
  const { data: caseStudies } = useCaseStudies({ vendorId: vendor?.id });

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

  if (error || !vendor) {
    return (
      <PageLayout>
        <div className="container-page py-12 text-center">
          <h1 className="text-2xl font-bold">Vendor not found</h1>
          <p className="mt-2 text-muted-foreground">
            The vendor you're looking for doesn't exist.
          </p>
          <Link to="/vendors">
            <Button className="mt-4">Browse Vendors</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const inCompare = isInCompare(vendor.slug);

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container-page py-4">
          <Link
            to="/vendors"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vendors
          </Link>
        </div>
      </div>

      <div className="container-page py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted">
                  {vendor.logo_url ? (
                    <img
                      src={vendor.logo_url}
                      alt={`${vendor.name} logo`}
                      className="h-12 w-12 object-contain"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-muted-foreground">
                      {vendor.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                      {vendor.name}
                    </h1>
                    {vendor.sponsored && (
                      <Badge variant="outline">
                        {vendor.sponsor_label || "Sponsored"}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    {vendor.short_description}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <LeadForm
                  vendorSlugs={[vendor.slug]}
                  triggerLabel="Request Demo"
                />
                <Button
                  variant={inCompare ? "default" : "outline"}
                  onClick={() => toggleCompare(vendor.slug)}
                  disabled={!inCompare && !canAddMore}
                >
                  {inCompare ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Added
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Compare
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Info Badges */}
            <div className="mb-8 flex flex-wrap gap-2">
              {vendor.deployment?.map((type) => (
                <Badge key={type} variant="secondary">
                  {type}
                </Badge>
              ))}
              {vendor.company_size_fit?.map((size) => (
                <Badge key={size} className="bg-accent/10 text-accent">
                  {size}
                </Badge>
              ))}
            </div>

            {/* Overview */}
            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Overview</h2>
              <div className="prose max-w-none text-muted-foreground">
                <p>{vendor.long_description || vendor.short_description}</p>
              </div>
            </section>

            {/* Best For */}
            {vendor.industries && vendor.industries.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold">Best For</h2>
                <div className="flex flex-wrap gap-2">
                  {vendor.industries.map((ind) => (
                    <Link key={ind.id} to={`/industries/${ind.slug}`}>
                      <Badge variant="outline" className="hover:bg-muted">
                        {ind.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Key Features */}
            {vendor.features && vendor.features.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold">Key Features</h2>
                <div className="flex flex-wrap gap-2">
                  {vendor.features.map((feat) => (
                    <Badge key={feat.id} variant="secondary">
                      {feat.name}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Integrations */}
            {vendor.integrations && vendor.integrations.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold">Integrations</h2>
                <div className="flex flex-wrap gap-2">
                  {vendor.integrations.map((int, i) => (
                    <Badge key={i} variant="outline">
                      {int}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Pros and Cons */}
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              {vendor.pros && vendor.pros.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-success">Pros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {vendor.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="mt-1 text-success">✓</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {vendor.cons && vendor.cons.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-destructive">Cons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {vendor.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="mt-1 text-destructive">✗</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Screenshots */}
            {vendor.screenshots && vendor.screenshots.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold">Screenshots</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {vendor.screenshots.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`${vendor.name} screenshot ${i + 1}`}
                      className="rounded-lg border"
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Pricing</span>
                    <p className="font-medium">{vendor.pricing_stance}</p>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Implementation Time
                    </span>
                    <p className="font-medium">{vendor.implementation_time}</p>
                  </div>
                  {vendor.website_url && (
                    <>
                      <Separator />
                      <a
                        href={vendor.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-accent hover:underline"
                      >
                        Visit Website
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* CTA Card */}
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-semibold">
                    Ready to learn more?
                  </h3>
                  <p className="mb-4 text-sm text-primary-foreground/80">
                    Get a personalized demo and pricing for {vendor.name}.
                  </p>
                  <LeadForm
                    vendorSlugs={[vendor.slug]}
                    triggerLabel="Request Demo"
                    triggerVariant="secondary"
                  />
                </CardContent>
              </Card>

              {/* Last Updated */}
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Last updated: {format(new Date(vendor.updated_at), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>

        {/* Related Vendors */}
        {relatedVendors && relatedVendors.length > 0 && (
          <section className="mt-12 border-t pt-12">
            <h2 className="mb-6 text-xl font-semibold">Related Vendors</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedVendors.map((v) => (
                <VendorCard key={v.id} vendor={v} />
              ))}
            </div>
          </section>
        )}

        {/* Case Studies */}
        {caseStudies && caseStudies.length > 0 && (
          <section className="mt-12 border-t pt-12">
            <h2 className="mb-6 text-xl font-semibold">
              Case Studies featuring {vendor.name}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {caseStudies.slice(0, 3).map((cs) => (
                <Link key={cs.id} to={`/case-studies/${cs.slug}`}>
                  <Card className="card-hover h-full">
                    <CardContent className="p-6">
                      <h3 className="mb-2 font-semibold">{cs.title}</h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
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

      <CompareFloatingBar />
    </PageLayout>
  );
}