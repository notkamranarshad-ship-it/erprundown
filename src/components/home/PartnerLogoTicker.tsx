import { usePublications } from "@/hooks/usePublications";

function getFaviconUrl(websiteUrl: string | null, logoUrl: string | null) {
  const url = websiteUrl || logoUrl;
  if (!url) return null;
  try {
    const domain = new URL(url).hostname.replace(/^www\./, "");
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return null;
  }
}

function isDirectImage(url: string) {
  return /\.(png|jpg|jpeg|svg|webp|gif)(\?.*)?$/i.test(url);
}

export function PartnerLogoTicker() {
  const { data: pubs } = usePublications();
  const logos = pubs?.filter((p) => p.name) ?? [];

  if (logos.length === 0) return null;

  const tickerItems = [...logos, ...logos];

  return (
    <section className="border-y border-border bg-muted/30 py-6 md:py-8 overflow-hidden">
      <div className="container-page">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          As Seen In
        </p>
      </div>
      <div className="relative">
        <div className="flex animate-ticker w-max gap-12 px-6">
          {tickerItems.map((pub, i) => {
            const logoSrc =
              pub.logo_url && (isDirectImage(pub.logo_url) || pub.logo_url.includes("google.com/s2/favicons"))
                ? pub.logo_url
                : getFaviconUrl(pub.website_url, pub.logo_url) ||
                  pub.logo_url ||
                  "";

            return (
              <a
                key={`${pub.id}-${i}`}
                href={pub.website_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-2.5 opacity-70 transition-all hover:opacity-100"
              >
                <img
                  src={logoSrc}
                  alt={pub.name}
                  className="h-8 w-8 object-contain sm:h-10 sm:w-10"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.onerror = null;
                    const fallback = getFaviconUrl(pub.website_url, pub.logo_url);
                    if (fallback && target.src !== fallback) {
                      target.src = fallback;
                    }
                  }}
                />
                <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                  {pub.name}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
