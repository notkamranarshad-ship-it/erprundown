import { User, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AuthorBioProps {
  authorName: string;
  authorTitle?: string | null;
  coAuthorName?: string | null;
  coAuthorTitle?: string | null;
  verifiedByName?: string | null;
  verifiedByTitle?: string | null;
}

export function AuthorBio({
  authorName,
  authorTitle,
  coAuthorName,
  coAuthorTitle,
  verifiedByName,
  verifiedByTitle,
}: AuthorBioProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      {/* Primary Author */}
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 border-2 border-primary/20">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {getInitials(authorName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground">{authorName}</p>
          {authorTitle && (
            <p className="text-sm text-muted-foreground">{authorTitle}</p>
          )}
        </div>
      </div>

      {/* Co-Author */}
      {coAuthorName && (
        <div className="flex items-center gap-3 pl-4 border-l-2 border-border">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-muted text-muted-foreground text-sm">
              {getInitials(coAuthorName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <User className="h-3 w-3" />
              Co-Author
            </p>
            <p className="font-medium text-foreground">{coAuthorName}</p>
            {coAuthorTitle && (
              <p className="text-xs text-muted-foreground">{coAuthorTitle}</p>
            )}
          </div>
        </div>
      )}

      {/* Verified By */}
      {verifiedByName && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
          <Avatar className="h-10 w-10 border border-success/30">
            <AvatarFallback className="bg-success/20 text-success text-sm">
              {getInitials(verifiedByName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-success flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5" />
              Verified by
            </p>
            <p className="font-medium text-foreground">{verifiedByName}</p>
            {verifiedByTitle && (
              <p className="text-xs text-muted-foreground">{verifiedByTitle}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
