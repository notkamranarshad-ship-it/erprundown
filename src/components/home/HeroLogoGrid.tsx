import { Link } from "react-router-dom";
import { ExternalLink, DollarSign, Building, Cloud, ArrowRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useHeroVendors } from "@/hooks/useHeroVendors";

export function HeroLogoGrid() {
  const { data: vendors, isLoading } = useHeroVendors();

  if (isLoading || !vendors?.length) {
    return (
      <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-px bg-border">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="aspect-square bg-background animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-px bg-border">
          {vendors.map((vendor) => (
            <Tooltip key={vendor.id}>
              <TooltipTrigger asChild>
                <Link
                  to={`/vendors/${vendor.slug}`}
                  className={cn(
                    "group relative flex items-center justify-center bg-background transition-all duration-200",
                    "hover:bg-accent/5 hover:z-10 hover:shadow-md",
                    "aspect-square p-2 sm:p-3"
                  )}
                >
                  {vendor.logo_url ? (
                    <img 
                      src={vendor.logo_url} 
                      alt={vendor.name} 
                      className="h-6 sm:h-7 md:h-8 w-auto max-w-[50px] sm:max-w-[60px] object-contain transition-all duration-200 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span 
                    className={cn(
                      "text-center text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-accent",
                      vendor.logo_url ? "hidden" : "flex"
                    )}
                    style={{ display: vendor.logo_url ? 'none' : 'flex' }}
                  >
                    {vendor.name}
                  </span>
                  
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/30 transition-colors rounded-sm pointer-events-none" />
                </Link>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                className="w-60 p-0 shadow-xl"
                sideOffset={5}
              >
                <div className="rounded-lg border bg-background p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <h4 className="font-semibold text-foreground text-sm">{vendor.name}</h4>
                    <ExternalLink className="h-3.5 w-3.5 text-accent shrink-0" />
                  </div>
                  
                  <p className="mb-3 text-xs text-muted-foreground leading-relaxed">
                    {vendor.short_description || "ERP solution"}
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-foreground">
                      <DollarSign className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span className="font-medium">{vendor.pricing_stance || "Quote-based"}</span>
                    </div>
                    {vendor.company_size_fit && vendor.company_size_fit.length > 0 && (
                      <div className="flex items-center gap-2 text-foreground">
                        <Building className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span>{vendor.company_size_fit.join(' • ')}</span>
                      </div>
                    )}
                    {vendor.deployment && vendor.deployment.length > 0 && (
                      <div className="flex items-center gap-2 text-foreground">
                        <Cloud className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span>{vendor.deployment.join(' • ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <span className="text-[10px] text-accent font-semibold flex items-center gap-1">
                      Click to view details <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
