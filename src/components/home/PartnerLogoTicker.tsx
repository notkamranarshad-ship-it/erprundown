import { usePublications } from "@/hooks/usePublications";

export function PartnerLogoTicker() {
  const { data: pubs } = usePublications();

  const logos = pubs?.filter((p) => p.logo_url) ?? [];

  if (logos.length === 0) return null;

  // Duplicate for seamless loop
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
                src={pub.logo_url!}
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
