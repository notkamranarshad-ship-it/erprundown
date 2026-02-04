import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { Advisor } from "@/data/advisors";

interface AdvisorCardProps {
  advisor: Advisor;
}

export function AdvisorCard({ advisor }: AdvisorCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Link to={`/advisory-board/${advisor.slug}`}>
      <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:border-primary/20 cursor-pointer">
        <CardContent className="p-6 text-center">
          <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-primary/10 group-hover:border-primary/30 transition-colors">
            <AvatarImage src={advisor.imageUrl} alt={advisor.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
              {getInitials(advisor.name)}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
            {advisor.name}
          </h3>
          <p className="text-sm text-primary font-medium mb-2">
            {advisor.role} at {advisor.company}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {advisor.shortBio}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
