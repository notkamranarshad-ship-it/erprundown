import { Link } from "react-router-dom";
import { Calendar, Building2, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CaseStudy } from "@/types/database";
import { format } from "date-fns";

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  return (
    <Link to={`/case-studies/${caseStudy.slug}`}>
      <Card className="card-hover group h-full overflow-hidden">
        {caseStudy.featured_image && (
          <div className="aspect-video overflow-hidden">
            <img
              src={caseStudy.featured_image}
              alt={caseStudy.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <CardContent className="p-6">
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
            {caseStudy.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {caseStudy.summary}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {caseStudy.industry && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {caseStudy.industry.name}
              </span>
            )}
            {caseStudy.vendor && (
              <span className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                {caseStudy.vendor.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(caseStudy.published_at), "MMM d, yyyy")}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}