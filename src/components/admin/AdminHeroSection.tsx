import { useState, useEffect } from "react";
import { Save, LayoutGrid, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useVendors } from "@/hooks/useVendors";
import { useHeroVendors, useSetHeroVendors } from "@/hooks/useHeroVendors";

export function AdminHeroSection() {
  const { data: allVendors, isLoading: loadingVendors } = useVendors();
  const { data: heroVendors, isLoading: loadingHero } = useHeroVendors();
  const setHeroVendors = useSetHeroVendors();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (heroVendors) {
      setSelectedIds(heroVendors.map((v) => v.id));
    }
  }, [heroVendors]);

  const toggleVendor = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((vid) => vid !== id);
      if (prev.length >= 20) return prev;
      return [...prev, id];
    });
  };

  const handleSave = () => {
    setHeroVendors.mutate(selectedIds);
  };

  const isLoading = loadingVendors || loadingHero;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5" />
            Hero Banner Vendors
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Select up to 20 vendors to display in the homepage hero grid.{" "}
            <Badge variant="secondary">{selectedIds.length}/20 selected</Badge>
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={setHeroVendors.isPending}
          size="sm"
        >
          <Save className="h-4 w-4 mr-2" />
          {setHeroVendors.isPending ? "Saving..." : "Save Selection"}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : allVendors && allVendors.length > 0 ? (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {allVendors.map((vendor) => {
              const isSelected = selectedIds.includes(vendor.id);
              return (
                <button
                  key={vendor.id}
                  type="button"
                  onClick={() => toggleVendor(vendor.id)}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all text-left",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-muted-foreground/30 hover:bg-muted/50",
                    !isSelected && selectedIds.length >= 20 && "opacity-40 cursor-not-allowed"
                  )}
                  disabled={!isSelected && selectedIds.length >= 20}
                >
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                  {vendor.logo_url ? (
                    <img
                      src={vendor.logo_url}
                      alt={vendor.name}
                      className="h-8 w-auto max-w-[60px] object-contain"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {vendor.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-medium text-foreground text-center truncate w-full">
                    {vendor.name}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No vendors found. Add vendors first.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
