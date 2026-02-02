import { Link } from "react-router-dom";
import { MapPin, Calendar, Users, ExternalLink, Award } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Partner } from "@/types/database";

interface PartnerCardProps {
  partner: Partner;
}

export function PartnerCard({ partner }: PartnerCardProps) {
  const yearsInBusiness = partner.year_founded 
    ? new Date().getFullYear() - partner.year_founded 
    : null;

  return (
    <Card className="card-hover flex flex-col h-full">
      <CardContent className="flex-1 p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted shrink-0">
            {partner.logo_url ? (
              <img
                src={partner.logo_url}
                alt={`${partner.name} logo`}
                className="h-10 w-10 object-contain"
              />
            ) : (
              <span className="text-lg font-bold text-muted-foreground">
                {partner.name.charAt(0)}
              </span>
            )}
          </div>
          {partner.featured && (
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 shrink-0">
              <Award className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        {/* Name and description */}
        <h3 className="mb-2 text-lg font-semibold text-foreground line-clamp-1">
          {partner.name}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {partner.short_description || "ERP implementation partner"}
        </p>

        {/* Quick stats */}
        <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {partner.headquarters && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{partner.headquarters}</span>
            </div>
          )}
          {yearsInBusiness && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{yearsInBusiness}+ years</span>
            </div>
          )}
          {partner.employees_count && (
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{partner.employees_count}</span>
            </div>
          )}
        </div>

        {/* ERP Specializations */}
        {partner.erp_specializations && partner.erp_specializations.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">ERP Expertise</p>
            <div className="flex flex-wrap gap-1">
              {partner.erp_specializations.slice(0, 3).map((erp) => (
                <Badge key={erp} variant="secondary" className="text-xs">
                  {erp}
                </Badge>
              ))}
              {partner.erp_specializations.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{partner.erp_specializations.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Regions */}
        {partner.regions_served && partner.regions_served.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {partner.regions_served.slice(0, 2).map((region) => (
              <Badge key={region} variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                {region}
              </Badge>
            ))}
            {partner.regions_served.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{partner.regions_served.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 border-t p-4">
        <Link to={`/partners/${partner.slug}`} className="flex-1">
          <Button variant="outline" className="w-full" size="sm">
            View Profile
          </Button>
        </Link>
        {partner.website_url && (
          <a href={partner.website_url} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
