import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageLayout } from "@/components/layout/PageLayout";
import { CaseStudyCard } from "@/components/case-studies/CaseStudyCard";
import { useCaseStudies } from "@/hooks/useCaseStudies";
import { useIndustries } from "@/hooks/useIndustries";
import { useVendors } from "@/hooks/useVendors";

export default function CaseStudiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const selectedIndustry = searchParams.get("industry") || "";
  const selectedVendor = searchParams.get("vendor") || "";
  
  const { data: caseStudies, isLoading } = useCaseStudies({
    industryId: selectedIndustry || undefined,
    vendorId: selectedVendor || undefined,
  });
  
  const { data: industries } = useIndustries();
  const { data: vendors } = useVendors();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  return (
    <PageLayout>
      {/* Header */}
      <section className="border-b bg-muted/30 py-8">
        <div className="container-page">
          <h1 className="text-3xl font-bold text-foreground">Case Studies</h1>
          <p className="mt-2 text-muted-foreground">
            Real-world ERP implementation success stories
          </p>
        </div>
      </section>

      <div className="container-page py-8">
        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <Select
            value={selectedIndustry}
            onValueChange={(value) => updateFilter("industry", value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Industries</SelectItem>
              {industries?.map((ind) => (
                <SelectItem key={ind.id} value={ind.id}>
                  {ind.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedVendor}
            onValueChange={(value) => updateFilter("vendor", value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Vendors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Vendors</SelectItem>
              {vendors?.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Case Studies Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : caseStudies && caseStudies.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((cs) => (
              <CaseStudyCard key={cs.id} caseStudy={cs} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">
              {selectedIndustry || selectedVendor
                ? "No case studies found matching your filters."
                : "No case studies available yet."}
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}