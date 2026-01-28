import { X, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout } from "@/components/layout/PageLayout";
import { LeadForm } from "@/components/forms/LeadForm";
import { useCompare } from "@/hooks/useCompare";
import { useVendorsBySlug } from "@/hooks/useVendors";

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { data: vendors, isLoading } = useVendorsBySlug(compareList);

  if (compareList.length === 0) {
    return (
      <PageLayout>
        <div className="container-page py-16 text-center">
          <h1 className="text-3xl font-bold text-foreground">Compare ERP Vendors</h1>
          <p className="mt-4 text-muted-foreground">
            You haven't selected any vendors to compare yet.
          </p>
          <Link to="/vendors">
            <Button className="mt-6">Browse Vendors</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header */}
      <section className="border-b bg-muted/30 py-8">
        <div className="container-page">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Compare ERP Vendors</h1>
              <p className="mt-2 text-muted-foreground">
                Comparing {compareList.length} vendor{compareList.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <LeadForm
                vendorSlugs={compareList}
                triggerLabel="Request Demos for All"
                title="Request Demos"
                description="Get personalized demos and pricing for your selected vendors."
              />
              <Button variant="outline" onClick={clearCompare}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page py-8">
        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-4">
            {compareList.map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : vendors && vendors.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="inline-flex min-w-full gap-6 pb-4">
              {vendors.map((vendor) => (
                <Card key={vendor.id} className="w-80 shrink-0">
                  <CardHeader className="relative pb-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-6 w-6"
                      onClick={() => removeFromCompare(vendor.slug)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        {vendor.logo_url ? (
                          <img
                            src={vendor.logo_url}
                            alt={vendor.name}
                            className="h-10 w-10 object-contain"
                          />
                        ) : (
                          <span className="text-lg font-bold text-muted-foreground">
                            {vendor.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-lg">
                        <Link
                          to={`/vendors/${vendor.slug}`}
                          className="hover:text-accent"
                        >
                          {vendor.name}
                        </Link>
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <p className="line-clamp-2 text-muted-foreground">
                      {vendor.short_description}
                    </p>

                    {/* Deployment */}
                    <div>
                      <span className="font-medium">Deployment</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {vendor.deployment?.map((d) => (
                          <Badge key={d} variant="secondary" className="text-xs">
                            {d}
                          </Badge>
                        )) || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </div>

                    {/* Company Size */}
                    <div>
                      <span className="font-medium">Company Size</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {vendor.company_size_fit?.map((s) => (
                          <Badge key={s} variant="outline" className="text-xs">
                            {s}
                          </Badge>
                        )) || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </div>

                    {/* Industries */}
                    <div>
                      <span className="font-medium">Industries</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {vendor.industries?.slice(0, 3).map((ind) => (
                          <Badge
                            key={ind.id}
                            className="bg-accent/10 text-accent text-xs"
                          >
                            {ind.name}
                          </Badge>
                        )) || (
                          <span className="text-muted-foreground">-</span>
                        )}
                        {(vendor.industries?.length || 0) > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{(vendor.industries?.length || 0) - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <span className="font-medium">Key Features</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {vendor.features?.slice(0, 4).map((f) => (
                          <Badge key={f.id} variant="secondary" className="text-xs">
                            {f.name}
                          </Badge>
                        )) || (
                          <span className="text-muted-foreground">-</span>
                        )}
                        {(vendor.features?.length || 0) > 4 && (
                          <span className="text-xs text-muted-foreground">
                            +{(vendor.features?.length || 0) - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div>
                      <span className="font-medium">Pricing</span>
                      <p className="mt-1 text-muted-foreground">
                        {vendor.pricing_stance}
                      </p>
                    </div>

                    {/* Implementation */}
                    <div>
                      <span className="font-medium">Implementation</span>
                      <p className="mt-1 text-muted-foreground">
                        {vendor.implementation_time}
                      </p>
                    </div>

                    {/* Integrations */}
                    <div>
                      <span className="font-medium">Integrations</span>
                      <div className="mt-1">
                        {vendor.integrations && vendor.integrations.length > 0 ? (
                          <>
                            <div className="flex flex-wrap gap-1">
                              {vendor.integrations.slice(0, 4).map((int, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {int}
                                </Badge>
                              ))}
                            </div>
                            {vendor.integrations.length > 4 && (
                              <span className="mt-1 block text-xs text-muted-foreground">
                                +{vendor.integrations.length - 4} more
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2">
                      <Link to={`/vendors/${vendor.slug}`}>
                        <Button variant="outline" className="w-full" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">
              Unable to load vendor information.
            </p>
          </div>
        )}

        {/* Add More Vendors */}
        {compareList.length < 4 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              You can compare up to 4 vendors. Add{" "}
              {4 - compareList.length} more.
            </p>
            <Link to="/vendors">
              <Button variant="outline" className="mt-2">
                Browse More Vendors
              </Button>
            </Link>
          </div>
        )}
      </div>
    </PageLayout>
  );
}