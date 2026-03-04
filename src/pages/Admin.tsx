import { useState } from "react";
import { Plus, Pencil, Trash2, User, Star, ExternalLink, FileText, Building2, Factory, BookOpen, Package, LogOut, LayoutGrid, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { PageLayout } from "@/components/layout/PageLayout";
import { useAuthorsAdmin, useCreateAuthor, useUpdateAuthor, useDeleteAuthor } from "@/hooks/useAuthors";
import { Author } from "@/types/database";
import { AdminPartnersSection } from "@/components/admin/AdminPartnersSection";
import { AdminIndustriesSection } from "@/components/admin/AdminIndustriesSection";
import { AdminBlogSection } from "@/components/admin/AdminBlogSection";
import { AdminCaseStudiesSection } from "@/components/admin/AdminCaseStudiesSection";
import { AdminVendorsSection } from "@/components/admin/AdminVendorsSection";
import { AdminHeroSection } from "@/components/admin/AdminHeroSection";
import { AdminPublicationsSection } from "@/components/admin/AdminPublicationsSection";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { useAuth } from "@/hooks/useAuth";

interface AuthorFormData {
  name: string;
  slug: string;
  title: string;
  bio: string;
  image_url: string;
  email: string;
  linkedin_url: string;
  twitter_url: string;
  is_default: boolean;
}

const initialFormData: AuthorFormData = {
  name: "",
  slug: "",
  title: "",
  bio: "",
  image_url: "",
  email: "",
  linkedin_url: "",
  twitter_url: "",
  is_default: false,
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function AuthorFormDialog({
  author,
  open,
  onOpenChange,
}: {
  author?: Author;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [formData, setFormData] = useState<AuthorFormData>(
    author
      ? {
          name: author.name,
          slug: author.slug,
          title: author.title || "",
          bio: author.bio || "",
          image_url: author.image_url || "",
          email: author.email || "",
          linkedin_url: author.linkedin_url || "",
          twitter_url: author.twitter_url || "",
          is_default: author.is_default,
        }
      : initialFormData
  );

  const createAuthor = useCreateAuthor();
  const updateAuthor = useUpdateAuthor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      slug: formData.slug || generateSlug(formData.name),
      title: formData.title || null,
      bio: formData.bio || null,
      image_url: formData.image_url || null,
      email: formData.email || null,
      linkedin_url: formData.linkedin_url || null,
      twitter_url: formData.twitter_url || null,
      is_default: formData.is_default,
    };

    if (author) {
      await updateAuthor.mutateAsync({ id: author.id, ...payload });
    } else {
      await createAuthor.mutateAsync(payload);
    }
    
    onOpenChange(false);
    setFormData(initialFormData);
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{author ? "Edit Author" : "Create New Author"}</DialogTitle>
          <DialogDescription>
            {author ? "Update author profile information." : "Add a new author to your team."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="john-doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title/Position</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Founder at Company"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Profile Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              placeholder="A short bio about the author..."
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, linkedin_url: e.target.value }))}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter_url">Twitter/X URL</Label>
            <Input
              id="twitter_url"
              value={formData.twitter_url}
              onChange={(e) => setFormData((prev) => ({ ...prev, twitter_url: e.target.value }))}
              placeholder="https://twitter.com/..."
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Switch
              id="is_default"
              checked={formData.is_default}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_default: checked }))}
            />
            <Label htmlFor="is_default" className="text-sm">
              Set as default author for new posts
            </Label>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createAuthor.isPending || updateAuthor.isPending}
            >
              {createAuthor.isPending || updateAuthor.isPending ? "Saving..." : author ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AuthorCard({ author }: { author: Author }) {
  const [editOpen, setEditOpen] = useState(false);
  const deleteAuthor = useDeleteAuthor();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary/20 shrink-0">
              {author.image_url && <AvatarImage src={author.image_url} alt={author.name} />}
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(author.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">{author.name}</h3>
                {author.is_default && (
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Default
                  </Badge>
                )}
              </div>
              {author.title && (
                <p className="text-sm text-muted-foreground truncate">{author.title}</p>
              )}
              {author.email && (
                <p className="text-xs text-muted-foreground mt-1 truncate">{author.email}</p>
              )}
              
              <div className="flex items-center gap-2 mt-3">
                {author.linkedin_url && (
                  <a href={author.linkedin_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                )}
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
                      <AlertDialogTitle>Delete Author</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {author.name}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteAuthor.mutate(author.id)}
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
      
      <AuthorFormDialog author={author} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}

export default function AdminPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const { data: authors, isLoading } = useAuthorsAdmin();
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLogin={signIn} />;
  }

  return (
    <PageLayout>
      <div className="container-page py-8 lg:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Signed in as {user.email}
            </p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="blog" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Blog</span>
            </TabsTrigger>
            <TabsTrigger value="vendors" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Vendors</span>
            </TabsTrigger>
            <TabsTrigger value="case-studies" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Case Studies</span>
            </TabsTrigger>
            <TabsTrigger value="industries" className="flex items-center gap-2">
              <Factory className="h-4 w-4" />
              <span className="hidden sm:inline">Industries</span>
            </TabsTrigger>
            <TabsTrigger value="partners" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Partners</span>
            </TabsTrigger>
            <TabsTrigger value="authors" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Authors</span>
            </TabsTrigger>
            <TabsTrigger value="hero" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Hero</span>
            </TabsTrigger>
            <TabsTrigger value="publications" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              <span className="hidden sm:inline">Featured In</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blog">
            <AdminBlogSection />
          </TabsContent>

          <TabsContent value="vendors">
            <AdminVendorsSection />
          </TabsContent>

          <TabsContent value="case-studies">
            <AdminCaseStudiesSection />
          </TabsContent>

          <TabsContent value="industries">
            <AdminIndustriesSection />
          </TabsContent>

          <TabsContent value="partners">
            <AdminPartnersSection />
          </TabsContent>

          <TabsContent value="authors">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Authors
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage author profiles for blog posts
                  </p>
                </div>
                <Button onClick={() => setCreateOpen(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Author
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
                    ))}
                  </div>
                ) : authors && authors.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {authors.map((author) => (
                      <AuthorCard key={author.id} author={author} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-12 text-center">
                    <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No authors yet</p>
                    <Button onClick={() => setCreateOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Author
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <AuthorFormDialog open={createOpen} onOpenChange={setCreateOpen} />
          </TabsContent>

          <TabsContent value="hero">
            <AdminHeroSection />
          </TabsContent>

          <TabsContent value="publications">
            <AdminPublicationsSection />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
