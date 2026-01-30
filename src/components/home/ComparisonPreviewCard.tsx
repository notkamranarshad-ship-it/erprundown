import { Link } from "react-router-dom";
import { Plus, Check, ExternalLink, TrendingUp, Users, Clock, DollarSign } from "lucide-react";
import { useCompare } from "@/hooks/useCompare";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ComparisonVendor {
  brand: string;
  name: string;
  slug: string;
  priceRange: string;
  costPerUser: string;
  deployment: string[];
  retention: string;
  logo: string | null;
  description?: string;
  pros?: string[];
  implementation?: string;
}

interface ComparisonPreviewCardProps {
  vendors: ComparisonVendor[];
}

export function ComparisonPreviewCard({ vendors }: ComparisonPreviewCardProps) {
  const { isInCompare, toggleCompare, canAddMore } = useCompare();

  return (
    <TooltipProvider delayDuration={200}>
      <div className="rounded-xl border bg-card shadow-xl transition-shadow duration-300 hover:shadow-2xl">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400 transition-transform hover:scale-110"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-400 transition-transform hover:scale-110"></div>
            <div className="h-3 w-3 rounded-full bg-green-400 transition-transform hover:scale-110"></div>
          </div>
          <div className="ml-2 flex-1 rounded bg-background px-3 py-1 text-xs text-muted-foreground">
            erprundown.com/compare
          </div>
        </div>
        
        {/* Comparison table preview */}
        <div className="overflow-x-auto p-3 sm:p-4">
          <div className="grid min-w-[500px] grid-cols-4 gap-2 sm:gap-3">
            {vendors.map((vendor, i) => {
              const inCompare = isInCompare(vendor.slug);
              
              return (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <div 
                      className={cn(
                        "group relative cursor-pointer rounded-lg border bg-background p-2 transition-all duration-300 sm:p-3",
                        "hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg",
                        inCompare && "border-accent bg-accent/5"
                      )}
                    >
                      {/* Compare indicator */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(vendor.slug);
                        }}
                        disabled={!inCompare && !canAddMore}
                        className={cn(
                          "absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background transition-all duration-200",
                          inCompare 
                            ? "bg-accent text-white" 
                            : "bg-muted text-muted-foreground opacity-0 group-hover:opacity-100",
                          !inCompare && !canAddMore && "cursor-not-allowed"
                        )}
                      >
                        {inCompare ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Plus className="h-3 w-3" />
                        )}
                      </button>

                      {/* Brand logo */}
                      <div className="mb-2 flex h-8 items-center justify-center border-b pb-2">
                        {vendor.logo ? (
                          <img 
                            src={vendor.logo} 
                            alt={vendor.brand} 
                            className="h-5 w-auto max-w-[60px] object-contain transition-transform duration-200 group-hover:scale-110 sm:h-6"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <span className={`text-[10px] font-bold uppercase tracking-wider text-accent sm:text-xs ${vendor.logo ? 'hidden' : ''}`}>
                          {vendor.brand}
                        </span>
                      </div>
                      <div className="mb-3 text-center text-xs font-semibold text-foreground transition-colors group-hover:text-accent sm:text-sm">
                        {vendor.name}
                      </div>
                      
                      {/* Specs */}
                      <div className="space-y-1.5 text-[9px] sm:text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">PRICE RANGE</span>
                          <span className="font-medium text-foreground">{vendor.priceRange}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">COST PER USER</span>
                          <span className="font-medium text-foreground">{vendor.costPerUser}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">DEPLOYMENTS</span>
                        </div>
                        <div className="flex justify-center gap-1">
                          <span className="rounded bg-accent/20 px-1 py-0.5 text-[8px] text-accent sm:px-1.5 sm:text-[9px]">Cloud</span>
                          <span className="rounded bg-muted px-1 py-0.5 text-[8px] text-muted-foreground sm:px-1.5 sm:text-[9px]">On-Prem</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-muted-foreground">RETENTION RATE</span>
                          <span className="font-medium text-accent">{vendor.retention}</span>
                        </div>
                      </div>

                      {/* Hover overlay with CTA */}
                      <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-center opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                        <Link
                          to={`/vendors/${vendor.slug}`}
                          className="rounded-t-lg bg-accent px-3 py-1 text-[10px] font-medium text-white shadow-lg hover:bg-accent/90"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="top" 
                    className="w-64 animate-scale-in p-0"
                    sideOffset={8}
                  >
                    <div className="rounded-lg border bg-background p-4 shadow-xl">
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">{vendor.name}</h4>
                          <p className="text-xs text-muted-foreground">{vendor.brand}</p>
                        </div>
                        <Link 
                          to={`/vendors/${vendor.slug}`}
                          className="text-accent hover:text-accent/80"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </div>
                      
                      <p className="mb-3 text-xs text-muted-foreground">
                        {vendor.description || "Enterprise-grade ERP solution for manufacturing and distribution businesses."}
                      </p>

                      <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <DollarSign className="h-3 w-3 text-accent" />
                          <span>{vendor.priceRange}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="h-3 w-3 text-accent" />
                          <span>{vendor.costPerUser}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <TrendingUp className="h-3 w-3 text-accent" />
                          <span>{vendor.retention} retention</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="h-3 w-3 text-accent" />
                          <span>{vendor.implementation || "3-6 months"}</span>
                        </div>
                      </div>

                      {vendor.pros && vendor.pros.length > 0 && (
                        <div className="border-t pt-2">
                          <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            Top Features
                          </p>
                          <ul className="space-y-0.5 text-xs text-foreground">
                            {vendor.pros.slice(0, 3).map((pro, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
