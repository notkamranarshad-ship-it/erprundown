/**
 * Normalizes URL input and extracts hostname for favicon generation.
 */
function extractDomain(url: string): string | null {
  if (!url) return null;
  try {
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    return new URL(normalized).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function getFaviconUrl(url: string | null | undefined, size: number = 64): string | null {
  if (!url) return null;
  const domain = extractDomain(url);
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

export function getLogoCandidates(
  logoUrl: string | null | undefined,
  websiteUrl: string | null | undefined,
  size: number = 64
): string[] {
  const candidates = [logoUrl, getFaviconUrl(websiteUrl || logoUrl, size)].filter(Boolean) as string[];
  return Array.from(new Set(candidates));
}

