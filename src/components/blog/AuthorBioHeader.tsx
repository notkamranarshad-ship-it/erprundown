import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AuthorBioHeaderProps {
  authorName: string;
  authorImage?: string;
}

export function AuthorBioHeader({ authorName, authorImage }: AuthorBioHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 border-2 border-primary/20">
        {authorImage ? (
          <AvatarImage src={authorImage} alt={authorName} />
        ) : null}
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
          {getInitials(authorName)}
        </AvatarFallback>
      </Avatar>
      <span className="font-medium text-foreground">{authorName}</span>
    </div>
  );
}
