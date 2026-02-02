import { Link } from "react-router-dom";
import { X, Star, Check, Minus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Vendor } from "@/types/database";

interface CompareTableProps {
  vendors: Vendor[];
  onRemove: (slug: string) => void;
}

export function CompareTable({ vendors, onRemove }: CompareTableProps) {
  if (vendors.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="mx-auto max-w-sm">
          <h3 className="text-lg font-semibold text-muted-foreground">
            No vendors selected
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose vendors from the sidebar to start comparing
          </p>
        </div>
      </Card>
    );
  }

  const rows = [
    { 
      label: "Deployment", 
      key: "deployment",
      render: (v: Vendor) => (
        <div className="flex flex-wrap gap-1">
          {v.deployment?.map((d) => (
            <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
          ))}
        </div>
      )
    },
    { 
      label: "Company Size", 
      key: "company_size_fit",
      render: (v: Vendor) => (
        <div className="flex flex-wrap gap-1">
          {v.company_size_fit?.map((s) => (
            <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
          ))}
        </div>
      )
    },
    { 
      label: "Pricing", 
      key: "pricing_stance",
      render: (v: Vendor) => <span className="font-medium">{v.pricing_stance || "Unknown"}</span>
    },
    { 
      label: "Implementation Time", 
      key: "implementation_time",
      render: (v: Vendor) => <span>{v.implementation_time || "Unknown"}</span>
    },
    {
      label: "User Rating",
      key: "user_rating",
      render: (v: Vendor) => (
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold">{v.user_rating?.toFixed(1) || "N/A"}</span>
          {v.reviews_count > 0 && (
            <span className="text-xs text-muted-foreground">
              ({v.reviews_count.toLocaleString()} reviews)
            </span>
          )}
        </div>
      )
    },
    { 
      label: "Industries", 
      key: "industries",
      render: (v: Vendor) => (
        <div className="flex flex-wrap gap-1">
          {v.industries?.slice(0, 4).map((ind) => (
            <Badge key={ind.id} variant="secondary" className="text-xs">{ind.name}</Badge>
          ))}
          {(v.industries?.length || 0) > 4 && (
            <Badge variant="outline" className="text-xs">+{v.industries!.length - 4}</Badge>
          )}
        </div>
      )
    },
    {
      label: "Top Clients",
      key: "top_clients",
      render: (v: Vendor) => (
        <div className="text-sm">
          {v.top_clients?.slice(0, 3).join(", ") || "—"}
        </div>
      )
    },
    {
      label: "Key Differentiators",
      key: "key_differentiators",
      render: (v: Vendor) => (
        <ul className="space-y-1 text-sm">
          {v.key_differentiators?.slice(0, 3).map((d, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <Check className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
              <span className="line-clamp-2">{d}</span>
            </li>
          ))}
        </ul>
      )
    },
    {
      label: "Pros",
      key: "pros",
      render: (v: Vendor) => (
        <ul className="space-y-1 text-sm">
          {v.pros?.slice(0, 3).map((pro, i) => (
            <li key={i} className="flex items-start gap-1.5 text-success">
              <Check className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span className="text-foreground line-clamp-2">{pro}</span>
            </li>
          ))}
        </ul>
      )
    },
    {
      label: "Cons",
      key: "cons",
      render: (v: Vendor) => (
        <ul className="space-y-1 text-sm">
          {v.cons?.slice(0, 3).map((con, i) => (
            <li key={i} className="flex items-start gap-1.5 text-destructive">
              <Minus className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span className="text-foreground line-clamp-2">{con}</span>
            </li>
          ))}
        </ul>
      )
    },
    {
      label: "Awards",
      key: "awards",
      render: (v: Vendor) => (
        <div className="flex flex-wrap gap-1">
          {v.awards?.slice(0, 2).map((a, i) => (
            <Badge key={i} variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
              {a}
            </Badge>
          ))}
        </div>
      )
    },
    {
      label: "Integrations",
      key: "integrations",
      render: (v: Vendor) => (
        <div className="text-sm text-muted-foreground">
          {v.integrations?.slice(0, 4).join(", ") || "—"}
          {(v.integrations?.length || 0) > 4 && ` +${v.integrations!.length - 4} more`}
        </div>
      )
    },
  ];

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Header row with vendor cards */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${vendors.length}, 1fr)` }}>
          <div /> {/* Empty corner cell */}
          {vendors.map((vendor) => (
            <Card key={vendor.slug} className="relative p-4">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-6 w-6"
                onClick={() => onRemove(vendor.slug)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
              
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-lg bg-muted">
                  {vendor.logo_url ? (
                    <img
                      src={vendor.logo_url}
                      alt={vendor.name}
                      className="h-10 w-10 object-contain"
                    />
                  ) : (
                    <span className="text-xl font-bold text-muted-foreground">
                      {vendor.name.charAt(0)}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold">{vendor.name}</h3>
                {vendor.sponsored && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    Sponsored
                  </Badge>
                )}
                <Link 
                  to={`/vendors/${vendor.slug}`}
                  className="mt-3 inline-flex items-center text-xs text-primary hover:underline"
                >
                  Full profile <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Data rows */}
        <div className="mt-4 rounded-lg border">
          {rows.map((row, i) => (
            <div key={row.key}>
              <div 
                className={`grid items-start gap-4 p-4 ${i % 2 === 0 ? 'bg-muted/30' : ''}`}
                style={{ gridTemplateColumns: `200px repeat(${vendors.length}, 1fr)` }}
              >
                <div className="font-medium text-sm text-muted-foreground pt-0.5">
                  {row.label}
                </div>
                {vendors.map((vendor) => (
                  <div key={vendor.slug}>
                    {row.render(vendor)}
                  </div>
                ))}
              </div>
              {i < rows.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
