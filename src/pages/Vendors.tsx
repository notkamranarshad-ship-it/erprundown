import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Filter, Grid, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PageLayout } from "@/components/layout/PageLayout";
import { VendorCard } from "@/components/vendors/VendorCard";
import { CompareFloatingBar } from "@/components/compare/CompareFloatingBar";
import { useVendors } from "@/hooks/useVendors";
import { useIndustries } from "@/hooks/useIndustries";
import type { DeploymentType, CompanySize } from "@/types/database";

const deploymentOptions: DeploymentType[] = ["SaaS", "On-Prem", "Hybrid"];
const companySizeOptions: CompanySize[] = ["Small", "Mid-market", "Enterprise"];

export default function VendorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const searchQuery = searchParams.get("search") || "";
  const selectedDeployment = searchParams.getAll("deployment");
  const selectedSize = searchParams.getAll("size");
  const selectedIndustry = searchParams.get("industry") || "";
  const sortBy = searchParams.get("sort") || "featured";

  const { data: vendors, isLoading } = useVendors({ search: searchQuery });
  const { data: industries } = useIndustries();

  // Filter vendors client-side
  const filteredVendors = useMemo(() => {
    if (!vendors) return [];
    
    return vendors.filter((vendor) => {
      // Deployment filter
      if (selectedDeployment.length > 0) {
        const hasMatch = vendor.deployment?.some((d) =>
          selectedDeployment.includes(d)
        );
        if (!hasMatch) return false;
      }

      // Company size filter
      if (selectedSize.length > 0) {
        const hasMatch = vendor.company_size_fit?.some((s) =>
          selectedSize.includes(s)
        );
        if (!hasMatch) return false;
      }

      // Industry filter
      if (selectedIndustry) {
        const hasMatch = vendor.industries?.some(
          (i) => i.slug === selectedIndustry
        );
        if (!hasMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "featured") {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
      }
      return a.name.localeCompare(b.name);
    });
  }, [vendors, selectedDeployment, selectedSize, selectedIndustry, sortBy]);

  const updateFilter = (key: string, value: string, add: boolean) => {
    const current = new URLSearchParams(searchParams);
    if (key === "deployment" || key === "size") {
      if (add) {
        current.append(key, value);
      } else {
        const values = current.getAll(key).filter((v) => v !== value);
        current.delete(key);
        values.forEach((v) => current.append(key, v));
      }
    } else {
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    }
    setSearchParams(current);
  };

  const clearFilters = () => {
    const current = new URLSearchParams();
    if (searchQuery) current.set("search", searchQuery);
    setSearchParams(current);
  };

  const activeFilterCount =
    selectedDeployment.length +
    selectedSize.length +
    (selectedIndustry ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Deployment Type */}
      <div>
        <h4 className="mb-3 font-medium text-foreground">Deployment</h4>
        <div className="space-y-2">
          {deploymentOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`deployment-${option}`}
                checked={selectedDeployment.includes(option)}
                onCheckedChange={(checked) =>
                  updateFilter("deployment", option, !!checked)
                }
              />
              <Label htmlFor={`deployment-${option}`} className="text-sm">
                {option}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Company Size */}
      <div>
        <h4 className="mb-3 font-medium text-foreground">Company Size</h4>
        <div className="space-y-2">
          {companySizeOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${option}`}
                checked={selectedSize.includes(option)}
                onCheckedChange={(checked) =>
                  updateFilter("size", option, !!checked)
                }
              />
              <Label htmlFor={`size-${option}`} className="text-sm">
                {option}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Industry */}
      <div>
        <h4 className="mb-3 font-medium text-foreground">Industry</h4>
        <Select
          value={selectedIndustry}
          onValueChange={(value) => updateFilter("industry", value, true)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All industries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All industries</SelectItem>
            {industries?.map((ind) => (
              <SelectItem key={ind.id} value={ind.slug}>
                {ind.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {activeFilterCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <PageLayout>
      {/* Header */}
      <section className="border-b bg-muted/30 py-8">
        <div className="container-page">
          <h1 className="text-3xl font-bold text-foreground">ERP Vendors</h1>
          <p className="mt-2 text-muted-foreground">
            Compare and find the best ERP software for your business
          </p>
        </div>
      </section>

      <div className="container-page py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24">
              <h3 className="mb-4 font-semibold text-foreground">Filters</h3>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
              {/* Search */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const input = form.elements.namedItem("search") as HTMLInputElement;
                  updateFilter("search", input.value, true);
                }}
                className="relative flex-1"
              >
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="search"
                  type="search"
                  placeholder="Search vendors..."
                  defaultValue={searchQuery}
                  className="pl-9"
                />
              </form>

              {/* Mobile Filter Button */}
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge className="ml-2" variant="secondary">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select
                value={sortBy}
                onValueChange={(value) => updateFilter("sort", value, true)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured First</SelectItem>
                  <SelectItem value="name">Alphabetical</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="hidden items-center rounded-lg border p-1 sm:flex">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedDeployment.map((d) => (
                  <Badge key={d} variant="secondary" className="gap-1">
                    {d}
                    <button
                      onClick={() => updateFilter("deployment", d, false)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedSize.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1">
                    {s}
                    <button
                      onClick={() => updateFilter("size", s, false)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedIndustry && (
                  <Badge variant="secondary" className="gap-1">
                    {industries?.find((i) => i.slug === selectedIndustry)?.name}
                    <button
                      onClick={() => updateFilter("industry", "", true)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Results */}
            {isLoading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                    : "space-y-4"
                }
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : filteredVendors.length > 0 ? (
              <>
                <p className="mb-4 text-sm text-muted-foreground">
                  {filteredVendors.length} vendor{filteredVendors.length !== 1 ? "s" : ""} found
                </p>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                      : "space-y-4"
                  }
                >
                  {filteredVendors.map((vendor) => (
                    <VendorCard key={vendor.id} vendor={vendor} />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <p className="text-muted-foreground">
                  No vendors found matching your criteria.
                </p>
                <Button variant="link" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CompareFloatingBar />
    </PageLayout>
  );
}