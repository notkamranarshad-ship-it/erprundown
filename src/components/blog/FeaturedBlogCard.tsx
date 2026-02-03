import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/types/database";
import { format } from "date-fns";

interface FeaturedBlogCardProps {
  post: BlogPost;
}

export function FeaturedBlogCard({ post }: FeaturedBlogCardProps) {
  // Estimate reading time (average 200 words per minute)
  const wordCount = post.content?.split(/\s+/).length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Image Side */}
          <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
            {post.featured_image ? (
              <img
                src={post.featured_image}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-6xl font-bold text-primary/30">ERP</span>
              </div>
            )}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent lg:hidden" />
          </div>

          {/* Content Side */}
          <div className="flex flex-col justify-center p-8 lg:p-12">
            <div className="flex items-center gap-3 mb-4">
              {post.category && (
                <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {post.category}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                Featured
              </Badge>
            </div>

            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-3">
              {post.title}
            </h2>

            <p className="text-muted-foreground text-lg mb-6 line-clamp-3">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {post.author_name}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {format(new Date(post.published_at), "MMMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {readingTime} min read
              </span>
            </div>

            <Button variant="default" className="w-fit group/btn">
              Read Full Guide
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </article>
    </Link>
  );
}
