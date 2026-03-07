import { useState } from "react";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useAdvisors, useCreateAdvisor, useUpdateAdvisor, useDeleteAdvisor, Advisor,
} from "@/hooks/useAdvisors";

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const emptyForm = {
  name: "", slug: "", role: "", company: "", short_bio: "", long_bio: "",
  image_url: "", linkedin_url: "", twitter_url: "", display_order: "0",
};

export function AdminAdvisorsSection() {
  const { data: advisors, isLoading } = useAdvisors();
  const createAdvisor = useCreateAdvisor();
  const updateAdvisor = useUpdateAdvisor();
  const deleteAdvisor = useDeleteAdvisor();

  const [editAdvisor, setEditAdvisor] = useState<Advisor | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditAdvisor(null);
    setForm({ ...emptyForm, display_order: String((advisors?.length ?? 0) + 1) });
    setDialogOpen(true);
  };

  const openEdit = (a: Advisor) => {
    setEditAdvisor(a);
    setForm({
      name: a.name, slug: a.slug, role: a.role || "", company: a.company || "",
      short_bio: a.short_bio || "", long_bio: a.long_bio || "",
      image_url: a.image_url || "", linkedin_url: a.linkedin_url || "",
      twitter_url: a.twitter_url || "", display_order: String(a.display_order),
    });
    setDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: editAdvisor ? f.slug : generateSlug(name) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      slug: form.slug || generateSlug(form.name),
      role: form.role || null,
      company: form.company || null,
      short_bio: form.short_bio || null,
      long_bio: form.long_bio || null,
      image_url: form.image_url || null,
      linkedin_url: form.linkedin_url || null,
      twitter_url: form.twitter_url || null,
      display_order: Number(form.display_order) || 0,
    };
    if (editAdvisor) {
      await updateAdvisor.mutateAsync({ id: editAdvisor.id, ...payload });
    } else {
      await createAdvisor.mutateAsync(payload);
    }
    setDialogOpen(false);
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Advisory Board
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Manage advisory board members and their profile pages</p>
        </div>
        <Button onClick={openCreate} size="sm"><Plus className="h-4 w-4 mr-2" />Add Advisor</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />)}
          </div>
        ) : advisors && advisors.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {advisors.map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-lg border p-4">
                <Avatar className="h-12 w-12 shrink-0 border-2 border-primary/20">
                  {a.image_url && <AvatarImage src={a.image_url} alt={a.name} />}
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {getInitials(a.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{a.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{a.role}{a.company ? ` at ${a.company}` : ""}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Order: {a.display_order} · /{a.slug}</p>
                  <div className="flex gap-1 mt-2">
                    <Button variant="outline" size="sm" className="h-7" onClick={() => openEdit(a)}>
                      <Pencil className="h-3.5 w-3.5 mr-1" />Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {a.name}?</AlertDialogTitle>
                          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteAdvisor.mutate(a.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No advisors yet</p>
            <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add First Advisor</Button>
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editAdvisor ? "Edit Advisor" : "Add Advisor"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} required placeholder="John Mitchell" />
              </div>
              <div className="space-y-2">
                <Label>URL Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="john-mitchell" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Role / Title</Label>
                <Input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="CEO" />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} placeholder="TechVentures Inc." />
              </div>
            </div>
            <ImageUploadField
              label="Profile Image URL"
              value={form.image_url}
              onChange={(value) => setForm((f) => ({ ...f, image_url: value }))}
              uploadFolder="advisors"
            />
            <div className="space-y-2">
              <Label>Short Bio (for card)</Label>
              <Textarea value={form.short_bio} onChange={(e) => setForm((f) => ({ ...f, short_bio: e.target.value }))} rows={2} placeholder="Brief description..." />
            </div>
            <div className="space-y-2">
              <Label>Full Bio (for detail page)</Label>
              <Textarea value={form.long_bio} onChange={(e) => setForm((f) => ({ ...f, long_bio: e.target.value }))} rows={4} placeholder="Detailed biography..." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>LinkedIn URL</Label>
                <Input value={form.linkedin_url} onChange={(e) => setForm((f) => ({ ...f, linkedin_url: e.target.value }))} placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="space-y-2">
                <Label>Twitter/X URL</Label>
                <Input value={form.twitter_url} onChange={(e) => setForm((f) => ({ ...f, twitter_url: e.target.value }))} placeholder="https://twitter.com/..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input type="number" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: e.target.value }))} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createAdvisor.isPending || updateAdvisor.isPending}>
                {createAdvisor.isPending || updateAdvisor.isPending ? "Saving..." : editAdvisor ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
