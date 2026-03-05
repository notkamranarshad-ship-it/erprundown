import { usePublications } from "@/hooks/usePublications";

function isImageUrl(url: string) {
  return /\.(png|jpg|jpeg|svg|webp|gif)(\?.*)?$/i.test(url);
}

function getFallbackLogoDataUri(name: string) {
  const safeName = (name || "Publication").replace(/[<>&"']/g, "");
  const initials = safeName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "P";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="72" viewBox="0 0 240 72">
      <rect width="240" height="72" rx="12" fill="hsl(210 20% 96%)"/>
      <rect x="8" y="8" width="56" height="56" rx="10" fill="hsl(213 47% 24%)"/>
      <text x="36" y="44" text-anchor="middle" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="hsl(0 0% 100%)">${initials}</text>
      <text x="76" y="45" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="hsl(215 25% 15%)">${safeName}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getLogoUrl(pub: { name: string; logo_url: string | null; website_url: string | null }) {
  if (pub.logo_url && (isImageUrl(pub.logo_url) || pub.logo_url.includes("logo.clearbit.com"))) {
    return pub.logo_url;
  }

  const url = pub.website_url || pub.logo_url;
  if (url) {
    try {
      const domain = new URL(url).hostname.replace(/^www\./, "");
      return `https://logo.clearbit.com/${domain}`;
    } catch {
      return getFallbackLogoDataUri(pub.name);
    }
  }

  return getFallbackLogoDataUri(pub.name);
}

export function PartnerLogoTicker() {
  const { data: pubs } = usePublications();

  const logos = pubs?.filter((p) => p.name) ?? [];

  if (logos.length === 0) return null;

  const tickerItems = [...logos, ...logos];

  return (
    <section className="border-y bg-muted/30 py-6 md:py-8 overflow-hidden">
      <div className="container-page">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          As Seen In
        </p>
      </div>
      <div className="relative">
        <div className="flex animate-ticker w-max gap-12 px-6">
          {tickerItems.map((pub, i) => (
            <a
              key={`${pub.id}-${i}`}
              href={pub.website_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center justify-center grayscale opacity-60 transition-all hover:grayscale-0 hover:opacity-100"
            >
              <img
                src={getLogoUrl(pub)}
                alt={pub.name}
                className="h-7 w-auto max-w-[140px] object-contain sm:h-9 sm:max-w-[180px]"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.onerror = null;
                  target.src = getFallbackLogoDataUri(pub.name);
                }}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
