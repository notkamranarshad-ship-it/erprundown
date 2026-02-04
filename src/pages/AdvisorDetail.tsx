import { useParams, Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { AdvisorContributions } from "@/components/advisors/AdvisorContributions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Linkedin, Twitter } from "lucide-react";
import { advisors } from "@/data/advisors";

export default function AdvisorDetail() {
  const { slug } = useParams<{ slug: string }>();
  const advisor = advisors.find((a) => a.slug === slug);

  if (!advisor) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Advisor Not Found</h1>
          <Link to="/advisory-board">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Advisory Board
            </Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <PageLayout>
      {/* Back Link */}
      <div className="container mx-auto px-4 pt-8">
        <Link
          to="/advisory-board"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Advisory Board
        </Link>
      </div>

      {/* Profile Hero */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar */}
              <Avatar className="h-40 w-40 border-4 border-primary/20 flex-shrink-0">
                <AvatarImage src={advisor.imageUrl} alt={advisor.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-4xl">
                  {getInitials(advisor.name)}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {advisor.name}
                </h1>
                <p className="text-xl text-primary font-medium mb-4">
                  {advisor.role} at {advisor.company}
                </p>

                {/* Social Links */}
                <div className="flex gap-3 mb-6">
                  {advisor.linkedinUrl && (
                    <a
                      href={advisor.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:bg-[#0A66C2]/90 transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                  {advisor.twitterUrl && (
                    <a
                      href={advisor.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                      X / Twitter
                    </a>
                  )}
                </div>

                {/* Long Bio */}
                <div className="prose prose-muted max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {advisor.longBio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contributions Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Contributions by {advisor.name}
            </h2>
            <AdvisorContributions advisorName={advisor.name} limit={3} />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
