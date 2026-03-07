import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  uploadFolder: string;
  placeholder?: string;
}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export function ImageUploadField({
  label,
  value,
  onChange,
  uploadFolder,
  placeholder = "https://...",
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const filePath = `${uploadFolder}/${Date.now()}-${sanitizeFileName(file.name)}`;

      const { error: uploadError } = await supabase.storage
        .from("bucket")
        .upload(filePath, file, { upsert: true, contentType: file.type || "image/png" });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("bucket").getPublicUrl(filePath);
      onChange(data.publicUrl);
      toast.success("Image uploaded");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      toast.error(`Upload failed: ${message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="shrink-0"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange("")}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleUpload(file);
          e.currentTarget.value = "";
        }}
      />

      {value && (
        <div className="flex h-16 w-16 items-center justify-center rounded border bg-muted/30 p-2">
          <img
            src={value}
            alt={`${label} preview`}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}
