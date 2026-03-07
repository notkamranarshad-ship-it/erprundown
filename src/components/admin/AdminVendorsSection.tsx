import { useState } from "react";
import { Plus, Pencil, Trash2, Star, Globe, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { FaviconImg } from "@/components/ui/favicon-img";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useVendors, useCreateVendor, useUpdateVendor, useDeleteVendor } from "@/hooks/useVendors";
import type { Vendor, DeploymentType, CompanySize, PricingStance, ImplementationTime } from "@/types/database";

interface VendorFormData {
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  logo_url: string;
  website_url: string;
  deployment: string;
  company_size_fit: string;
  pricing_stance: PricingStance;
  implementation_time: ImplementationTime;
  integrations: string;
  pros: string;
  cons: string;
  top_clients: string;
  partner_names: string;
  key_differentiators: string;
  awards: string;
  user_rating: string;
  reviews_count: string;
  featured: boolean;
  sponsored: boolean;
  sponsor_label: string;
}

const initialFormData: VendorFormData = {
  name: "",
  slug: "",
  short_description: "",
  long_description: "",
  logo_url: "",
  website_url: "",
  deployment: "",
  company_size_fit: "",
  pricing_stance: "Unknown",
  implementation_time: "Unknown",
  integrations: "",
  pros: "",
  cons: "",
  top_clients: "",
  partner_names: "",
  key_differentiators: "",
  awards: "",
  user_rating: "",
  reviews_count: "",
  featured: false,
  sponsored: false,
  sponsor_label: "",
};

const DEPLOYMENT_OPTIONS: DeploymentType[] = ["SaaS", "On-Prem", "Hybrid"];
const COMPANY_SIZE_OPTIONS: CompanySize[] = ["Small", "Mid-market", "Enterprise"];
const PRICING_OPTIONS: PricingStance[] = ["Quote-based", "Starts at $", "Free trial", "Unknown"];
const IMPLEMENTATION_OPTIONS: ImplementationTime[] = ["<3 months", "3-6 months", "6-12 months", "12+ months", "Unknown"];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseArray(str: string): string[] {
  return str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function VendorFormDialog({
  vendor,
  open,
  onOpenChange,
}: {
  vendor?: Vendor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [formData, setFormData] = useState<VendorFormData>(
    vendor
      ? {
          name: vendor.name,
          slug: vendor.slug,
          short_description: vendor.short_description || "",
          long_description: vendor.long_description || "",
          logo_url: vendor.logo_url || "",
          website_url: vendor.website_url || "",
          deployment: vendor.deployment?.join(", ") || "",
          company_size_fit: vendor.company_size_fit?.join(", ") || "",
          pricing_stance: vendor.pricing_stance || "Unknown",
          implementation_time: vendor.implementation_time || "Unknown",
          integrations: vendor.integrations?.join(", ") || "",
          pros: vendor.pros?.join(", ") || "",
          cons: vendor.cons?.join(", ") || "",
          top_clients: vendor.top_clients?.join(", ") || "",
          partner_names: vendor.partner_names?.join(", ") || "",
          key_differentiators: vendor.key_differentiators?.join(", ") || "",
          awards: vendor.awards?.join(", ") || "",
          user_rating: vendor.user_rating?.toString() || "",
          reviews_count: vendor.reviews_count?.toString() || "",
          featured: vendor.featured || false,
          sponsored: vendor.sponsored || false,
          sponsor_label: vendor.sponsor_label || "",
        }
      : initialFormData
  );

  const createVendor = useCreateVendor();
  const updateVendor = useUpdateVendor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const deploymentArr = parseArray(formData.deployment).filter((d) =>
      DEPLOYMENT_OPTIONS.includes(d as DeploymentType)
    ) as DeploymentType[];

    const sizeArr = parseArray(formData.company_size_fit).filter((s) =>
      COMPANY_SIZE_OPTIONS.includes(s as CompanySize)
    ) as CompanySize[];

    const payload = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      short_description: formData.short_description || null,
      long_description: formData.long_description || null,
      logo_url: formData.logo_url || null,
      website_url: formData.website_url || null,
      deployment: deploymentArr.length > 0 ? deploymentArr : null,
      company_size_fit: sizeArr.length > 0 ? sizeArr : null,
      pricing_stance: formData.pricing_stance,
      implementation_time: formData.implementation_time,
      integrations: parseArray(formData.integrations),
      pros: parseArray(formData.pros),
      cons: parseArray(formData.cons),
      top_clients: parseArray(formData.top_clients),
      partner_names: parseArray(formData.partner_names),
      key_differentiators: parseArray(formData.key_differentiators),
      awards: parseArray(formData.awards),
      user_rating: formData.user_rating ? parseFloat(formData.user_rating) : null,
      reviews_count: formData.reviews_count ? parseInt(formData.reviews_count) : null,
      screenshots: [],
      featured: formData.featured,
      sponsored: formData.sponsored,
      sponsor_label: formData.sponsor_label || null,
    };

    if (vendor) {
      await updateVendor.mutateAsync({ id: vendor.id, ...payload });
    } else {
      await createVendor.mutateAsync(payload);
    }

    onOpenChange(false);
    setFormData(initialFormData);
  };

  const isLoading = createVendor.isPending || updateVendor.isPending;

  const update = (field: keyof VendorFormData, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{vendor ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
          <DialogDescription>
            {vendor ? "Update ERP vendor information" : "Add a new ERP vendor to the directory"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Slug */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="v-name">Name *</Label>
              <Input
                id="v-name"
                value={formData.name}
                onChange={(e) => {
                  update("name", e.target.value);
                  if (!formData.slug) update("slug", generateSlug(e.target.value));
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v-slug">Slug</Label>
              <Input
                id="v-slug"
                value={formData.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder="auto-generated"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-2">
            <Label htmlFor="v-short">Short Description</Label>
            <Textarea
              id="v-short"
              value={formData.short_description}
              onChange={(e) => update("short_description", e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-long">Long Description</Label>
            <Textarea
              id="v-long"
              value={formData.long_description}
              onChange={(e) => update("long_description", e.target.value)}
              rows={4}
            />
          </div>

          {/* URLs */}
          <div className="grid grid-cols-2 gap-4">
            <ImageUploadField
              label="Logo URL"
              value={formData.logo_url}
              onChange={(value) => update("logo_url", value)}
              uploadFolder="vendors"
            />
            <div className="space-y-2">
              <Label htmlFor="v-web">Website URL</Label>
              <Input id="v-web" value={formData.website_url} onChange={(e) => update("website_url", e.target.value)} />
            </div>
          </div>

          {/* Selects Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pricing Stance</Label>
              <Select
                value={formData.pricing_stance}
                onValueChange={(v) => update("pricing_stance", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRICING_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Implementation Time</Label>
              <Select
                value={formData.implementation_time}
                onValueChange={(v) => update("implementation_time", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {IMPLEMENTATION_OPTIONS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Comma-separated array fields */}
          <div className="space-y-2">
            <Label htmlFor="v-deploy">Deployment Types (comma-separated: SaaS, On-Prem, Hybrid)</Label>
            <Input id="v-deploy" value={formData.deployment} onChange={(e) => update("deployment", e.target.value)} placeholder="SaaS, Hybrid" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-size">Company Size Fit (comma-separated: Small, Mid-market, Enterprise)</Label>
            <Input id="v-size" value={formData.company_size_fit} onChange={(e) => update("company_size_fit", e.target.value)} placeholder="Mid-market, Enterprise" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-int">Integrations (comma-separated)</Label>
            <Input id="v-int" value={formData.integrations} onChange={(e) => update("integrations", e.target.value)} placeholder="Salesforce, Shopify, QuickBooks" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-pros">Pros (comma-separated)</Label>
            <Input id="v-pros" value={formData.pros} onChange={(e) => update("pros", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-cons">Cons (comma-separated)</Label>
            <Input id="v-cons" value={formData.cons} onChange={(e) => update("cons", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-diff">Key Differentiators (comma-separated)</Label>
            <Input id="v-diff" value={formData.key_differentiators} onChange={(e) => update("key_differentiators", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-clients">Top Clients (comma-separated)</Label>
            <Input id="v-clients" value={formData.top_clients} onChange={(e) => update("top_clients", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-partners">Partner Names (comma-separated)</Label>
            <Input id="v-partners" value={formData.partner_names} onChange={(e) => update("partner_names", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="v-awards">Awards (comma-separated)</Label>
            <Input id="v-awards" value={formData.awards} onChange={(e) => update("awards", e.target.value)} />
          </div>

          {/* Rating & Reviews */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="v-rating">User Rating (0–5)</Label>
              <Input id="v-rating" type="number" step="0.1" min="0" max="5" value={formData.user_rating} onChange={(e) => update("user_rating", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="v-reviews">Reviews Count</Label>
              <Input id="v-reviews" type="number" value={formData.reviews_count} onChange={(e) => update("reviews_count", e.target.value)} />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <Switch id="v-featured" checked={formData.featured} onCheckedChange={(c) => update("featured", c)} />
              <Label htmlFor="v-featured">Featured</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="v-sponsored" checked={formData.sponsored} onCheckedChange={(c) => update("sponsored", c)} />
              <Label htmlFor="v-sponsored">Sponsored</Label>
            </div>
          </div>

          {formData.sponsored && (
            <div className="space-y-2">
              <Label htmlFor="v-sponsor-label">Sponsor Label</Label>
              <Input id="v-sponsor-label" value={formData.sponsor_label} onChange={(e) => update("sponsor_label", e.target.value)} placeholder="e.g., Premium Partner" />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : vendor ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  const [editOpen, setEditOpen] = useState(false);
  const deleteVendor = useDeleteVendor();

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
              <FaviconImg logoUrl={vendor.logo_url} websiteUrl={vendor.website_url} name={vendor.name} className="h-8 w-8" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">{vendor.name}</h3>
                {vendor.featured && (
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    <Star className="h-3 w-3 mr-1" />Featured
                  </Badge>
                )}
                {vendor.sponsored && (
                  <Badge variant="outline" className="shrink-0 text-xs">Sponsored</Badge>
                )}
              </div>
              {vendor.short_description && (
                <p className="text-xs text-muted-foreground line-clamp-1">{vendor.short_description}</p>
              )}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {vendor.deployment?.map((d) => (
                  <Badge key={d} variant="outline" className="text-[10px] px-1.5 py-0">{d}</Badge>
                ))}
                {vendor.pricing_stance && vendor.pricing_stance !== "Unknown" && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{vendor.pricing_stance}</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                {vendor.website_url && (
                  <a href={vendor.website_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Globe className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                )}
                <Button variant="outline" size="sm" className="h-7" onClick={() => setEditOpen(true)}>
                  <Pencil className="h-3.5 w-3.5 mr-1" />Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 text-destructive hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {vendor.name}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteVendor.mutate(vendor.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <VendorFormDialog vendor={vendor} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}

export function AdminVendorsSection() {
  const [createOpen, setCreateOpen] = useState(false);
  const { data: vendors, isLoading } = useVendors();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Vendors
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Manage ERP vendors in the directory
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : vendors && vendors.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No vendors yet</p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Vendor
            </Button>
          </div>
        )}
      </CardContent>
      <VendorFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </Card>
  );
}
