import { useBlogPosts } from "@/hooks/useBlogPosts";
import { BlogGridCard } from "@/components/blog/BlogGridCard";
import { Skeleton } from "@/components/ui/skeleton";

interface AdvisorContributionsProps {
  advisorName?: string;
  limit?: number;
}

export function AdvisorContributions({ advisorName, limit = 3 }: AdvisorContributionsProps) {
  const { data: posts, isLoading } = useBlogPosts();

  // For now, show random posts as contributions (in production, filter by advisor)
  const contributions = posts?.slice(0, limit) || [];

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: limit }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    );
  }

  if (contributions.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No contributions yet.
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {contributions.map((post) => (
        <BlogGridCard key={post.id} post={post} />
      ))}
    </div>
  );
}
