import { Link } from "react-router-dom";
import { Plus, Check, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaviconImg } from "@/components/ui/favicon-img";
import { useCompare } from "@/hooks/useCompare";
import type { Vendor } from "@/types/database";

interface VendorCardProps {
  vendor: Vendor;
  showCompare?: boolean;
}

export function VendorCard({ vendor, showCompare = true }: VendorCardProps) {
  const { isInCompare, toggleCompare, canAddMore } = useCompare();
  const inCompare = isInCompare(vendor.slug);

  return (
    <Card className="card-hover flex flex-col">
      <CardContent className="flex-1 p-6">
        {/* Header with logo and sponsored badge */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
            <FaviconImg logoUrl={vendor.logo_url} websiteUrl={vendor.website_url} name={vendor.name} className="h-10 w-10" />
          </div>
          {vendor.sponsored && (
            <Badge variant="outline" className="text-xs">
              {vendor.sponsor_label || "Sponsored"}
            </Badge>
          )}
        </div>

        {/* Name and description */}
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {vendor.name}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {vendor.short_description || "ERP software solution"}
        </p>

        {/* Deployment badges */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {vendor.deployment?.map((type) => (
            <Badge key={type} variant="secondary" className="text-xs">
              {type}
            </Badge>
          ))}
        </div>

        {/* Company size */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {vendor.company_size_fit?.slice(0, 2).map((size) => (
            <Badge key={size} className="bg-accent/10 text-accent text-xs">
              {size}
            </Badge>
          ))}
        </div>

        {/* Industries - "Best for" */}
        {vendor.industries && vendor.industries.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Best for: </span>
            {vendor.industries.slice(0, 3).map((ind) => ind.name).join(", ")}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 border-t p-4">
        <Link to={`/vendors/${vendor.slug}`} className="flex-1">
          <Button variant="outline" className="w-full" size="sm">
            View Details
          </Button>
        </Link>
        {showCompare && (
          <Button
            variant={inCompare ? "default" : "outline"}
            size="sm"
            onClick={() => toggleCompare(vendor.slug)}
            disabled={!inCompare && !canAddMore}
            className="gap-1.5"
          >
            {inCompare ? (
              <>
                <Check className="h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Compare
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}