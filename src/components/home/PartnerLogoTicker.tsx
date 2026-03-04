import { usePartners } from "@/hooks/usePartners";

export function PartnerLogoTicker() {
  const { data: partners } = usePartners({ featured: true });

  const logos = partners?.filter((p) => p.logo_url) ?? [];

  if (logos.length === 0) return null;

  // Duplicate for seamless loop
  const tickerItems = [...logos, ...logos];

  return (
    <section className="border-y bg-muted/30 py-6 md:py-8 overflow-hidden">
      <div className="container-page">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Featured ERP Partners
        </p>
      </div>
      <div className="relative">
        <div className="flex animate-ticker w-max gap-12 px-6">
          {tickerItems.map((partner, i) => (
            <div
              key={`${partner.id}-${i}`}
              className="flex shrink-0 items-center justify-center grayscale opacity-60 transition-all hover:grayscale-0 hover:opacity-100"
            >
              <img
                src={partner.logo_url!}
                alt={partner.name}
                className="h-7 w-auto max-w-[100px] object-contain sm:h-9 sm:max-w-[120px]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
