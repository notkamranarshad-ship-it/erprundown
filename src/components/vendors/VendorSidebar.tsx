import { useState } from "react";
import { Mail, Send } from "lucide-react";
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
import { useIndustries } from "@/hooks/useIndustries";
import { toast } from "sonner";
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
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Thanks for subscribing! Check your inbox for updates.");
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <aside className="space-y-6">
      {/* Filters Section */}
      <div className="rounded-lg border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Filters</h3>
          {activeFilterCount > 0 && (
            <button
              onClick={onClearFilters}
              className="text-xs text-accent hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-5">
          {/* Company Size */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-foreground">Company Size</h4>
            <div className="space-y-2">
              {companySizeOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${option}`}
                    checked={selectedSize.includes(option)}
                    onCheckedChange={(checked) =>
                      onUpdateFilter("size", option, !!checked)
                    }
                  />
                  <Label htmlFor={`size-${option}`} className="text-sm font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Industry */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-foreground">Industry</h4>
            <Select
              value={selectedIndustry}
              onValueChange={(value) => onUpdateFilter("industry", value, true)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All industries</SelectItem>
                {industries?.map((ind) => (
                  <SelectItem key={ind.id} value={ind.slug}>
                    {ind.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Deployment Type */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-foreground">Deployment</h4>
            <div className="space-y-2">
              {deploymentOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`deployment-${option}`}
                    checked={selectedDeployment.includes(option)}
                    onCheckedChange={(checked) =>
                      onUpdateFilter("deployment", option, !!checked)
                    }
                  />
                  <Label htmlFor={`deployment-${option}`} className="text-sm font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-foreground">Pricing</h4>
            <div className="space-y-2">
              {pricingOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`pricing-${option}`}
                    checked={selectedPricing.includes(option)}
                    onCheckedChange={(checked) =>
                      onUpdateFilter("pricing", option, !!checked)
                    }
                  />
                  <Label htmlFor={`pricing-${option}`} className="text-sm font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Implementation Time */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-foreground">Implementation Time</h4>
            <div className="space-y-2">
              {implementationOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`impl-${option}`}
                    checked={selectedImplementation.includes(option)}
                    onCheckedChange={(checked) =>
                      onUpdateFilter("implementation", option, !!checked)
                    }
                  />
                  <Label htmlFor={`impl-${option}`} className="text-sm font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-accent/5 p-5">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
            <Mail className="h-4 w-4 text-accent" />
          </div>
          <h3 className="font-semibold text-foreground">Stay Updated</h3>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Get the latest ERP insights, comparisons, and industry news delivered to your inbox.
        </p>
        <form onSubmit={handleNewsletterSubmit} className="space-y-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-background"
          />
          <Button 
            type="submit" 
            className="w-full gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Subscribing..."
            ) : (
              <>
                <Send className="h-4 w-4" />
                Subscribe
              </>
            )}
          </Button>
        </form>
        <p className="mt-3 text-[10px] text-muted-foreground">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </aside>
  );
}
