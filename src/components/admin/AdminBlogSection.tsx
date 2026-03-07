import { useState } from "react";
import { Plus, Pencil, Trash2, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
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
import { useBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost } from "@/hooks/useBlogPosts";
import { useAuthors, PublicAuthor } from "@/hooks/useAuthors";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BlogPost } from "@/types/database";
import { format } from "date-fns";
 
 interface BlogFormData {
   title: string;
   slug: string;
   excerpt: string;
   content: string;
   category: string;
   author_id: string;
   author_name: string;
   author_title: string;
   co_author_name: string;
   co_author_title: string;
   verified_by_name: string;
   verified_by_title: string;
   featured_image: string;
   published_at: string;
 }
 
 const initialFormData: BlogFormData = {
   title: "",
   slug: "",
   excerpt: "",
   content: "",
   category: "",
   author_id: "",
   author_name: "",
   author_title: "",
   co_author_name: "",
   co_author_title: "",
   verified_by_name: "",
   verified_by_title: "",
   featured_image: "",
   published_at: new Date().toISOString().split("T")[0],
 };
 
 function generateSlug(title: string): string {
   return title
     .toLowerCase()
     .replace(/[^a-z0-9]+/g, "-")
     .replace(/(^-|-$)/g, "");
 }
 
 function BlogFormDialog({
   post,
   open,
   onOpenChange,
 }: {
   post?: BlogPost;
   open: boolean;
   onOpenChange: (open: boolean) => void;
 }) {
   const { data: authors } = useAuthors();
   const [formData, setFormData] = useState<BlogFormData>(
     post
       ? {
           title: post.title,
           slug: post.slug,
           excerpt: post.excerpt || "",
           content: post.content || "",
           category: post.category || "",
           author_id: "",
           author_name: post.author_name,
           author_title: post.author_title || "",
           co_author_name: post.co_author_name || "",
           co_author_title: post.co_author_title || "",
           verified_by_name: post.verified_by_name || "",
           verified_by_title: post.verified_by_title || "",
           featured_image: post.featured_image || "",
           published_at: post.published_at?.split("T")[0] || new Date().toISOString().split("T")[0],
         }
       : initialFormData
   );
 
   const createBlog = useCreateBlogPost();
   const updateBlog = useUpdateBlogPost();
 
   const handleAuthorSelect = (authorId: string) => {
     const author = authors?.find((a) => a.id === authorId);
     if (author) {
       setFormData({
         ...formData,
         author_id: authorId,
         author_name: author.name,
         author_title: author.title || "",
       });
     }
   };
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
 
     const payload = {
       title: formData.title,
       slug: formData.slug || generateSlug(formData.title),
       excerpt: formData.excerpt || null,
       content: formData.content || null,
       category: formData.category || null,
       author_name: formData.author_name,
       author_title: formData.author_title || null,
       co_author_name: formData.co_author_name || null,
       co_author_title: formData.co_author_title || null,
       verified_by_name: formData.verified_by_name || null,
       verified_by_title: formData.verified_by_title || null,
       featured_image: formData.featured_image || null,
       published_at: formData.published_at ? new Date(formData.published_at).toISOString() : new Date().toISOString(),
     };
 
     if (post) {
       await updateBlog.mutateAsync({ id: post.id, ...payload });
     } else {
       await createBlog.mutateAsync(payload);
     }
 
     onOpenChange(false);
     setFormData(initialFormData);
   };
 
   const isLoading = createBlog.isPending || updateBlog.isPending;
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <DialogTitle>{post ? "Edit Blog Post" : "Add Blog Post"}</DialogTitle>
           <DialogDescription>
             {post ? "Update blog post content" : "Create a new blog post"}
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
               <Label htmlFor="category">Category</Label>
               <Input
                 id="category"
                 value={formData.category}
                 onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                 placeholder="e.g., Industry Insights"
               />
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
           </div>
 
           <div className="space-y-2">
             <Label htmlFor="excerpt">Excerpt</Label>
             <Textarea
               id="excerpt"
               value={formData.excerpt}
               onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
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
               placeholder="Full article content in HTML"
               className="font-mono text-sm"
             />
           </div>
 
            <ImageUploadField
              label="Featured Image URL"
              value={formData.featured_image}
              onChange={(value) => setFormData({ ...formData, featured_image: value })}
              uploadFolder="blog"
            />
 
           <div className="border-t pt-4">
             <h4 className="font-medium mb-3">Author Information</h4>
             <div className="space-y-4">
               <div className="space-y-2">
                 <Label>Select from Authors</Label>
                 <Select onValueChange={handleAuthorSelect}>
                   <SelectTrigger>
                     <SelectValue placeholder="Choose an author..." />
                   </SelectTrigger>
                   <SelectContent>
                     {authors?.map((author) => (
                       <SelectItem key={author.id} value={author.id}>
                         {author.name} {author.title && `- ${author.title}`}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="author_name">Author Name *</Label>
                   <Input
                     id="author_name"
                     value={formData.author_name}
                     onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                     required
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="author_title">Author Title</Label>
                   <Input
                     id="author_title"
                     value={formData.author_title}
                     onChange={(e) => setFormData({ ...formData, author_title: e.target.value })}
                   />
                 </div>
               </div>
             </div>
           </div>
 
           <div className="border-t pt-4">
             <h4 className="font-medium mb-3">Co-Author (Optional)</h4>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="co_author_name">Co-Author Name</Label>
                 <Input
                   id="co_author_name"
                   value={formData.co_author_name}
                   onChange={(e) => setFormData({ ...formData, co_author_name: e.target.value })}
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="co_author_title">Co-Author Title</Label>
                 <Input
                   id="co_author_title"
                   value={formData.co_author_title}
                   onChange={(e) => setFormData({ ...formData, co_author_title: e.target.value })}
                 />
               </div>
             </div>
           </div>
 
           <div className="border-t pt-4">
             <h4 className="font-medium mb-3">Verified By (Optional)</h4>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="verified_by_name">Verified By Name</Label>
                 <Input
                   id="verified_by_name"
                   value={formData.verified_by_name}
                   onChange={(e) => setFormData({ ...formData, verified_by_name: e.target.value })}
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="verified_by_title">Verified By Title</Label>
                 <Input
                   id="verified_by_title"
                   value={formData.verified_by_title}
                   onChange={(e) => setFormData({ ...formData, verified_by_title: e.target.value })}
                 />
               </div>
             </div>
           </div>
 
           <DialogFooter>
             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
               Cancel
             </Button>
             <Button type="submit" disabled={isLoading}>
               {isLoading ? "Saving..." : post ? "Update" : "Create"}
             </Button>
           </DialogFooter>
         </form>
       </DialogContent>
     </Dialog>
   );
 }
 
 function BlogCard({ post }: { post: BlogPost }) {
   const [editOpen, setEditOpen] = useState(false);
   const deleteBlog = useDeleteBlogPost();
 
   return (
     <>
       <Card className="hover:shadow-md transition-shadow">
         <CardContent className="p-4">
           <div className="flex items-start gap-3">
             <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
               <FileText className="h-5 w-5 text-muted-foreground" />
             </div>
             <div className="flex-1 min-w-0">
               <h3 className="font-semibold text-foreground truncate mb-1">{post.title}</h3>
               <div className="flex items-center gap-2 mb-1">
                 {post.category && (
                   <Badge variant="outline" className="text-xs">
                     {post.category}
                   </Badge>
                 )}
                 <span className="text-xs text-muted-foreground flex items-center gap-1">
                   <Calendar className="h-3 w-3" />
                   {format(new Date(post.published_at), "MMM d, yyyy")}
                 </span>
               </div>
               <p className="text-xs text-muted-foreground">By {post.author_name}</p>
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
                       <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                       <AlertDialogDescription>
                         Are you sure you want to delete "{post.title}"? This action cannot be undone.
                       </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                       <AlertDialogCancel>Cancel</AlertDialogCancel>
                       <AlertDialogAction
                         onClick={() => deleteBlog.mutate(post.id)}
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
       <BlogFormDialog post={post} open={editOpen} onOpenChange={setEditOpen} />
     </>
   );
 }
 
 export function AdminBlogSection() {
   const [createOpen, setCreateOpen] = useState(false);
   const { data: posts, isLoading } = useBlogPosts();
 
   return (
     <Card>
       <CardHeader className="flex flex-row items-center justify-between">
         <div>
           <CardTitle className="flex items-center gap-2">
             <FileText className="h-5 w-5" />
             Blog Posts
           </CardTitle>
         </div>
         <Button onClick={() => setCreateOpen(true)} size="sm">
           <Plus className="h-4 w-4 mr-2" />
           Add Post
         </Button>
       </CardHeader>
       <CardContent>
         {isLoading ? (
           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
             {Array.from({ length: 3 }).map((_, i) => (
               <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />
             ))}
           </div>
         ) : posts && posts.length > 0 ? (
           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
             {posts.map((post) => (
               <BlogCard key={post.id} post={post} />
             ))}
           </div>
         ) : (
           <div className="rounded-lg border border-dashed p-12 text-center">
             <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
             <p className="text-muted-foreground mb-4">No blog posts yet</p>
             <Button onClick={() => setCreateOpen(true)}>
               <Plus className="h-4 w-4 mr-2" />
               Add Your First Post
             </Button>
           </div>
         )}
       </CardContent>
       <BlogFormDialog open={createOpen} onOpenChange={setCreateOpen} />
     </Card>
   );
 }