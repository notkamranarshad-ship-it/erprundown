import { FileText, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LeadForm } from "@/components/forms/LeadForm";

interface BlogSidebarCTAProps {
  vendorSlugs?: string[];
}

export function BlogSidebarCTA({ vendorSlugs = [] }: BlogSidebarCTAProps) {
  return (
    <div className="sticky top-24 space-y-6">
      {/* Main CTA Card */}
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Get Expert Guidance
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Let us help you find the perfect ERP solution for your business needs.
          </p>
          <ul className="space-y-2 mb-6">
            {[
              "Personalized vendor recommendations",
              "Free consultation with experts",
              "Custom implementation roadmap",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <LeadForm
            vendorSlugs={vendorSlugs}
            sourcePage="blog-sidebar"
            triggerLabel="Get Free Consultation"
            title="Get Expert Guidance"
            description="Fill out the form and our ERP specialists will reach out to help you find the right solution."
          />
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card className="border-border/50">
        <CardContent className="p-5">
          <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
          <div className="space-y-2">
            <a
              href="/vendors"
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors group"
            >
              <span className="text-sm text-muted-foreground group-hover:text-foreground">
                Compare Vendors
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a
              href="/compare"
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors group"
            >
              <span className="text-sm text-muted-foreground group-hover:text-foreground">
                Comparison Tool
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a
              href="/case-studies"
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors group"
            >
              <span className="text-sm text-muted-foreground group-hover:text-foreground">
                Case Studies
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
