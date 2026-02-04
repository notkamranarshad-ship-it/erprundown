import { useState } from "react";
import { FileText, Download, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useSubmitLead } from "@/hooks/useLeads";
import { toast } from "sonner";

const popularComparisons = [
  { title: "SAP vs Oracle NetSuite", slug: "sap-vs-oracle-netsuite" },
  { title: "Microsoft Dynamics vs SAP", slug: "dynamics-vs-sap" },
  { title: "Epicor vs Infor", slug: "epicor-vs-infor" },
  { title: "NetSuite vs Sage Intacct", slug: "netsuite-vs-sage" },
  { title: "Acumatica vs NetSuite", slug: "acumatica-vs-netsuite" },
];

const downloadableComparisons = [
  { id: "sap-oracle", title: "SAP vs Oracle ERP Deep Dive" },
  { id: "cloud-erp", title: "Top 5 Cloud ERP Comparison" },
  { id: "manufacturing", title: "Manufacturing ERP Guide" },
  { id: "mid-market", title: "Mid-Market ERP Comparison" },
  { id: "retail", title: "Retail & Distribution ERP" },
];

export function CompareSidebarLeft() {
  const [email, setEmail] = useState("");
  const [selectedDownloads, setSelectedDownloads] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const submitLead = useSubmitLead();
  

  const toggleDownload = (id: string) => {
    setSelectedDownloads((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || selectedDownloads.length === 0) {
      toast.error("Please enter your email and select at least one comparison");
      return;
    }

    try {
      await submitLead.mutateAsync({
        name: email.split("@")[0],
        email,
        source_page: "/compare",
        message: `Requested comparisons: ${selectedDownloads.join(", ")}`,
      });
      setEmail("");
      setSelectedDownloads([]);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <div className="space-y-6">
      {/* Popular Comparisons */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Popular Comparisons
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {popularComparisons.map((comp) => (
            <a
              key={comp.slug}
              href={`/blog/${comp.slug}`}
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 border-b border-border/50 last:border-0"
            >
              {comp.title}
            </a>
          ))}
        </CardContent>
      </Card>

      {/* Downloadable Comparisons */}
      <Card>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Comparisons
                </span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-muted-foreground">
                  Select the comparisons you want and we'll send them to your email.
                </p>

                <div className="space-y-3">
                  {downloadableComparisons.map((comp) => (
                    <div key={comp.id} className="flex items-start gap-2">
                      <Checkbox
                        id={comp.id}
                        checked={selectedDownloads.includes(comp.id)}
                        onCheckedChange={() => toggleDownload(comp.id)}
                      />
                      <Label
                        htmlFor={comp.id}
                        className="text-xs text-muted-foreground cursor-pointer leading-tight"
                      >
                        {comp.title}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 text-sm"
                    required
                  />
                <Button
                    type="submit"
                    size="sm"
                    className="w-full gap-2"
                    disabled={submitLead.isPending || selectedDownloads.length === 0}
                  >
                    <Send className="h-3.5 w-3.5" />
                    {submitLead.isPending ? "Sending..." : "Send to My Email"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}
