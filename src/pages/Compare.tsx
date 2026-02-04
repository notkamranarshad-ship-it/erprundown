import { useState, useCallback } from "react";
import { Scale, RotateCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLayout } from "@/components/layout/PageLayout";
import { LeadForm } from "@/components/forms/LeadForm";
import { CompareVendorGrid } from "@/components/compare/CompareVendorGrid";
import { CompareVerticalCards } from "@/components/compare/CompareVerticalCards";
import { CompareSidebarLeft } from "@/components/compare/CompareSidebarLeft";
import { CompareSidebarRight } from "@/components/compare/CompareSidebarRight";
import { useVendors, useVendorsBySlug } from "@/hooks/useVendors";

const MAX_COMPARE_ITEMS = 6;
const MIN_COMPARE_ITEMS = 2;

export default function ComparePage() {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const { data: allVendors, isLoading: isLoadingAll } = useVendors();
  const { data: selectedVendors, isLoading: isLoadingSelected } = useVendorsBySlug(selectedSlugs);

  const toggleVendor = useCallback((slug: string) => {
    setSelectedSlugs((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      }
      if (prev.length >= MAX_COMPARE_ITEMS) return prev;
      return [...prev, slug];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedSlugs([]);
  }, []);

  const canCompare = selectedSlugs.length >= MIN_COMPARE_ITEMS;

  return (
    <PageLayout>
      {/* Hero Header */}
      <section className="border-b bg-gradient-to-br from-muted/50 to-background py-12 lg:py-16">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
              <Scale className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">ERP Comparison Tool</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Compare ERP Solutions
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Select 2-6 vendors to see a detailed side-by-side comparison. Evaluate features, pricing, 
              deployment options, and more to find the perfect ERP for your business.
            </p>
          </div>
        </div>
      </section>

      <div className="container-page py-8 lg:py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-2 xl:col-span-2">
            <div className="sticky top-24">
              <CompareSidebarLeft />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-8 xl:col-span-8">
            {/* Selection Controls */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {selectedSlugs.length} / {MAX_COMPARE_ITEMS} selected
                </Badge>
                {!canCompare && selectedSlugs.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    Select at least {MIN_COMPARE_ITEMS - selectedSlugs.length} more to compare
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {selectedSlugs.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearSelection}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                )}
                {canCompare && (
                  <LeadForm
                    vendorSlugs={selectedSlugs}
                    triggerLabel="Request Demos"
                    title="Request Demos for Selected Vendors"
                    description="Get personalized demos and pricing from our team."
                  />
                )}
              </div>
            </div>

            {/* Vendor Selection Grid */}
            {isLoadingAll ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : allVendors && allVendors.length > 0 ? (
              <CompareVendorGrid
                vendors={allVendors}
                selectedSlugs={selectedSlugs}
                onToggle={toggleVendor}
                maxSelection={MAX_COMPARE_ITEMS}
              />
            ) : (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <p className="text-muted-foreground">No vendors available.</p>
              </div>
            )}

            {/* Comparison Results */}
            {canCompare && (
              <section className="mt-12 pt-8 border-t">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    Comparison Results
                  </h2>
                  <Button variant="outline" size="sm" asChild>
                    <a href="#top">
                      <ArrowRight className="mr-2 h-4 w-4 rotate-[-90deg]" />
                      Back to Selection
                    </a>
                  </Button>
                </div>

                {isLoadingSelected ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {selectedSlugs.map((_, i) => (
                      <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
                    ))}
                  </div>
                ) : selectedVendors && selectedVendors.length > 0 ? (
                  <CompareVerticalCards
                    vendors={selectedVendors}
                    onRemove={toggleVendor}
                  />
                ) : (
                  <div className="rounded-lg border border-dashed p-12 text-center">
                    <p className="text-muted-foreground">Unable to load comparison data.</p>
                  </div>
                )}
              </section>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-2 xl:col-span-2">
            <div className="sticky top-24">
              <CompareSidebarRight selectedVendors={selectedSlugs} />
            </div>
          </aside>
        </div>

        {/* Mobile Sidebars */}
        <div className="lg:hidden mt-12 grid gap-6 sm:grid-cols-2">
          <CompareSidebarLeft />
          <CompareSidebarRight selectedVendors={selectedSlugs} />
        </div>
      </div>
    </PageLayout>
  );
}
