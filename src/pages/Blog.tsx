import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { FeaturedBlogCard } from "@/components/blog/FeaturedBlogCard";
import { BlogGridCard } from "@/components/blog/BlogGridCard";
import { CategoryTagsSection } from "@/components/blog/CategoryTagsSection";
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

  // Separate featured and grid posts
  const featuredPost = posts?.[0];
  const gridPosts = posts?.slice(1, 4);
  const remainingPosts = posts?.slice(4);
  const isFiltered = !!selectedCategory || !!searchQuery;

  return (
    <PageLayout>
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 lg:py-20">
        <div className="container-page">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              ERP Insights & Resources
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Expert guides, selection strategies, and implementation insights to help you 
              navigate the complex world of enterprise software.
            </p>
          </div>
        </div>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent -z-10" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-accent/5 to-transparent -z-10" />
      </section>

      {/* Loading State */}
      {isLoading ? (
        <div className="container-page py-12">
          <div className="space-y-8">
            <div className="h-80 animate-pulse rounded-2xl bg-muted" />
            <div className="grid gap-6 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          </div>
        </div>
      ) : posts && posts.length > 0 ? (
        <>
          {/* Featured Post - Only show when not filtering */}
          {featuredPost && !isFiltered && (
            <section className="container-page py-12">
              <FeaturedBlogCard post={featuredPost} />
            </section>
          )}

          {/* 3-Column Grid */}
          {!isFiltered && gridPosts && gridPosts.length > 0 && (
            <section className="container-page pb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">Latest Articles</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {gridPosts.map((post) => (
                  <BlogGridCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Categories & Search Section */}
          <CategoryTagsSection
            categories={categories || []}
            selectedCategory={selectedCategory}
            onCategoryChange={updateCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearch}
          />

          {/* All/Filtered Posts */}
          <section className="container-page py-12">
            {isFiltered && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedCategory ? `${selectedCategory} Articles` : "Search Results"}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {posts.length} article{posts.length !== 1 ? "s" : ""} found
                </p>
              </div>
            )}

            {!isFiltered && remainingPosts && remainingPosts.length > 0 && (
              <h2 className="text-2xl font-bold text-foreground mb-8">More Articles</h2>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {(isFiltered ? posts : remainingPosts)?.map((post) => (
                <BlogGridCard key={post.id} post={post} />
              ))}
            </div>

            {/* Empty state for filtered results */}
            {isFiltered && posts.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-16 text-center">
                <p className="text-muted-foreground">
                  No articles found matching your criteria.
                </p>
              </div>
            )}
          </section>
        </>
      ) : (
        <div className="container-page py-16">
          <div className="rounded-2xl border border-dashed border-border p-16 text-center">
            <p className="text-muted-foreground text-lg">
              No blog posts available yet. Check back soon!
            </p>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
