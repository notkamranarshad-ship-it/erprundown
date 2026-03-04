import { useState } from "react";
import { Plus, Pencil, Trash2, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  usePublications, useCreatePublication, useUpdatePublication, useDeletePublication, Publication,
} from "@/hooks/usePublications";

export function AdminPublicationsSection() {
  const { data: pubs, isLoading } = usePublications();
  const createPub = useCreatePublication();
  const updatePub = useUpdatePublication();
  const deletePub = useDeletePublication();

  const [editPub, setEditPub] = useState<Publication | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", logo_url: "", website_url: "", display_order: "0" });

  const openCreate = () => {
    setEditPub(null);
    setForm({ name: "", logo_url: "", website_url: "", display_order: String((pubs?.length ?? 0) + 1) });
    setDialogOpen(true);
  };

  const openEdit = (p: Publication) => {
    setEditPub(p);
    setForm({ name: p.name, logo_url: p.logo_url || "", website_url: p.website_url || "", display_order: String(p.display_order) });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name: form.name, logo_url: form.logo_url || undefined, website_url: form.website_url || undefined, display_order: Number(form.display_order) || 0 };
    if (editPub) {
      await updatePub.mutateAsync({ id: editPub.id, ...payload });
    } else {
      await createPub.mutateAsync(payload);
    }
    setDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Featured In / As Seen In
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Publication logos shown on the homepage ticker</p>
        </div>
        <Button onClick={openCreate} size="sm"><Plus className="h-4 w-4 mr-2" />Add Publication</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />)}
          </div>
        ) : pubs && pubs.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pubs.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg border p-3">
                {p.logo_url ? (
                  <img src={p.logo_url} alt={p.name} className="h-8 w-auto max-w-[80px] object-contain" />
                ) : (
                  <div className="h-8 w-16 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">No logo</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">Order: {p.display_order}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {p.name}?</AlertDialogTitle>
                        <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deletePub.mutate(p.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No publications yet</p>
            <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add First Publication</Button>
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editPub ? "Edit Publication" : "Add Publication"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required placeholder="Forbes" />
            </div>
            <div className="space-y-2">
              <Label>Logo URL</Label>
              <Input value={form.logo_url} onChange={(e) => setForm((f) => ({ ...f, logo_url: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input value={form.website_url} onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input type="number" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: e.target.value }))} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createPub.isPending || updatePub.isPending}>
                {createPub.isPending || updatePub.isPending ? "Saving..." : editPub ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
