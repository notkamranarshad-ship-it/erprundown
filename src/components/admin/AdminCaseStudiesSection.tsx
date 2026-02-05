 import { useState } from "react";
 import { Plus, Pencil, Trash2, BookOpen, Calendar } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import { Label } from "@/components/ui/label";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
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
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { useCaseStudies, useCreateCaseStudy, useUpdateCaseStudy, useDeleteCaseStudy } from "@/hooks/useCaseStudies";
 import { useIndustries } from "@/hooks/useIndustries";
 import { useVendors } from "@/hooks/useVendors";
 import type { CaseStudy } from "@/types/database";
 import { format } from "date-fns";
 
 interface CaseStudyFormData {
   title: string;
   slug: string;
   summary: string;
   content: string;
   metrics: string;
   featured_image: string;
   industry_id: string;
   vendor_id: string;
   published_at: string;
 }
 
 const initialFormData: CaseStudyFormData = {
   title: "",
   slug: "",
   summary: "",
   content: "",
   metrics: "",
   featured_image: "",
   industry_id: "",
   vendor_id: "",
   published_at: new Date().toISOString().split("T")[0],
 };
 
 function generateSlug(title: string): string {
   return title
     .toLowerCase()
     .replace(/[^a-z0-9]+/g, "-")
     .replace(/(^-|-$)/g, "");
 }
 
 function CaseStudyFormDialog({
   caseStudy,
   open,
   onOpenChange,
 }: {
   caseStudy?: CaseStudy;
   open: boolean;
   onOpenChange: (open: boolean) => void;
 }) {
   const { data: industries } = useIndustries();
   const { data: vendors } = useVendors();
 
   const [formData, setFormData] = useState<CaseStudyFormData>(
     caseStudy
       ? {
           title: caseStudy.title,
           slug: caseStudy.slug,
           summary: caseStudy.summary || "",
           content: caseStudy.content || "",
           metrics: caseStudy.metrics?.join(", ") || "",
           featured_image: caseStudy.featured_image || "",
           industry_id: caseStudy.industry_id || "",
           vendor_id: caseStudy.vendor_id || "",
           published_at: caseStudy.published_at?.split("T")[0] || new Date().toISOString().split("T")[0],
         }
       : initialFormData
   );
 
   const createCaseStudy = useCreateCaseStudy();
   const updateCaseStudy = useUpdateCaseStudy();
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
 
     const payload = {
       title: formData.title,
       slug: formData.slug || generateSlug(formData.title),
       summary: formData.summary || null,
       content: formData.content || null,
       metrics: formData.metrics
         .split(",")
         .map((m) => m.trim())
         .filter(Boolean),
       featured_image: formData.featured_image || null,
       industry_id: formData.industry_id || null,
       vendor_id: formData.vendor_id || null,
       published_at: formData.published_at ? new Date(formData.published_at).toISOString() : new Date().toISOString(),
     };
 
     if (caseStudy) {
       await updateCaseStudy.mutateAsync({ id: caseStudy.id, ...payload });
     } else {
       await createCaseStudy.mutateAsync(payload);
     }
 
     onOpenChange(false);
     setFormData(initialFormData);
   };
 
   const isLoading = createCaseStudy.isPending || updateCaseStudy.isPending;
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <DialogTitle>{caseStudy ? "Edit Case Study" : "Add Case Study"}</DialogTitle>
           <DialogDescription>
             {caseStudy ? "Update case study content" : "Create a new case study"}
           </DialogDescription>
         </DialogHeader>
 
         <form onSubmit={handleSubmit} className="space-y-4">
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label htmlFor="title">Title *</Label>
               <Input
                 id="title"
                 value={formData.title}
                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                 required
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="slug">Slug</Label>
               <Input
                 id="slug"
                 value={formData.slug}
                 onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                 placeholder="auto-generated from title"
               />
             </div>
           </div>
 
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label htmlFor="industry_id">Industry</Label>
               <Select
                 value={formData.industry_id}
                 onValueChange={(value) => setFormData({ ...formData, industry_id: value })}
               >
                 <SelectTrigger>
                   <SelectValue placeholder="Select industry..." />
                 </SelectTrigger>
                 <SelectContent>
                   {industries?.map((industry) => (
                     <SelectItem key={industry.id} value={industry.id}>
                       {industry.name}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
             <div className="space-y-2">
               <Label htmlFor="vendor_id">Vendor</Label>
               <Select
                 value={formData.vendor_id}
                 onValueChange={(value) => setFormData({ ...formData, vendor_id: value })}
               >
                 <SelectTrigger>
                   <SelectValue placeholder="Select vendor..." />
                 </SelectTrigger>
                 <SelectContent>
                   {vendors?.map((vendor) => (
                     <SelectItem key={vendor.id} value={vendor.id}>
                       {vendor.name}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="published_at">Publish Date</Label>
             <Input
               id="published_at"
               type="date"
               value={formData.published_at}
               onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
             />
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
             <Label htmlFor="content">Content (HTML)</Label>
             <Textarea
               id="content"
               value={formData.content}
               onChange={(e) => setFormData({ ...formData, content: e.target.value })}
               rows={8}
               placeholder="Full case study content in HTML"
               className="font-mono text-sm"
             />
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="metrics">Metrics (comma-separated)</Label>
             <Input
               id="metrics"
               value={formData.metrics}
               onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
               placeholder="30% cost reduction, 50% faster implementation"
             />
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="featured_image">Featured Image URL</Label>
             <Input
               id="featured_image"
               value={formData.featured_image}
               onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
             />
           </div>
 
           <DialogFooter>
             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
               Cancel
             </Button>
             <Button type="submit" disabled={isLoading}>
               {isLoading ? "Saving..." : caseStudy ? "Update" : "Create"}
             </Button>
           </DialogFooter>
         </form>
       </DialogContent>
     </Dialog>
   );
 }
 
 function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
   const [editOpen, setEditOpen] = useState(false);
   const deleteCaseStudy = useDeleteCaseStudy();
 
   return (
     <>
       <Card className="hover:shadow-md transition-shadow">
         <CardContent className="p-4">
           <div className="flex items-start gap-3">
             <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
               <BookOpen className="h-5 w-5 text-muted-foreground" />
             </div>
             <div className="flex-1 min-w-0">
               <h3 className="font-semibold text-foreground truncate mb-1">{caseStudy.title}</h3>
               <div className="flex items-center gap-2 mb-1 flex-wrap">
                 {caseStudy.industry && (
                   <Badge variant="outline" className="text-xs">
                     {caseStudy.industry.name}
                   </Badge>
                 )}
                 {caseStudy.vendor && (
                   <Badge variant="secondary" className="text-xs">
                     {caseStudy.vendor.name}
                   </Badge>
                 )}
                 <span className="text-xs text-muted-foreground flex items-center gap-1">
                   <Calendar className="h-3 w-3" />
                   {format(new Date(caseStudy.published_at), "MMM d, yyyy")}
                 </span>
               </div>
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
                       <AlertDialogTitle>Delete Case Study</AlertDialogTitle>
                       <AlertDialogDescription>
                         Are you sure you want to delete "{caseStudy.title}"? This action cannot be undone.
                       </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                       <AlertDialogCancel>Cancel</AlertDialogCancel>
                       <AlertDialogAction
                         onClick={() => deleteCaseStudy.mutate(caseStudy.id)}
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
       <CaseStudyFormDialog caseStudy={caseStudy} open={editOpen} onOpenChange={setEditOpen} />
     </>
   );
 }
 
 export function AdminCaseStudiesSection() {
   const [createOpen, setCreateOpen] = useState(false);
   const { data: caseStudies, isLoading } = useCaseStudies();
 
   return (
     <Card>
       <CardHeader className="flex flex-row items-center justify-between">
         <div>
           <CardTitle className="flex items-center gap-2">
             <BookOpen className="h-5 w-5" />
             Case Studies
           </CardTitle>
         </div>
         <Button onClick={() => setCreateOpen(true)} size="sm">
           <Plus className="h-4 w-4 mr-2" />
           Add Case Study
         </Button>
       </CardHeader>
       <CardContent>
         {isLoading ? (
           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
             {Array.from({ length: 3 }).map((_, i) => (
               <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />
             ))}
           </div>
         ) : caseStudies && caseStudies.length > 0 ? (
           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
             {caseStudies.map((cs) => (
               <CaseStudyCard key={cs.id} caseStudy={cs} />
             ))}
           </div>
         ) : (
           <div className="rounded-lg border border-dashed p-12 text-center">
             <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
             <p className="text-muted-foreground mb-4">No case studies yet</p>
             <Button onClick={() => setCreateOpen(true)}>
               <Plus className="h-4 w-4 mr-2" />
               Add Your First Case Study
             </Button>
           </div>
         )}
       </CardContent>
       <CaseStudyFormDialog open={createOpen} onOpenChange={setCreateOpen} />
     </Card>
   );
 }