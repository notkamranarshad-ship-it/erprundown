import { Link } from "react-router-dom";
import { X, Star, Check, Minus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Vendor } from "@/types/database";

interface CompareVerticalCardsProps {
  vendors: Vendor[];
  onRemove: (slug: string) => void;
}

export function CompareVerticalCards({ vendors, onRemove }: CompareVerticalCardsProps) {
  if (vendors.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg font-medium mb-2">Select vendors above to compare</p>
        <p className="text-sm">Choose 2-6 vendors to see a side-by-side comparison</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {vendors.map((vendor) => (
        <Card key={vendor.id} className="relative overflow-hidden">
          {/* Remove Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-7 w-7 z-10"
            onClick={() => onRemove(vendor.slug)}
          >
            <X className="h-4 w-4" />
          </Button>

          <CardHeader className="pb-4">
            {/* Logo & Name */}
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted shrink-0">
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
              <div>
                <h3 className="font-bold text-lg">{vendor.name}</h3>
                {vendor.sponsored && (
                  <Badge variant="outline" className="text-xs mt-1">Sponsored</Badge>
                )}
              </div>
            </div>

            {/* Rating */}
            {vendor.user_rating && (
              <div className="flex items-center gap-1.5 mt-3">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{vendor.user_rating.toFixed(1)}</span>
                {vendor.reviews_count > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({vendor.reviews_count.toLocaleString()} reviews)
                  </span>
                )}
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4 text-sm">
            {/* Description */}
            <p className="text-muted-foreground line-clamp-2">
              {vendor.short_description}
            </p>

            <Separator />

            {/* Quick Facts */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Deployment</p>
                <div className="flex flex-wrap gap-1">
                  {vendor.deployment?.slice(0, 2).map((d) => (
                    <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Company Size</p>
                <div className="flex flex-wrap gap-1">
                  {vendor.company_size_fit?.slice(0, 2).map((s) => (
                    <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Pricing</p>
                <p className="font-medium text-xs">{vendor.pricing_stance || "Unknown"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Implementation</p>
                <p className="font-medium text-xs">{vendor.implementation_time || "Unknown"}</p>
              </div>
            </div>

            <Separator />

            {/* Pros */}
            {vendor.pros && vendor.pros.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Pros</p>
                <ul className="space-y-1.5">
                  {vendor.pros.slice(0, 3).map((pro, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs">
                      <Check className="h-3 w-3 mt-0.5 text-success shrink-0" />
                      <span className="line-clamp-2">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cons */}
            {vendor.cons && vendor.cons.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Cons</p>
                <ul className="space-y-1.5">
                  {vendor.cons.slice(0, 3).map((con, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs">
                      <Minus className="h-3 w-3 mt-0.5 text-destructive shrink-0" />
                      <span className="line-clamp-2">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Differentiators */}
            {vendor.key_differentiators && vendor.key_differentiators.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Key Differentiators</p>
                <ul className="space-y-1.5">
                  {vendor.key_differentiators.slice(0, 2).map((d, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs">
                      <Check className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                      <span className="line-clamp-2">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            {/* Actions */}
            <div className="pt-2">
              <Link to={`/vendors/${vendor.slug}`}>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  View Full Profile
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
