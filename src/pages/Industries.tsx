import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageLayout } from "@/components/layout/PageLayout";
import { IndustryCard } from "@/components/industries/IndustryCard";
import { useIndustries } from "@/hooks/useIndustries";

export default function IndustriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: industries, isLoading } = useIndustries({ search: searchQuery });

  return (
    <PageLayout>
      {/* Header */}
      <section className="border-b bg-muted/30 py-8">
        <div className="container-page">
          <h1 className="text-3xl font-bold text-foreground">
            ERP Solutions by Industry
          </h1>
          <p className="mt-2 text-muted-foreground">
            Find the right ERP for your specific industry requirements
          </p>
        </div>
      </section>

      <div className="container-page py-8">
        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search industries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Industries Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : industries && industries.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {industries.map((industry) => (
              <IndustryCard key={industry.id} industry={industry} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">
              {searchQuery
                ? "No industries found matching your search."
                : "No industries available yet."}
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}