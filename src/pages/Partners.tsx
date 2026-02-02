import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Grid, List, X, Award } from "lucide-react";
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
import { PageLayout } from "@/components/layout/PageLayout";
import { PartnerCard } from "@/components/partners/PartnerCard";
import { PartnerSidebar } from "@/components/partners/PartnerSidebar";
import { usePartners } from "@/hooks/usePartners";

export default function PartnersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const searchQuery = searchParams.get("search") || "";
  const selectedErps = searchParams.getAll("erp");
  const selectedRegions = searchParams.getAll("region");
  const selectedIndustries = searchParams.getAll("industry");
  const sortBy = searchParams.get("sort") || "featured";

  const { data: partners, isLoading } = usePartners({ search: searchQuery });

  // Filter partners client-side
  const filteredPartners = useMemo(() => {
    if (!partners) return [];
    
    return partners.filter((partner) => {
      // ERP filter
      if (selectedErps.length > 0) {
        const hasMatch = partner.erp_specializations?.some((e) =>
          selectedErps.includes(e)
        );
        if (!hasMatch) return false;
      }

      // Region filter
      if (selectedRegions.length > 0) {
        const hasMatch = partner.regions_served?.some((r) =>
          selectedRegions.includes(r)
        );
        if (!hasMatch) return false;
      }

      // Industry filter
      if (selectedIndustries.length > 0) {
        const hasMatch = partner.industries_served?.some((i) =>
          selectedIndustries.includes(i)
        );
        if (!hasMatch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "featured") {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
      }
      if (sortBy === "years") {
        return (b.year_founded || 0) - (a.year_founded || 0);
      }
      return a.name.localeCompare(b.name);
    });
  }, [partners, selectedErps, selectedRegions, selectedIndustries, sortBy]);

  const updateFilter = (key: string, value: string, add: boolean) => {
    const current = new URLSearchParams(searchParams);
    
    if (add) {
      current.append(key, value);
    } else {
      const values = current.getAll(key).filter((v) => v !== value);
      current.delete(key);
      values.forEach((v) => current.append(key, v));
    }
    setSearchParams(current);
  };

  const clearFilters = () => {
    const current = new URLSearchParams();
    if (searchQuery) current.set("search", searchQuery);
    setSearchParams(current);
  };

  const activeFilterCount =
    selectedErps.length +
    selectedRegions.length +
    selectedIndustries.length;

  return (
    <PageLayout>
      {/* Header */}
      <section className="border-b bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
        <div className="container-page">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-8 w-8 text-primary" />
            <Badge variant="outline" className="text-primary border-primary/30">
              20+ Certified Partners
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            ERP Implementation Partners
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Find certified consultants and system integrators to help you select, 
            implement, and optimize your ERP solution.
          </p>
        </div>
      </section>

      <div className="container-page py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24">
              <PartnerSidebar
                selectedErps={selectedErps}
                selectedRegions={selectedRegions}
                selectedIndustries={selectedIndustries}
                onUpdateFilter={updateFilter}
                onClearFilters={clearFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
          </div>

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
                  const newParams = new URLSearchParams(searchParams);
                  if (input.value) {
                    newParams.set("search", input.value);
                  } else {
                    newParams.delete("search");
                  }
                  setSearchParams(newParams);
                }}
                className="relative flex-1"
              >
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="search"
                  type="search"
                  placeholder="Search partners..."
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
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <PartnerSidebar
                      selectedErps={selectedErps}
                      selectedRegions={selectedRegions}
                      selectedIndustries={selectedIndustries}
                      onUpdateFilter={updateFilter}
                      onClearFilters={clearFilters}
                      activeFilterCount={activeFilterCount}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select
                value={sortBy}
                onValueChange={(value) => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("sort", value);
                  setSearchParams(newParams);
                }}
              >
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured First</SelectItem>
                  <SelectItem value="name">Alphabetical</SelectItem>
                  <SelectItem value="years">Years in Business</SelectItem>
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
                {selectedErps.map((e) => (
                  <Badge key={`erp-${e}`} variant="secondary" className="gap-1 pl-2">
                    ERP: {e}
                    <button
                      onClick={() => updateFilter("erp", e, false)}
                      className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedRegions.map((r) => (
                  <Badge key={`region-${r}`} variant="secondary" className="gap-1 pl-2">
                    Region: {r}
                    <button
                      onClick={() => updateFilter("region", r, false)}
                      className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedIndustries.map((i) => (
                  <Badge key={`industry-${i}`} variant="secondary" className="gap-1 pl-2">
                    Industry: {i}
                    <button
                      onClick={() => updateFilter("industry", i, false)}
                      className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-xs text-accent hover:underline ml-2"
                >
                  Clear all
                </button>
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
                  <div key={i} className="h-72 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : filteredPartners.length > 0 ? (
              <>
                <p className="mb-4 text-sm text-muted-foreground">
                  {filteredPartners.length} partner{filteredPartners.length !== 1 ? "s" : ""} found
                </p>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                      : "space-y-4"
                  }
                >
                  {filteredPartners.map((partner) => (
                    <PartnerCard key={partner.id} partner={partner} />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed p-12 text-center">
                <p className="text-muted-foreground">
                  No partners found matching your criteria.
                </p>
                <Button variant="link" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
