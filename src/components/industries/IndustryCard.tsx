import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Industry } from "@/types/database";

interface IndustryCardProps {
  industry: Industry;
}

export function IndustryCard({ industry }: IndustryCardProps) {
  return (
    <Link to={`/industries/${industry.slug}`}>
      <Card className="card-hover group h-full">
        <CardContent className="flex h-full flex-col justify-between p-6">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
              {industry.name}
            </h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {industry.summary || `ERP solutions for the ${industry.name} industry`}
            </p>
          </div>
          <div className="mt-4 flex items-center text-sm font-medium text-accent">
            Explore
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}