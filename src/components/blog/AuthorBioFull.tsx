import { CheckCircle, Linkedin, Twitter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthorsPublic } from "@/hooks/useAuthors";

interface AuthorBioFullProps {
  authorName: string;
  authorTitle?: string | null;
  authorImage?: string;
  verifiedByName?: string | null;
  verifiedByTitle?: string | null;
}

export function AuthorBioFull({
  authorName,
  authorTitle,
  authorImage,
  verifiedByName,
  verifiedByTitle,
}: AuthorBioFullProps) {
  const { data: authors } = useAuthorsPublic();
  const author = authors?.find((a) => a.name === authorName);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Author Section */}
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Written by
          </p>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20 shrink-0">
              {authorImage ? (
                <AvatarImage src={authorImage} alt={authorName} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                {getInitials(authorName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground text-lg">{authorName}</p>
              {authorTitle && (
                <p className="text-sm text-muted-foreground mt-0.5">{authorTitle}</p>
              )}
              {author?.bio && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {author.bio}
                </p>
              )}
              {/* Social Links */}
              {(author?.linkedin_url || author?.twitter_url) && (
                <div className="flex items-center gap-2 mt-3">
                  {author?.linkedin_url && (
                    <a
                      href={author.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-border hover:bg-muted transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4 text-muted-foreground" />
                    </a>
                  )}
                  {author?.twitter_url && (
                    <a
                      href={author.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-border hover:bg-muted transition-colors"
                      aria-label="X (Twitter)"
                    >
                      <Twitter className="h-4 w-4 text-muted-foreground" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verified By Section */}
        {verifiedByName && (
          <div className="flex-1 sm:border-l sm:border-border sm:pl-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-success" />
              Verified by
            </p>
            <div>
              <p className="font-semibold text-foreground text-lg">{verifiedByName}</p>
              {verifiedByTitle && (
                <p className="text-sm text-muted-foreground mt-0.5">{verifiedByTitle}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
