import { Link } from "react-router-dom";
import { X, ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/hooks/useCompare";
import { useVendorsBySlug } from "@/hooks/useVendors";
import { cn } from "@/lib/utils";

export function HeroComparePreview() {
  const { compareList, removeFromCompare } = useCompare();
  const { data: vendors } = useVendorsBySlug(compareList);

  if (compareList.length === 0) return null;

  return (
    <div className="animate-fade-in rounded-lg border border-accent/30 bg-accent/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-foreground">
            Your Comparison ({compareList.length}/4)
          </span>
        </div>
        <Link to="/compare">
          <Button size="sm" className="h-7 gap-1 bg-accent text-xs hover:bg-accent/90">
            Compare Now
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {vendors?.map((vendor) => (
          <div
            key={vendor.id}
            className={cn(
              "group flex items-center gap-2 rounded-full border bg-background py-1 pl-2 pr-1 transition-all duration-200",
              "hover:border-accent/50 hover:shadow-sm"
            )}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
              {vendor.logo_url ? (
                <img
                  src={vendor.logo_url}
                  alt={vendor.name}
                  className="h-3.5 w-3.5 object-contain"
                />
              ) : (
                <span className="text-[10px] font-bold">
                  {vendor.name.charAt(0)}
                </span>
              )}
            </div>
            <span className="text-xs font-medium text-foreground">
              {vendor.name}
            </span>
            <button
              onClick={() => removeFromCompare(vendor.slug)}
              className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
