import { Link } from "react-router-dom";
import { Calendar, User, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/types/database";
import { format } from "date-fns";

interface BlogGridCardProps {
  post: BlogPost;
}

export function BlogGridCard({ post }: BlogGridCardProps) {
  // Estimate reading time
  const wordCount = post.content?.split(/\s+/).length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <Link to={`/blog/${post.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden border-border/50 bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {post.featured_image ? (
            <img
              src={post.featured_image}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground/30">ERP</span>
            </div>
          )}
          {post.category && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              {post.category}
            </Badge>
          )}
        </div>

        <CardContent className="p-5">
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {post.author_name}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {readingTime} min
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(post.published_at), "MMM d")}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
