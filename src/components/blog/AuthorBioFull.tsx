import { CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
