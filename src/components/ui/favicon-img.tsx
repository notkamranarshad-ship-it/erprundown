import { useState } from "react";
import { Building2 } from "lucide-react";
import { resolveLogoUrl } from "@/lib/favicon";
import { cn } from "@/lib/utils";

interface FaviconImgProps {
  logoUrl?: string | null;
  websiteUrl?: string | null;
  name: string;
  className?: string;
  size?: number;
}

/**
 * Renders a company logo/favicon with automatic fallback:
 * 1. Custom logo_url if provided
 * 2. Google Favicon from website_url domain
 * 3. Placeholder icon with initial letter
 */
export function FaviconImg({ logoUrl, websiteUrl, name, className = "h-10 w-10", size = 64 }: FaviconImgProps) {
  const [failed, setFailed] = useState(false);
  const src = resolveLogoUrl(logoUrl, websiteUrl, size);

  if (!src || failed) {
    return (
      <span className={cn("flex items-center justify-center text-lg font-bold text-muted-foreground", className)}>
        {name.charAt(0)}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} logo`}
      className={cn("object-contain", className)}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
