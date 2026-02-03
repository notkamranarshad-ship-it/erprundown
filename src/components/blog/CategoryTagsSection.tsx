import { Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CategoryTagsSectionProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

// Default categories to show when DB categories are empty
const DEFAULT_CATEGORIES = [
  "Selection Guide",
  "Implementation",
  "Industry Insights",
  "Best Practices",
  "Comparison",
  "Technology Trends",
  "ROI & Analytics",
  "Integration",
];

export function CategoryTagsSection({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}: CategoryTagsSectionProps) {
  const displayCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <section className="py-12 bg-muted/30 border-y border-border/50">
      <div className="container-page">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Categories */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Browse by Topic</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedCategory ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange("")}
                className="rounded-full"
              >
                All Articles
              </Button>
              {displayCategories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => onCategoryChange(cat)}
                  className="rounded-full"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="lg:w-80">
            <form onSubmit={onSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 rounded-full bg-background border-border/50"
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
