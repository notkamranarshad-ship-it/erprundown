import { useMemo, useState } from "react";
import { Building2 } from "lucide-react";
import { getLogoCandidates } from "@/lib/favicon";
import { cn } from "@/lib/utils";

interface FaviconImgProps {
  logoUrl?: string | null;
  websiteUrl?: string | null;
  name: string;
  className?: string;
  size?: number;
}

export function FaviconImg({ logoUrl, websiteUrl, name, className = "h-10 w-10", size = 64 }: FaviconImgProps) {
  const [failedIndex, setFailedIndex] = useState(0);
  const candidates = useMemo(() => getLogoCandidates(logoUrl, websiteUrl, size), [logoUrl, websiteUrl, size]);
  const src = candidates[failedIndex];

  if (!src) {
    return (
      <span className={cn("flex items-center justify-center rounded bg-muted text-muted-foreground", className)}>
        <Building2 className="h-4 w-4" />
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} logo`}
      className={cn("object-contain", className)}
      loading="lazy"
      onError={() => setFailedIndex((idx) => idx + 1)}
    />
  );
}

