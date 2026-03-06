/**
 * Generate a Google Favicon URL from a website URL or logo_url.
 * Falls back to null if no valid domain can be extracted.
 */
export function getFaviconUrl(websiteUrl: string | null | undefined, size: number = 64): string | null {
  if (!websiteUrl) return null;
  try {
    const domain = new URL(websiteUrl).hostname.replace(/^www\./, "");
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
  } catch {
    return null;
  }
}

/**
 * Resolves the best logo source for a vendor/partner:
 * 1. If logo_url is set and is a direct image, use it
 * 2. Otherwise, generate a Google favicon from website_url
 * 3. Falls back to null
 */
export function resolveLogoUrl(
  logoUrl: string | null | undefined,
  websiteUrl: string | null | undefined,
  size: number = 64
): string | null {
  // If a custom logo_url is stored, use it directly (admin can override)
  if (logoUrl) return logoUrl;
  // Auto-generate from website domain
  return getFaviconUrl(websiteUrl, size);
}
