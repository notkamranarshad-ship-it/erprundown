import { usePublications } from "@/hooks/usePublications";

function isImageUrl(url: string) {
  return /\.(png|jpg|jpeg|svg|webp|gif)(\?.*)?$/i.test(url);
}

function getLogoUrl(pub: { logo_url: string | null; website_url: string | null }) {
  if (pub.logo_url && isImageUrl(pub.logo_url)) return pub.logo_url;
  const url = pub.website_url || pub.logo_url;
  if (url) {
    try {
      const domain = new URL(url).hostname;
      return `https://logo.clearbit.com/${domain}`;
    } catch { return null; }
  }
  return null;
}

export function PartnerLogoTicker() {
  const { data: pubs } = usePublications();

  const logos = pubs?.filter((p) => getLogoUrl(p)) ?? [];

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
                src={getLogoUrl(pub)!}
                alt={pub.name}
                className="h-7 w-auto max-w-[100px] object-contain sm:h-9 sm:max-w-[120px]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}