import { useState } from "react";
import { Search, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVendors } from "@/hooks/useVendors";
import type { Vendor } from "@/types/database";

interface VendorSelectorProps {
  selectedVendors: Vendor[];
  onAdd: (vendor: Vendor) => void;
  onRemove: (slug: string) => void;
  maxVendors: number;
}

export function VendorSelector({
  selectedVendors,
  onAdd,
  onRemove,
  maxVendors,
}: VendorSelectorProps) {
  const [search, setSearch] = useState("");
  const { data: allVendors } = useVendors();

  const selectedSlugs = selectedVendors.map((v) => v.slug);
  const availableVendors = allVendors?.filter(
    (v) => !selectedSlugs.includes(v.slug) && 
      (search === "" || v.name.toLowerCase().includes(search.toLowerCase()))
  );

  const canAdd = selectedVendors.length < maxVendors;

  return (
    <div className="space-y-4">
      {/* Selected Vendors */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Selected ({selectedVendors.length}/{maxVendors})
        </p>
        {selectedVendors.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">
            No vendors selected yet
          </p>
        ) : (
          <div className="space-y-2">
            {selectedVendors.map((vendor) => (
              <div
                key={vendor.slug}
                className="flex items-center justify-between rounded-lg border bg-muted/50 p-2.5"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-background">
                    {vendor.logo_url ? (
                      <img
                        src={vendor.logo_url}
                        alt={vendor.name}
                        className="h-6 w-6 object-contain"
                      />
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground">
                        {vendor.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium">{vendor.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onRemove(vendor.slug)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search and Add */}
      {canAdd && (
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
          
          <ScrollArea className="h-48">
            <div className="space-y-1 pr-3">
              {availableVendors?.slice(0, 10).map((vendor) => (
                <button
                  key={vendor.slug}
                  onClick={() => onAdd(vendor)}
                  className="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm hover:bg-muted transition-colors"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-muted">
                    {vendor.logo_url ? (
                      <img
                        src={vendor.logo_url}
                        alt={vendor.name}
                        className="h-5 w-5 object-contain"
                      />
                    ) : (
                      <span className="text-xs font-bold text-muted-foreground">
                        {vendor.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{vendor.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {vendor.deployment?.join(", ")}
                    </p>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
              {availableVendors?.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No vendors found
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
