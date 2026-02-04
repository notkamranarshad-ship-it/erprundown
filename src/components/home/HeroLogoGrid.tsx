import { Link } from "react-router-dom";
import { ExternalLink, DollarSign, Building, Cloud, ArrowRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Curated list of ERP vendors with verified working logos
const erpVendors = [
  { 
    name: "SAP", 
    fullName: "SAP S/4HANA",
    slug: "sap-s4hana", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg",
    description: "Enterprise-grade ERP for large organizations",
    pricing: "Quote-based",
    size: ["Enterprise"],
    deployment: ["Cloud", "On-Prem", "Hybrid"]
  },
  { 
    name: "Oracle", 
    fullName: "Oracle NetSuite",
    slug: "oracle-netsuite", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
    description: "Cloud-native ERP for mid-market companies",
    pricing: "Starts at $999/mo",
    size: ["Small", "Mid-market"],
    deployment: ["Cloud"]
  },
  { 
    name: "Microsoft", 
    fullName: "Dynamics 365",
    slug: "microsoft-dynamics-365", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    description: "Integrated business apps with Microsoft ecosystem",
    pricing: "From $70/user/mo",
    size: ["Mid-market", "Enterprise"],
    deployment: ["Cloud", "Hybrid"]
  },
  { 
    name: "Epicor", 
    fullName: "Epicor Kinetic",
    slug: "epicor-kinetic", 
    logo: "https://cdn.worldvectorlogo.com/logos/epicor.svg",
    description: "Manufacturing and distribution focused ERP",
    pricing: "Quote-based",
    size: ["Small", "Mid-market"],
    deployment: ["Cloud", "On-Prem", "Hybrid"]
  },
  { 
    name: "Infor", 
    fullName: "Infor CloudSuite",
    slug: "infor-cloudsuite", 
    logo: "https://cdn.worldvectorlogo.com/logos/infor.svg",
    description: "Industry-specific cloud ERP solutions",
    pricing: "Quote-based",
    size: ["Mid-market", "Enterprise"],
    deployment: ["Cloud"]
  },
  { 
    name: "Sage", 
    fullName: "Sage Intacct",
    slug: "sage-intacct", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Sage_logo.svg",
    description: "Financial management and accounting ERP",
    pricing: "From $400/mo",
    size: ["Small", "Mid-market"],
    deployment: ["Cloud"]
  },
  { 
    name: "Acumatica", 
    fullName: "Acumatica Cloud ERP",
    slug: "acumatica", 
    logo: "https://cdn.worldvectorlogo.com/logos/acumatica.svg",
    description: "Flexible cloud ERP with consumption pricing",
    pricing: "Resource-based",
    size: ["Small", "Mid-market"],
    deployment: ["Cloud", "On-Prem"]
  },
  { 
    name: "Workday", 
    fullName: "Workday Enterprise",
    slug: "workday", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/80/Workday_logo.svg",
    description: "HR and finance cloud ERP platform",
    pricing: "Quote-based",
    size: ["Enterprise"],
    deployment: ["Cloud"]
  },
  { 
    name: "IFS", 
    fullName: "IFS Cloud",
    slug: "ifs-cloud", 
    logo: "https://cdn.worldvectorlogo.com/logos/ifs-1.svg",
    description: "Project-based and asset-intensive ERP",
    pricing: "Quote-based",
    size: ["Mid-market", "Enterprise"],
    deployment: ["Cloud"]
  },
  { 
    name: "Odoo", 
    fullName: "Odoo ERP",
    slug: "odoo", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Odoo_Official_Logo.png",
    description: "Open-source modular business apps",
    pricing: "From $24.90/user/mo",
    size: ["Small", "Mid-market"],
    deployment: ["Cloud", "On-Prem"]
  },
  { 
    name: "SYSPRO", 
    fullName: "SYSPRO ERP",
    slug: "syspro", 
    logo: "https://cdn.worldvectorlogo.com/logos/syspro.svg",
    description: "Manufacturing and distribution ERP",
    pricing: "Quote-based",
    size: ["Small", "Mid-market"],
    deployment: ["Cloud", "On-Prem"]
  },
  { 
    name: "QAD", 
    fullName: "QAD Adaptive ERP",
    slug: "qad-adaptive", 
    logo: "https://cdn.worldvectorlogo.com/logos/qad.svg",
    description: "Automotive and industrial manufacturing ERP",
    pricing: "Quote-based",
    size: ["Mid-market", "Enterprise"],
    deployment: ["Cloud"]
  },
  { 
    name: "Plex", 
    fullName: "Plex Smart Manufacturing",
    slug: "plex-erp", 
    logo: "https://www.plex.com/content/dam/plex/en_us/logos/plex-logo.svg",
    description: "Cloud-native smart manufacturing platform",
    pricing: "Quote-based",
    size: ["Mid-market"],
    deployment: ["Cloud"]
  },
  { 
    name: "Deltek", 
    fullName: "Deltek Costpoint",
    slug: "deltek", 
    logo: "https://cdn.worldvectorlogo.com/logos/deltek.svg",
    description: "Project-based business ERP solutions",
    pricing: "Quote-based",
    size: ["Mid-market", "Enterprise"],
    deployment: ["Cloud", "On-Prem"]
  },
  { 
    name: "Cetec", 
    fullName: "Cetec ERP",
    slug: "cetec-erp", 
    logo: null,
    description: "Affordable shop floor manufacturing ERP",
    pricing: "From $40/user/mo",
    size: ["Small"],
    deployment: ["Cloud"]
  },
  { 
    name: "Priority", 
    fullName: "Priority ERP",
    slug: "priority-erp", 
    logo: null,
    description: "Flexible ERP for diverse industries",
    pricing: "Quote-based",
    size: ["Small", "Mid-market"],
    deployment: ["Cloud", "On-Prem"]
  },
  { 
    name: "Rootstock", 
    fullName: "Rootstock Cloud ERP",
    slug: "rootstock", 
    logo: null,
    description: "Manufacturing ERP on Salesforce platform",
    pricing: "Quote-based",
    size: ["Mid-market"],
    deployment: ["Cloud"]
  },
  { 
    name: "Genius", 
    fullName: "Genius ERP",
    slug: "genius-erp", 
    logo: null,
    description: "Made-to-order manufacturing ERP",
    pricing: "From $150/user/mo",
    size: ["Small", "Mid-market"],
    deployment: ["Cloud"]
  },
  { 
    name: "ERPNext", 
    fullName: "ERPNext",
    slug: "erpnext", 
    logo: null,
    description: "Open-source ERP for SMBs",
    pricing: "Free / Hosted options",
    size: ["Small"],
    deployment: ["Cloud", "On-Prem"]
  },
  { 
    name: "ABAS", 
    fullName: "ABAS ERP",
    slug: "abas-erp", 
    logo: null,
    description: "Mid-market manufacturing ERP",
    pricing: "Quote-based",
    size: ["Mid-market"],
    deployment: ["Cloud", "On-Prem"]
  },
];

export function HeroLogoGrid() {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
        {/* 5x4 Logo Grid - Responsive */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-px bg-border">
          {erpVendors.map((vendor, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <Link
                  to={`/vendors/${vendor.slug}`}
                  className={cn(
                    "group relative flex items-center justify-center bg-background transition-all duration-200",
                    "hover:bg-accent/5 hover:z-10 hover:shadow-md",
                    "aspect-square p-2 sm:p-3"
                  )}
                >
                  {vendor.logo ? (
                    <img 
                      src={vendor.logo} 
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
                      vendor.logo ? "hidden" : "flex"
                    )}
                    style={{ display: vendor.logo ? 'none' : 'flex' }}
                  >
                    {vendor.name}
                  </span>
                  
                  {/* Hover indicator */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/30 transition-colors rounded-sm pointer-events-none" />
                </Link>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                className="w-60 p-0 shadow-xl"
                sideOffset={5}
              >
                <div className="rounded-lg border bg-background p-4">
                  {/* Header */}
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{vendor.fullName}</h4>
                      <p className="text-[10px] text-muted-foreground">{vendor.name}</p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-accent shrink-0" />
                  </div>
                  
                  {/* Description */}
                  <p className="mb-3 text-xs text-muted-foreground leading-relaxed">
                    {vendor.description}
                  </p>

                  {/* Quick Stats */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-foreground">
                      <DollarSign className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span className="font-medium">{vendor.pricing}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Building className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span>{vendor.size.join(' • ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Cloud className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span>{vendor.deployment.join(' • ')}</span>
                    </div>
                  </div>

                  {/* CTA */}
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
