import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface PartnerSidebarProps {
  selectedErps: string[];
  selectedRegions: string[];
  selectedIndustries: string[];
  onUpdateFilter: (key: string, value: string, add: boolean) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

const ERP_OPTIONS = [
  "SAP S/4HANA",
  "Oracle NetSuite",
  "Microsoft Dynamics 365",
  "Sage Intacct",
  "Acumatica",
  "Workday",
  "Infor",
  "Oracle Cloud",
];

const REGION_OPTIONS = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East",
];

const INDUSTRY_OPTIONS = [
  "Manufacturing",
  "Financial Services",
  "Healthcare",
  "Retail",
  "Technology",
  "Energy",
  "Government",
  "Nonprofit",
];

function FilterSection({
  title,
  options,
  selected,
  filterKey,
  onUpdate,
  defaultOpen = true,
}: {
  title: string;
  options: string[];
  selected: string[];
  filterKey: string;
  onUpdate: (key: string, value: string, add: boolean) => void;
  defaultOpen?: boolean;
}) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium hover:text-primary transition-colors">
        {title}
        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-2.5 pb-4 pt-2">
          {options.map((option) => (
            <div key={option} className="flex items-center gap-2">
              <Checkbox
                id={`${filterKey}-${option}`}
                checked={selected.includes(option)}
                onCheckedChange={(checked) =>
                  onUpdate(filterKey, option, checked as boolean)
                }
              />
              <Label
                htmlFor={`${filterKey}-${option}`}
                className="cursor-pointer text-sm font-normal"
              >
                {option}
              </Label>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function PartnerSidebar({
  selectedErps,
  selectedRegions,
  selectedIndustries,
  onUpdateFilter,
  onClearFilters,
  activeFilterCount,
}: PartnerSidebarProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Filters</CardTitle>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-auto p-1 text-xs text-muted-foreground hover:text-destructive"
            >
              <X className="mr-1 h-3 w-3" />
              Clear all
            </Button>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="w-fit">
            {activeFilterCount} active filter{activeFilterCount !== 1 ? "s" : ""}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        <FilterSection
          title="ERP Specialization"
          options={ERP_OPTIONS}
          selected={selectedErps}
          filterKey="erp"
          onUpdate={onUpdateFilter}
          defaultOpen={true}
        />
        
        <FilterSection
          title="Region"
          options={REGION_OPTIONS}
          selected={selectedRegions}
          filterKey="region"
          onUpdate={onUpdateFilter}
          defaultOpen={true}
        />
        
        <FilterSection
          title="Industry"
          options={INDUSTRY_OPTIONS}
          selected={selectedIndustries}
          filterKey="industry"
          onUpdate={onUpdateFilter}
          defaultOpen={false}
        />
      </CardContent>

      {/* CTA */}
      <div className="border-t p-4">
        <div className="rounded-lg bg-primary/5 p-4">
          <h4 className="font-medium text-sm">Need Help Choosing?</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            Get matched with the right implementation partner for your project.
          </p>
          <Button size="sm" className="mt-3 w-full">
            Get Recommendations
          </Button>
        </div>
      </div>
    </Card>
  );
}
