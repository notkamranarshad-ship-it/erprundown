import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/forms/LeadForm";

interface BlogInlineCTAProps {
  variant?: "primary" | "secondary";
  title?: string;
  description?: string;
}

export function BlogInlineCTA({ 
  variant = "primary",
  title = "Need Help Choosing the Right ERP?",
  description = "Our experts can help you evaluate options and make the right choice for your business."
}: BlogInlineCTAProps) {
  if (variant === "primary") {
    return (
      <div className="my-10 p-8 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-primary/20">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground mb-6">{description}</p>
          <LeadForm
            sourcePage="blog-inline-cta"
            triggerLabel="Talk to an Expert"
            title="Get Expert Guidance"
            description="Fill out the form and our ERP specialists will reach out within 24 hours."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="my-8 p-6 rounded-xl bg-muted/50 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h4 className="font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <LeadForm
        sourcePage="blog-inline-cta-secondary"
        triggerLabel="Learn More"
        triggerVariant="outline"
        title="Get Expert Guidance"
        description="Fill out the form and our ERP specialists will reach out within 24 hours."
      />
    </div>
  );
}
