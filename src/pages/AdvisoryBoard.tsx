import { PageLayout } from "@/components/layout/PageLayout";
import { AdvisorCard } from "@/components/advisors/AdvisorCard";
import { AdvisorContributions } from "@/components/advisors/AdvisorContributions";
import { useAdvisors } from "@/hooks/useAdvisors";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdvisoryBoard() {
  const { data: advisors, isLoading } = useAdvisors();

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24 shadow-none">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Advisory Board
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Meet the industry leaders and experts who guide our mission to help
              businesses make smarter ERP decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Advisors Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ?
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 6 }).map((_, i) =>
            <Skeleton key={i} className="h-48 rounded-lg" />
            )}
            </div> :
          advisors && advisors.length > 0 ?
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {advisors.map((advisor) =>
            <AdvisorCard
              key={advisor.id}
              advisor={{
                id: advisor.id,
                slug: advisor.slug,
                name: advisor.name,
                role: advisor.role || "",
                company: advisor.company || "",
                shortBio: advisor.short_bio || "",
                longBio: advisor.long_bio || "",
                imageUrl: advisor.image_url || "/placeholder.svg",
                linkedinUrl: advisor.linkedin_url || undefined,
                twitterUrl: advisor.twitter_url || undefined
              }} />

            )}
            </div> :

          <p className="text-center text-muted-foreground">No advisors yet.</p>
          }
        </div>
      </section>

      {/* Contributions Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Contributions by Our Advisors
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore insights and expertise shared by our distinguished advisory board members.
            </p>
          </div>
          <AdvisorContributions limit={6} />
        </div>
      </section>
    </PageLayout>);

}