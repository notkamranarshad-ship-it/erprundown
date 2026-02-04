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
    <div className="space-y-4">
      {/* Popular Comparisons */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Popular Comparisons
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 px-4 pb-4">
          {popularComparisons.map((comp) => (
            <a
              key={comp.slug}
              href={`/blog/${comp.slug}`}
              className="block text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors py-2 px-2 rounded-md -mx-2"
            >
              {comp.title}
            </a>
          ))}
        </CardContent>
      </Card>

      {/* Downloadable Comparisons */}
      <Card className="shadow-sm">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-2 px-4 pt-4 cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" />
                  Download Reports
                </span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="px-4 pb-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Select reports and we'll email them to you.
                </p>

                <div className="space-y-2">
                  {downloadableComparisons.map((comp) => (
                    <div key={comp.id} className="flex items-center gap-2">
                      <Checkbox
                        id={comp.id}
                        checked={selectedDownloads.includes(comp.id)}
                        onCheckedChange={() => toggleDownload(comp.id)}
                        className="h-4 w-4"
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
                    disabled={submitLead.isPending || selectedDownloads.length === 0}
                  >
                    <Send className="h-3 w-3" />
                    {submitLead.isPending ? "Sending..." : "Send Reports"}
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
