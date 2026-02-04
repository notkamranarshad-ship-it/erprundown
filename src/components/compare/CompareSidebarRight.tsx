import { useState } from "react";
import { BookOpen, Download, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LeadForm } from "@/components/forms/LeadForm";
import { useSubmitLead } from "@/hooks/useLeads";
import { toast } from "sonner";

const bestPracticesGuides = [
  { id: "erp-selection", title: "ERP Selection Best Practices" },
  { id: "implementation", title: "Implementation Playbook" },
  { id: "change-management", title: "Change Management Guide" },
  { id: "data-migration", title: "Data Migration Checklist" },
  { id: "roi-calculator", title: "ERP ROI Calculator Guide" },
];

interface CompareSidebarRightProps {
  selectedVendors?: string[];
}

export function CompareSidebarRight({ selectedVendors = [] }: CompareSidebarRightProps) {
  const [email, setEmail] = useState("");
  const [selectedGuides, setSelectedGuides] = useState<string[]>([]);
  const submitLead = useSubmitLead();

  const toggleGuide = (id: string) => {
    setSelectedGuides((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || selectedGuides.length === 0) {
      toast.error("Please enter your email and select at least one guide");
      return;
    }

    try {
      await submitLead.mutateAsync({
        name: email.split("@")[0],
        email,
        source_page: "/compare",
        message: `Requested guides: ${selectedGuides.join(", ")}`,
      });
      setEmail("");
      setSelectedGuides([]);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <div className="space-y-4">
      {/* CTA Card */}
      <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0 shadow-lg">
        <CardContent className="p-5 text-center">
          <h3 className="font-bold text-base mb-2">Need Expert Guidance?</h3>
          <p className="text-xs text-primary-foreground/80 mb-4">
            Get personalized ERP recommendations from our experts.
          </p>
          <LeadForm
            vendorSlugs={selectedVendors}
            triggerLabel="Free Consultation"
            title="Request Expert Consultation"
            description="Our ERP specialists will help you choose the right solution."
            triggerVariant="secondary"
          />
        </CardContent>
      </Card>

      {/* Best Practices Guides */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Best Practices Guides
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Download expert guides for ERP success.
            </p>

            <div className="space-y-2">
              {bestPracticesGuides.map((guide) => (
                <div key={guide.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`guide-${guide.id}`}
                    checked={selectedGuides.includes(guide.id)}
                    onCheckedChange={() => toggleGuide(guide.id)}
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor={`guide-${guide.id}`}
                    className="text-xs text-muted-foreground cursor-pointer leading-tight"
                  >
                    {guide.title}
                  </Label>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-8 text-sm"
                required
              />
              <Button
                type="submit"
                size="sm"
                className="w-full gap-1.5 h-8 text-xs"
                disabled={submitLead.isPending || selectedGuides.length === 0}
              >
                <Download className="h-3 w-3" />
                {submitLead.isPending ? "Sending..." : "Get Guides"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-sm font-semibold">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 px-4 pb-4">
          <a
            href="/vendors"
            className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors py-2 px-2 rounded-md -mx-2"
          >
            Browse All Vendors
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="/industries"
            className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors py-2 px-2 rounded-md -mx-2"
          >
            ERP by Industry
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="/case-studies"
            className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors py-2 px-2 rounded-md -mx-2"
          >
            Success Stories
            <ArrowRight className="h-4 w-4" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
