 import { useState } from "react";
 import { Plus, Pencil, Trash2, Factory, Star } from "lucide-react";
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
 import { useIndustries, useCreateIndustry, useUpdateIndustry, useDeleteIndustry } from "@/hooks/useIndustries";
 import type { Industry } from "@/types/database";
 
 interface IndustryFormData {
   name: string;
   slug: string;
   summary: string;
   overview: string;
   key_requirements: string;
   featured: boolean;
 }
 
 const initialFormData: IndustryFormData = {
   name: "",
   slug: "",
   summary: "",
   overview: "",
   key_requirements: "",
   featured: false,
 };
 
 function generateSlug(name: string): string {
   return name
     .toLowerCase()
     .replace(/[^a-z0-9]+/g, "-")
     .replace(/(^-|-$)/g, "");
 }
 
 function IndustryFormDialog({
   industry,
   open,
   onOpenChange,
 }: {
   industry?: Industry;
   open: boolean;
   onOpenChange: (open: boolean) => void;
 }) {
   const [formData, setFormData] = useState<IndustryFormData>(
     industry
       ? {
           name: industry.name,
           slug: industry.slug,
           summary: industry.summary || "",
           overview: industry.overview || "",
           key_requirements: industry.key_requirements || "",
           featured: industry.featured,
         }
       : initialFormData
   );
 
   const createIndustry = useCreateIndustry();
   const updateIndustry = useUpdateIndustry();
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
 
     const payload = {
       name: formData.name,
       slug: formData.slug || generateSlug(formData.name),
       summary: formData.summary || null,
       overview: formData.overview || null,
       key_requirements: formData.key_requirements || null,
       featured: formData.featured,
     };
 
     if (industry) {
       await updateIndustry.mutateAsync({ id: industry.id, ...payload });
     } else {
       await createIndustry.mutateAsync(payload);
     }
 
     onOpenChange(false);
     setFormData(initialFormData);
   };
 
   const isLoading = createIndustry.isPending || updateIndustry.isPending;
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <DialogTitle>{industry ? "Edit Industry" : "Add Industry"}</DialogTitle>
           <DialogDescription>
             {industry ? "Update industry information" : "Add a new industry category"}
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
             <Label htmlFor="summary">Summary</Label>
             <Textarea
               id="summary"
               value={formData.summary}
               onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
               rows={2}
               placeholder="Brief summary for listings"
             />
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="overview">Overview</Label>
             <Textarea
               id="overview"
               value={formData.overview}
               onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
               rows={4}
               placeholder="Detailed overview of the industry"
             />
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="key_requirements">Key Requirements</Label>
             <Textarea
               id="key_requirements"
               value={formData.key_requirements}
               onChange={(e) => setFormData({ ...formData, key_requirements: e.target.value })}
               rows={3}
               placeholder="Key ERP requirements for this industry"
             />
           </div>
 
           <div className="flex items-center gap-2">
             <Switch
               id="featured"
               checked={formData.featured}
               onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
             />
             <Label htmlFor="featured">Featured Industry</Label>
           </div>
 
           <DialogFooter>
             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
               Cancel
             </Button>
             <Button type="submit" disabled={isLoading}>
               {isLoading ? "Saving..." : industry ? "Update" : "Create"}
             </Button>
           </DialogFooter>
         </form>
       </DialogContent>
     </Dialog>
   );
 }
 
 function IndustryCard({ industry }: { industry: Industry }) {
   const [editOpen, setEditOpen] = useState(false);
   const deleteIndustry = useDeleteIndustry();
 
   return (
     <>
       <Card className="hover:shadow-md transition-shadow">
         <CardContent className="p-4">
           <div className="flex items-start gap-3">
             <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
               <Factory className="h-5 w-5 text-muted-foreground" />
             </div>
             <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-1">
                 <h3 className="font-semibold text-foreground truncate">{industry.name}</h3>
                 {industry.featured && (
                   <Badge variant="secondary" className="shrink-0 text-xs">
                     <Star className="h-3 w-3 mr-1" />
                     Featured
                   </Badge>
                 )}
               </div>
               {industry.summary && (
                 <p className="text-xs text-muted-foreground line-clamp-2">{industry.summary}</p>
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
                       <AlertDialogTitle>Delete Industry</AlertDialogTitle>
                       <AlertDialogDescription>
                         Are you sure you want to delete {industry.name}? This action cannot be undone.
                       </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                       <AlertDialogCancel>Cancel</AlertDialogCancel>
                       <AlertDialogAction
                         onClick={() => deleteIndustry.mutate(industry.id)}
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
       <IndustryFormDialog industry={industry} open={editOpen} onOpenChange={setEditOpen} />
     </>
   );
 }
 
 export function AdminIndustriesSection() {
   const [createOpen, setCreateOpen] = useState(false);
   const { data: industries, isLoading } = useIndustries();
 
   return (
     <Card>
       <CardHeader className="flex flex-row items-center justify-between">
         <div>
           <CardTitle className="flex items-center gap-2">
             <Factory className="h-5 w-5" />
             Industries
           </CardTitle>
         </div>
         <Button onClick={() => setCreateOpen(true)} size="sm">
           <Plus className="h-4 w-4 mr-2" />
           Add Industry
         </Button>
       </CardHeader>
       <CardContent>
         {isLoading ? (
           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
             {Array.from({ length: 3 }).map((_, i) => (
               <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
             ))}
           </div>
         ) : industries && industries.length > 0 ? (
           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
             {industries.map((industry) => (
               <IndustryCard key={industry.id} industry={industry} />
             ))}
           </div>
         ) : (
           <div className="rounded-lg border border-dashed p-12 text-center">
             <Factory className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
             <p className="text-muted-foreground mb-4">No industries yet</p>
             <Button onClick={() => setCreateOpen(true)}>
               <Plus className="h-4 w-4 mr-2" />
               Add Your First Industry
             </Button>
           </div>
         )}
       </CardContent>
       <IndustryFormDialog open={createOpen} onOpenChange={setCreateOpen} />
     </Card>
   );
 }