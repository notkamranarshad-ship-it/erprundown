import { useState, useMemo } from "react";
import { Search, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FaviconImg } from "@/components/ui/favicon-img";
import { cn } from "@/lib/utils";
import type { Vendor } from "@/types/database";

interface CompareVendorGridProps {
  vendors: Vendor[];
  selectedSlugs: string[];
  onToggle: (slug: string) => void;
  maxSelection: number;
}

export function CompareVendorGrid({
  vendors,
  selectedSlugs,
  onToggle,
  maxSelection,
}: CompareVendorGridProps) {
  const [search, setSearch] = useState("");

  const filteredVendors = useMemo(() => {
    if (!search.trim()) return vendors;
    const q = search.toLowerCase();
    return vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.short_description?.toLowerCase().includes(q)
    );
  }, [vendors, search]);

  const canAddMore = selectedSlugs.length < maxSelection;

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search vendors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Selection Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedSlugs.length} of {maxSelection} selected
        </p>
        {selectedSlugs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedSlugs.map((slug) => {
              const vendor = vendors.find((v) => v.slug === slug);
              return (
                <Badge
                  key={slug}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  {vendor?.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 hover:bg-destructive/20"
                    onClick={() => onToggle(slug)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      {/* Vendor Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredVendors.map((vendor) => {
          const isSelected = selectedSlugs.includes(vendor.slug);
          const isDisabled = !isSelected && !canAddMore;

          return (
            <Card
              key={vendor.id}
              className={cn(
                "relative cursor-pointer transition-all hover:shadow-md",
                isSelected && "ring-2 ring-primary bg-primary/5",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !isDisabled && onToggle(vendor.slug)}
            >
              <CardContent className="p-4 text-center">
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}

                {/* Logo */}
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <FaviconImg logoUrl={vendor.logo_url} websiteUrl={vendor.website_url} name={vendor.name} className="h-9 w-9" />
                </div>

                {/* Name */}
                <p className="font-medium text-sm text-foreground line-clamp-1">
                  {vendor.name}
                </p>

                {/* Sponsored Badge */}
                {vendor.sponsored && (
                  <Badge variant="outline" className="mt-2 text-[10px]">
                    Sponsored
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No vendors found matching "{search}"
        </div>
      )}
    </div>
  );
}
