import { Link } from "react-router-dom";
import { ExternalLink, DollarSign, Users, Clock, TrendingUp, Building } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useVendors } from "@/hooks/useVendors";

interface VendorLogoData {
  name: string;
  slug: string;
  logo_url: string | null;
  short_description: string | null;
  pricing_stance: string | null;
  deployment: string[] | null;
  company_size_fit: string[] | null;
}

// Fallback logos if database doesn't have enough
const fallbackLogos = [
  { name: "SAP", slug: "sap-s4hana", logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg" },
  { name: "Oracle", slug: "oracle-netsuite", logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/Logo.min.svg" },
  { name: "Microsoft", slug: "microsoft-dynamics-365", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "Epicor", slug: "epicor-kinetic", logo: "https://www.epicor.com/globalassets/epicor-logo-2021.svg" },
  { name: "Infor", slug: "infor-cloudsuite", logo: "https://cdn.worldvectorlogo.com/logos/infor.svg" },
  { name: "Acumatica", slug: "acumatica", logo: "https://www.acumatica.com/wp-content/uploads/2021/09/acumatica-logo.svg" },
  { name: "Sage", slug: "sage-intacct", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Sage_logo.svg" },
  { name: "Workday", slug: "workday", logo: "https://upload.wikimedia.org/wikipedia/commons/8/80/Workday_logo.svg" },
  { name: "IFS", slug: "ifs-cloud", logo: "https://www.ifs.com/assets/ifs-logo.svg" },
  { name: "SYSPRO", slug: "syspro", logo: "https://www.syspro.com/wp-content/uploads/2021/06/syspro-logo.svg" },
  { name: "QAD", slug: "qad-adaptive", logo: "https://www.qad.com/hubfs/QAD%20Logo%20RGB.svg" },
  { name: "IQMS", slug: "iqms", logo: "https://www.delmiaworks.com/hubfs/DelmiaWorks-logo.svg" },
  { name: "Plex", slug: "plex-erp", logo: "https://www.plex.com/hubfs/Plex_Logo.svg" },
  { name: "Cetec", slug: "cetec-erp", logo: null },
  { name: "GlobalShop", slug: "globalshop", logo: null },
  { name: "JobBOSS", slug: "jobboss", logo: null },
];

export function HeroLogoGrid() {
  const { data: vendors } = useVendors({ limit: 16 });

  // Use database vendors if available, otherwise use fallback
  const displayVendors: VendorLogoData[] = vendors && vendors.length > 0 
    ? vendors.slice(0, 16).map(v => ({
        name: v.name,
        slug: v.slug,
        logo_url: v.logo_url,
        short_description: v.short_description,
        pricing_stance: v.pricing_stance,
        deployment: v.deployment,
        company_size_fit: v.company_size_fit,
      }))
    : fallbackLogos.slice(0, 16).map(f => ({
        name: f.name,
        slug: f.slug,
        logo_url: f.logo,
        short_description: null,
        pricing_stance: null,
        deployment: null,
        company_size_fit: null,
      }));

  return (
    <TooltipProvider delayDuration={150}>
      <div className="rounded-xl border bg-card shadow-lg">
        {/* Header */}
        <div className="border-b bg-muted/50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Top ERP Solutions
          </p>
        </div>
        
        {/* Logo Grid */}
        <div className="grid grid-cols-4 gap-px bg-border p-px">
          {displayVendors.map((vendor, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <Link
                  to={`/vendors/${vendor.slug}`}
                  className={cn(
                    "group relative flex aspect-square items-center justify-center bg-background p-3 transition-all duration-200",
                    "hover:bg-accent/5 hover:shadow-inner"
                  )}
                >
                  {vendor.logo_url ? (
                    <img 
                      src={vendor.logo_url} 
                      alt={vendor.name} 
                      className="h-8 w-auto max-w-[60px] object-contain opacity-70 transition-all duration-200 group-hover:opacity-100 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span 
                    className={cn(
                      "text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-accent",
                      vendor.logo_url ? "hidden" : "flex"
                    )}
                    style={{ display: vendor.logo_url ? 'none' : 'flex' }}
                  >
                    {vendor.name.split(' ')[0]}
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                className="w-56 p-0"
                sideOffset={8}
              >
                <div className="rounded-lg border bg-background p-3 shadow-xl">
                  {/* Header */}
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{vendor.name}</h4>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-accent" />
                  </div>
                  
                  {/* Description */}
                  {vendor.short_description && (
                    <p className="mb-3 text-xs text-muted-foreground leading-relaxed">
                      {vendor.short_description}
                    </p>
                  )}

                  {/* Quick Stats - No "Top Features" */}
                  <div className="space-y-1.5 text-xs">
                    {vendor.pricing_stance && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-3 w-3 text-accent" />
                        <span>{vendor.pricing_stance}</span>
                      </div>
                    )}
                    {vendor.company_size_fit && vendor.company_size_fit.length > 0 && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building className="h-3 w-3 text-accent" />
                        <span>{vendor.company_size_fit.join(', ')}</span>
                      </div>
                    )}
                    {vendor.deployment && vendor.deployment.length > 0 && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TrendingUp className="h-3 w-3 text-accent" />
                        <span>{vendor.deployment.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* CTA hint */}
                  <div className="mt-3 border-t pt-2">
                    <span className="text-[10px] text-accent font-medium">Click to view details →</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        {/* Footer CTA */}
        <div className="border-t bg-muted/30 px-4 py-2 text-center">
          <Link 
            to="/vendors" 
            className="text-xs font-medium text-accent hover:underline"
          >
            View all ERP vendors →
          </Link>
        </div>
      </div>
    </TooltipProvider>
  );
}
