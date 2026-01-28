import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { useBlogPosts, useBlogCategories } from "@/hooks/useBlogPosts";

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  
  const selectedCategory = searchParams.get("category") || "";
  
  const { data: posts, isLoading } = useBlogPosts({
    search: searchQuery,
    category: selectedCategory || undefined,
  });
  
  const { data: categories } = useBlogCategories();

  const updateCategory = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  };

  // Get featured post (first one)
  const featuredPost = posts?.[0];
  const otherPosts = posts?.slice(1);

  return (
    <PageLayout>
      {/* Header */}
      <section className="border-b bg-muted/30 py-8">
        <div className="container-page">
          <h1 className="text-3xl font-bold text-foreground">Blog</h1>
          <p className="mt-2 text-muted-foreground">
            Expert guides and insights for ERP selection and implementation
          </p>
        </div>
      </section>

      <div className="container-page py-8">
        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </form>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!selectedCategory ? "default" : "outline"}
              size="sm"
              onClick={() => updateCategory("")}
            >
              All
            </Button>
            {categories?.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => updateCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-8">
            <div className="h-64 animate-pulse rounded-lg bg-muted" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="space-y-12">
            {/* Featured Post */}
            {featuredPost && !selectedCategory && !searchQuery && (
              <div className="mb-12">
                <BlogPostCard post={featuredPost} />
              </div>
            )}

            {/* Posts Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(selectedCategory || searchQuery ? posts : otherPosts)?.map(
                (post) => (
                  <BlogPostCard key={post.id} post={post} />
                )
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">
              {searchQuery || selectedCategory
                ? "No articles found matching your criteria."
                : "No blog posts available yet."}
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}