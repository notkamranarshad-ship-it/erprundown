 import { useState } from "react";
 import { Plus, Pencil, Trash2, Building2, Globe, Star, MapPin } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import { Label } from "@/components/ui/label";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import { Switch } from "@/components/ui/switch";
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
 import { usePartners, useCreatePartner, useUpdatePartner, useDeletePartner } from "@/hooks/usePartners";
 import type { Partner } from "@/types/database";
 
 interface PartnerFormData {
   name: string;
   slug: string;
   short_description: string;
   long_description: string;
   logo_url: string;
   website_url: string;
   headquarters: string;
   year_founded: string;
   employees_count: string;
   regions_served: string;
   erp_specializations: string;
   industries_served: string;
   services_offered: string;
   certifications: string;
   notable_clients: string;
   featured: boolean;
 }
 
 const initialFormData: PartnerFormData = {
   name: "",
   slug: "",
   short_description: "",
   long_description: "",
   logo_url: "",
   website_url: "",
   headquarters: "",
   year_founded: "",
   employees_count: "",
   regions_served: "",
   erp_specializations: "",
   industries_served: "",
   services_offered: "",
   certifications: "",
   notable_clients: "",
   featured: false,
 };
 
 function generateSlug(name: string): string {
   return name
     .toLowerCase()
     .replace(/[^a-z0-9]+/g, "-")
     .replace(/(^-|-$)/g, "");
 }
 
 function PartnerFormDialog({
   partner,
   open,
   onOpenChange,
 }: {
   partner?: Partner;
   open: boolean;
   onOpenChange: (open: boolean) => void;
 }) {
   const [formData, setFormData] = useState<PartnerFormData>(
     partner
       ? {
           name: partner.name,
           slug: partner.slug,
           short_description: partner.short_description || "",
           long_description: partner.long_description || "",
           logo_url: partner.logo_url || "",
           website_url: partner.website_url || "",
           headquarters: partner.headquarters || "",
           year_founded: partner.year_founded?.toString() || "",
           employees_count: partner.employees_count || "",
           regions_served: partner.regions_served?.join(", ") || "",
           erp_specializations: partner.erp_specializations?.join(", ") || "",
           industries_served: partner.industries_served?.join(", ") || "",
           services_offered: partner.services_offered?.join(", ") || "",
           certifications: partner.certifications?.join(", ") || "",
           notable_clients: partner.notable_clients?.join(", ") || "",
           featured: partner.featured || false,
         }
       : initialFormData
   );
 
   const createPartner = useCreatePartner();
   const updatePartner = useUpdatePartner();
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
 
     const parseArray = (str: string) =>
       str
         .split(",")
         .map((s) => s.trim())
         .filter(Boolean);
 
     const payload = {
       name: formData.name,
       slug: formData.slug || generateSlug(formData.name),
       short_description: formData.short_description || null,
       long_description: formData.long_description || null,
       logo_url: formData.logo_url || null,
       website_url: formData.website_url || null,
       headquarters: formData.headquarters || null,
       year_founded: formData.year_founded ? parseInt(formData.year_founded) : null,
       employees_count: formData.employees_count || null,
       regions_served: parseArray(formData.regions_served),
       erp_specializations: parseArray(formData.erp_specializations),
       industries_served: parseArray(formData.industries_served),
       services_offered: parseArray(formData.services_offered),
       certifications: parseArray(formData.certifications),
       notable_clients: parseArray(formData.notable_clients),
       featured: formData.featured,
     };
 
     if (partner) {
       await updatePartner.mutateAsync({ id: partner.id, ...payload });
     } else {
       await createPartner.mutateAsync(payload);
     }
 
     onOpenChange(false);
     setFormData(initialFormData);
   };
 
   const isLoading = createPartner.isPending || updatePartner.isPending;
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <DialogTitle>{partner ? "Edit Partner" : "Add Partner"}</DialogTitle>
           <DialogDescription>
             {partner ? "Update partner information" : "Add a new implementation partner"}
           </DialogDescription>
         </DialogHeader>
 
         <form onSubmit={handleSubmit} className="space-y-4">
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label htmlFor="name">Name *</Label>
               <Input
                 id="name"
                 value={formData.name}
                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                 required
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="slug">Slug</Label>
               <Input
                 id="slug"
                 value={formData.slug}
                 onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                 placeholder="auto-generated from name"
               />
             </div>
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="short_description">Short Description</Label>
             <Textarea
               id="short_description"
               value={formData.short_description}
               onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
               rows={2}
             />
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="long_description">Long Description</Label>
             <Textarea
               id="long_description"
               value={formData.long_description}
               onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
               rows={4}
             />
           </div>
 
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label htmlFor="logo_url">Logo URL</Label>
               <Input
                 id="logo_url"
                 value={formData.logo_url}
                 onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="website_url">Website URL</Label>
               <Input
                 id="website_url"
                 value={formData.website_url}
                 onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
               />
             </div>
           </div>
 
           <div className="grid grid-cols-3 gap-4">
             <div className="space-y-2">
               <Label htmlFor="headquarters">Headquarters</Label>
               <Input
                 id="headquarters"
                 value={formData.headquarters}
                 onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="year_founded">Year Founded</Label>
               <Input
                 id="year_founded"
                 type="number"
                 value={formData.year_founded}
                 onChange={(e) => setFormData({ ...formData, year_founded: e.target.value })}
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="employees_count">Employees</Label>
               <Input
                 id="employees_count"
                 value={formData.employees_count}
                 onChange={(e) => setFormData({ ...formData, employees_count: e.target.value })}
                 placeholder="e.g., 50-200"
               />
             </div>
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="regions_served">Regions Served (comma-separated)</Label>
             <Input
               id="regions_served"
               value={formData.regions_served}
               onChange={(e) => setFormData({ ...formData, regions_served: e.target.value })}
               placeholder="North America, Europe, Asia"
             />
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="erp_specializations">ERP Specializations (comma-separated)</Label>
             <Input
               id="erp_specializations"
               value={formData.erp_specializations}
               onChange={(e) => setFormData({ ...formData, erp_specializations: e.target.value })}
               placeholder="SAP, Oracle, Microsoft Dynamics"
             />
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="industries_served">Industries Served (comma-separated)</Label>
             <Input
               id="industries_served"
               value={formData.industries_served}
               onChange={(e) => setFormData({ ...formData, industries_served: e.target.value })}
               placeholder="Manufacturing, Healthcare, Retail"
             />
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="services_offered">Services Offered (comma-separated)</Label>
             <Input
               id="services_offered"
               value={formData.services_offered}
               onChange={(e) => setFormData({ ...formData, services_offered: e.target.value })}
               placeholder="Implementation, Consulting, Training"
             />
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="certifications">Certifications (comma-separated)</Label>
             <Input
               id="certifications"
               value={formData.certifications}
               onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
             />
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="notable_clients">Notable Clients (comma-separated)</Label>
             <Input
               id="notable_clients"
               value={formData.notable_clients}
               onChange={(e) => setFormData({ ...formData, notable_clients: e.target.value })}
             />
           </div>
 
           <div className="flex items-center gap-2">
             <Switch
               id="featured"
               checked={formData.featured}
               onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
             />
             <Label htmlFor="featured">Featured Partner</Label>
           </div>
 
           <DialogFooter>
             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
               Cancel
             </Button>
             <Button type="submit" disabled={isLoading}>
               {isLoading ? "Saving..." : partner ? "Update" : "Create"}
             </Button>
           </DialogFooter>
         </form>
       </DialogContent>
     </Dialog>
   );
 }
 
 function PartnerCard({ partner }: { partner: Partner }) {
   const [editOpen, setEditOpen] = useState(false);
   const deletePartner = useDeletePartner();
 
   return (
     <>
       <Card className="hover:shadow-md transition-shadow">
         <CardContent className="p-4">
           <div className="flex items-start gap-3">
             <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
               {partner.logo_url ? (
                 <img src={partner.logo_url} alt={partner.name} className="w-8 h-8 object-contain" />
               ) : (
                 <Building2 className="h-5 w-5 text-muted-foreground" />
               )}
             </div>
             <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-1">
                 <h3 className="font-semibold text-foreground truncate">{partner.name}</h3>
                 {partner.featured && (
                   <Badge variant="secondary" className="shrink-0 text-xs">
                     <Star className="h-3 w-3 mr-1" />
                     Featured
                   </Badge>
                 )}
               </div>
               {partner.headquarters && (
                 <p className="text-xs text-muted-foreground flex items-center gap-1">
                   <MapPin className="h-3 w-3" />
                   {partner.headquarters}
                 </p>
               )}
               <div className="flex items-center gap-2 mt-2">
                 <Button variant="outline" size="sm" className="h-7" onClick={() => setEditOpen(true)}>
                   <Pencil className="h-3.5 w-3.5 mr-1" />
                   Edit
                 </Button>
                 <AlertDialog>
                   <AlertDialogTrigger asChild>
                     <Button variant="outline" size="sm" className="h-7 text-destructive hover:text-destructive">
                       <Trash2 className="h-3.5 w-3.5" />
                     </Button>
                   </AlertDialogTrigger>
                   <AlertDialogContent>
                     <AlertDialogHeader>
                       <AlertDialogTitle>Delete Partner</AlertDialogTitle>
                       <AlertDialogDescription>
                         Are you sure you want to delete {partner.name}? This action cannot be undone.
                       </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                       <AlertDialogCancel>Cancel</AlertDialogCancel>
                       <AlertDialogAction
                         onClick={() => deletePartner.mutate(partner.id)}
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
       <PartnerFormDialog partner={partner} open={editOpen} onOpenChange={setEditOpen} />
     </>
   );
 }
 
 export function AdminPartnersSection() {
   const [createOpen, setCreateOpen] = useState(false);
   const { data: partners, isLoading } = usePartners();
 
   return (
     <Card>
       <CardHeader className="flex flex-row items-center justify-between">
         <div>
           <CardTitle className="flex items-center gap-2">
             <Building2 className="h-5 w-5" />
             Partners
           </CardTitle>
         </div>
         <Button onClick={() => setCreateOpen(true)} size="sm">
           <Plus className="h-4 w-4 mr-2" />
           Add Partner
         </Button>
       </CardHeader>
       <CardContent>
         {isLoading ? (
           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
             {Array.from({ length: 3 }).map((_, i) => (
               <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
             ))}
           </div>
         ) : partners && partners.length > 0 ? (
           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
             {partners.map((partner) => (
               <PartnerCard key={partner.id} partner={partner} />
             ))}
           </div>
         ) : (
           <div className="rounded-lg border border-dashed p-12 text-center">
             <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
             <p className="text-muted-foreground mb-4">No partners yet</p>
             <Button onClick={() => setCreateOpen(true)}>
               <Plus className="h-4 w-4 mr-2" />
               Add Your First Partner
             </Button>
           </div>
         )}
       </CardContent>
       <PartnerFormDialog open={createOpen} onOpenChange={setCreateOpen} />
     </Card>
   );
 }