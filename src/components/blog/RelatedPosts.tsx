import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/types/database";
import { format } from "date-fns";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-12 pt-12 border-t border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6">Related Articles</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.slug}`}>
            <Card className="h-full overflow-hidden hover:border-primary/30 hover:shadow-md transition-all duration-300 group">
              {post.featured_image && (
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <CardContent className="p-4">
                {post.category && (
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {post.category}
                  </Badge>
                )}
                <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {post.excerpt}
                </p>
                <p className="text-xs text-muted-foreground mt-3">
                  {format(new Date(post.published_at), "MMM d, yyyy")}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
