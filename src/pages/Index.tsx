import { Link } from "react-router-dom";
import { ArrowRight, Search, BarChart2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageLayout } from "@/components/layout/PageLayout";
import { VendorCard } from "@/components/vendors/VendorCard";
import { IndustryCard } from "@/components/industries/IndustryCard";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { CaseStudyCard } from "@/components/case-studies/CaseStudyCard";
import { CompareFloatingBar } from "@/components/compare/CompareFloatingBar";
import { useVendors } from "@/hooks/useVendors";
import { useIndustries } from "@/hooks/useIndustries";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useCaseStudies } from "@/hooks/useCaseStudies";
import { useState } from "react";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: featuredVendors, isLoading: vendorsLoading } = useVendors({
    featured: true,
    limit: 6,
  });

  const { data: featuredIndustries, isLoading: industriesLoading } = useIndustries({
    featured: true,
    limit: 8,
  });

  const { data: latestPosts, isLoading: postsLoading } = useBlogPosts({
    limit: 3,
  });

  const { data: latestCaseStudies, isLoading: caseStudiesLoading } = useCaseStudies({
    limit: 3,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/vendors?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="gradient-navy py-20 md:py-28">
        <div className="container-page text-center">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Find the right ERP—faster.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            Browse ERP vendors, compare solutions, and shortlist software for your industry.
          </p>
          
          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-xl items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search ERP vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12 text-base"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 bg-accent hover:bg-accent/90">
              Search
            </Button>
          </form>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/vendors">
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                Browse Vendors
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/compare">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <BarChart2 className="mr-2 h-4 w-4" />
                Compare ERPs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="section-padding">
        <div className="container-page">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Featured ERP Vendors
              </h2>
              <p className="mt-2 text-muted-foreground">
                Top-rated ERP solutions trusted by businesses worldwide
              </p>
            </div>
            <Link to="/vendors" className="hidden sm:block">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {vendorsLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : featuredVendors && featuredVendors.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-muted-foreground">No featured vendors yet.</p>
            </div>
          )}

          <Link to="/vendors" className="mt-6 block sm:hidden">
            <Button variant="outline" className="w-full">
              View All Vendors
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Industries */}
      <section className="section-padding bg-muted/30">
        <div className="container-page">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              ERP Solutions by Industry
            </h2>
            <p className="mt-2 text-muted-foreground">
              Find the perfect ERP for your specific industry needs
            </p>
          </div>

          {industriesLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : featuredIndustries && featuredIndustries.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredIndustries.map((industry) => (
                <IndustryCard key={industry.id} industry={industry} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-muted-foreground">No industries yet.</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/industries">
              <Button variant="outline">
                View All Industries
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="section-padding">
        <div className="container-page">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Latest Insights
              </h2>
              <p className="mt-2 text-muted-foreground">
                Expert guides and tips for ERP selection and implementation
              </p>
            </div>
            <Link to="/blog" className="hidden sm:block">
              <Button variant="outline">
                Read More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {postsLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : latestPosts && latestPosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-muted-foreground">No blog posts yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Case Studies */}
      <section className="section-padding bg-muted/30">
        <div className="container-page">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Success Stories
              </h2>
              <p className="mt-2 text-muted-foreground">
                Real-world ERP implementations and their results
              </p>
            </div>
            <Link to="/case-studies" className="hidden sm:block">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {caseStudiesLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : latestCaseStudies && latestCaseStudies.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestCaseStudies.map((cs) => (
                <CaseStudyCard key={cs.id} caseStudy={cs} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <p className="text-muted-foreground">No case studies yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="section-padding">
        <div className="container-page">
          <div className="mx-auto max-w-3xl rounded-2xl bg-muted/50 p-8 text-center md:p-12">
            <Shield className="mx-auto h-12 w-12 text-accent" />
            <h2 className="mt-4 text-2xl font-bold text-foreground">
              Our Commitment to You
            </h2>
            <p className="mt-4 text-muted-foreground">
              We conduct independent research and analysis to help you make informed ERP decisions. 
              Our recommendations are based on thorough evaluations, not advertising spend.
            </p>
            <Link to="/disclosure" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
              Read our disclosure policy →
            </Link>
          </div>
        </div>
      </section>

      <CompareFloatingBar />
    </PageLayout>
  );
}