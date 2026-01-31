import { useState } from "react";
import { Mail, Send, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useIndustries } from "@/hooks/useIndustries";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { DeploymentType, CompanySize } from "@/types/database";

const deploymentOptions: DeploymentType[] = ["SaaS", "On-Prem", "Hybrid"];
const companySizeOptions: CompanySize[] = ["Small", "Mid-market", "Enterprise"];
const pricingOptions = ["Free trial", "Starts at $", "Quote-based"];
const implementationOptions = ["<3 months", "3-6 months", "6-12 months", "12+ months"];

interface VendorSidebarProps {
  selectedDeployment: string[];
  selectedSize: string[];
  selectedIndustry: string;
  selectedPricing: string[];
  selectedImplementation: string[];
  onUpdateFilter: (key: string, value: string, add: boolean) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium text-foreground hover:text-accent transition-colors">
        {title}
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-1 pb-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function VendorSidebar({
  selectedDeployment,
  selectedSize,
  selectedIndustry,
  selectedPricing,
  selectedImplementation,
  onUpdateFilter,
  onClearFilters,
  activeFilterCount,
}: VendorSidebarProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: industries } = useIndustries();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Thanks for subscribing! Check your inbox for updates.");
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <aside className="space-y-4">
      {/* Filters Section */}
      <div className="rounded-lg border bg-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold text-foreground">Filters</h3>
          {activeFilterCount > 0 && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 text-xs text-accent hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              Clear all
            </button>
          )}
        </div>

        <div className="divide-y px-4">
          {/* Company Size */}
          <FilterSection title="Company Size">
            <div className="space-y-2">
              {companySizeOptions.map((option) => (
                <label
                  key={option}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer transition-colors",
                    selectedSize.includes(option) 
                      ? "bg-accent/10 text-accent" 
                      : "hover:bg-muted"
                  )}
                >
                  <Checkbox
                    id={`size-${option}`}
                    checked={selectedSize.includes(option)}
                    onCheckedChange={(checked) =>
                      onUpdateFilter("size", option, !!checked)
                    }
                    className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Industry */}
          <FilterSection title="Industry">
            <Select
              value={selectedIndustry || "all"}
              onValueChange={(value) => onUpdateFilter("industry", value === "all" ? "" : value, true)}
            >
              <SelectTrigger className={cn(
                "w-full",
                selectedIndustry && "border-accent/50 bg-accent/5"
              )}>
                <SelectValue placeholder="All industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All industries</SelectItem>
                {industries?.map((ind) => (
                  <SelectItem key={ind.id} value={ind.slug}>
                    {ind.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterSection>

          {/* Deployment Type */}
          <FilterSection title="Deployment">
            <div className="space-y-2">
              {deploymentOptions.map((option) => (
                <label
                  key={option}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer transition-colors",
                    selectedDeployment.includes(option) 
                      ? "bg-accent/10 text-accent" 
                      : "hover:bg-muted"
                  )}
                >
                  <Checkbox
                    id={`deployment-${option}`}
                    checked={selectedDeployment.includes(option)}
                    onCheckedChange={(checked) =>
                      onUpdateFilter("deployment", option, !!checked)
                    }
                    className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Pricing */}
          <FilterSection title="Pricing Model" defaultOpen={false}>
            <div className="space-y-2">
              {pricingOptions.map((option) => (
                <label
                  key={option}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer transition-colors",
                    selectedPricing.includes(option) 
                      ? "bg-accent/10 text-accent" 
                      : "hover:bg-muted"
                  )}
                >
                  <Checkbox
                    id={`pricing-${option}`}
                    checked={selectedPricing.includes(option)}
                    onCheckedChange={(checked) =>
                      onUpdateFilter("pricing", option, !!checked)
                    }
                    className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Implementation Time */}
          <FilterSection title="Implementation Time" defaultOpen={false}>
            <div className="space-y-2">
              {implementationOptions.map((option) => (
                <label
                  key={option}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer transition-colors",
                    selectedImplementation.includes(option) 
                      ? "bg-accent/10 text-accent" 
                      : "hover:bg-muted"
                  )}
                >
                  <Checkbox
                    id={`impl-${option}`}
                    checked={selectedImplementation.includes(option)}
                    onCheckedChange={(checked) =>
                      onUpdateFilter("implementation", option, !!checked)
                    }
                    className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="rounded-lg border bg-gradient-to-br from-primary/5 via-background to-accent/5 p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
            <Mail className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Stay Updated</h3>
            <p className="text-[10px] text-muted-foreground">ERP insights weekly</p>
          </div>
        </div>
        <p className="mb-4 text-xs text-muted-foreground leading-relaxed">
          Get the latest ERP comparisons, industry news, and expert recommendations.
        </p>
        <form onSubmit={handleNewsletterSubmit} className="space-y-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-background text-sm h-9"
          />
          <Button 
            type="submit" 
            className="w-full gap-2 h-9"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Subscribing..."
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                Subscribe Free
              </>
            )}
          </Button>
        </form>
        <p className="mt-2 text-[10px] text-center text-muted-foreground">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </aside>
  );
}
