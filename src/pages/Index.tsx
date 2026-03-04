import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, DollarSign, HelpCircle, Phone, Filter, Gift, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { VendorCard } from "@/components/vendors/VendorCard";
import { IndustryCard } from "@/components/industries/IndustryCard";
import { CompareFloatingBar } from "@/components/compare/CompareFloatingBar";
import { VendorSearchAutocomplete } from "@/components/home/VendorSearchAutocomplete";
import { HeroLogoGrid } from "@/components/home/HeroLogoGrid";
import { HeroComparePreview } from "@/components/home/HeroComparePreview";
import { PartnerLogoTicker } from "@/components/home/PartnerLogoTicker";
import { useVendors } from "@/hooks/useVendors";
import { useIndustries } from "@/hooks/useIndustries";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Testimonials matching PDF
const testimonials = [
  {
    quote: "ERP Rundown helped us to find the right ERP solutions for our business. This enabled us to start our project on time, saving us months of shortlisting and vendor interviews and wasted internal expense.",
    name: "Jessica Stevens",
    role: "Finance Director",
  },
  {
    quote: "We saved time and money by using ERP Rundown to short-list vendor options. They gave us free support on technical aspects of our requirements, reducing risk and further saving time.",
    name: "Michael Derlacki",
    role: "IT Manager",
  },
  {
    quote: "Our ERP implementation was a massive success because of the expert team at ERP Rundown. I would recommend every organization evaluating ERP systems to start their journey with ERP Rundown.",
    name: "Gareth Edwards",
    role: "Vice President",
  },
];

// Advisory board quotes matching PDF
const advisoryQuotes = [
  {
    quote: "The industry comparisons were crucial to our ERP selection process. Choosing the wrong manufacturing ERP system is easily avoided with ERP Rundown.",
    name: "Eric Beavers",
  },
  {
    quote: "Gone are the days of endless spreadsheets. With our new ERP solution, we can focus on growth of the company.",
    name: "Steve Goodger",
  },
  {
    quote: "With ERP Rundown, we narrowed our search to the top ERP systems for our business. Finding the right ERP has improved our manufacturing company exponentially.",
    name: "Chris Bryda",
  },
];

// Trusted companies with real logos
const trustedCompanies = [
  { name: "BOBST", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/BOBST_logo.svg" },
  { name: "Deloitte", logo: "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg" },
  { name: "BASF", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d6/BASF-Logo_bw.svg" },
];

// Stats for enhanced hero
const stats = [
  { value: "100+", label: "ERP Systems Reviewed" },
  { value: "50K+", label: "Businesses Helped" },
  { value: "15+", label: "Years Experience" },
  { value: "98%", label: "Client Satisfaction" },
];

// Filter options
const companySizeOptions = ["Small", "Mid-market", "Enterprise"];
const deploymentOptions = ["SaaS", "On-Prem", "Hybrid"];

export default function Index() {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedDeployment, setSelectedDeployment] = useState<string | null>(null);
  const [filtersChanged, setFiltersChanged] = useState(false);

  const { data: featuredVendors, isLoading: vendorsLoading } = useVendors({
    featured: true,
    limit: 6,
  });

  const { data: allIndustries } = useIndustries({});

  const { data: featuredIndustries, isLoading: industriesLoading } = useIndustries({
    featured: true,
    limit: 8,
  });

  // Animate filter changes
  useEffect(() => {
    if (selectedIndustry || selectedSize || selectedDeployment) {
      setFiltersChanged(true);
      const timer = setTimeout(() => setFiltersChanged(false), 300);
      return () => clearTimeout(timer);
    }
  }, [selectedIndustry, selectedSize, selectedDeployment]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedIndustry) params.set("industry", selectedIndustry);
    if (selectedSize) params.set("size", selectedSize);
    if (selectedDeployment) params.set("deployment", selectedDeployment);
    navigate(`/vendors?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedIndustry(null);
    setSelectedSize(null);
    setSelectedDeployment(null);
  };

  const activeFiltersCount = [selectedIndustry, selectedSize, selectedDeployment].filter(Boolean).length;

  return (
    <PageLayout>
      {/* Hero Section - Matching PDF Layout */}
      <section className="bg-background py-12 md:py-20 lg:py-24">
        <div className="container-page">
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left side - Text content */}
            <div className="max-w-xl">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-5xl">
                The Top ERP Systems:
                <br />
                <span className="text-primary">Search, Compare, Select</span>
              </h1>
              <p className="mt-4 text-base text-muted-foreground sm:mt-6 sm:text-lg">
                Our ERP decision platform compares the top ERP systems for manufacturing businesses of all sizes. Browse our curated comparison of top-tier ERP systems or tap into personalized recommendations from our experts.
              </p>
              
              {/* Search Autocomplete */}
              <div className="mt-6 sm:mt-8">
                <VendorSearchAutocomplete />
              </div>
              
              {/* CTA Buttons */}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link to="/compare">
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90 sm:w-auto">
                    Compare The Best ERP
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Get Recommendations
                  </Button>
                </Link>
              </div>

              {/* Compare Preview - shows when vendors are selected */}
              <div className="mt-6">
                <HeroComparePreview />
              </div>

              {/* Stats row - Enhancement */}
              <div className="mt-8 grid grid-cols-2 gap-4 border-t pt-8 sm:grid-cols-4">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center sm:text-left">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Logo grid with hover popups */}
            <HeroLogoGrid />
          </div>
        </div>
      </section>

      {/* Featured ERP Partners - Ticker */}
      <PartnerLogoTicker />

      {/* Compare ERP Systems Filter Bar - Functional with animations */}
      <section className="py-8 md:py-12">
        <div className="container-page">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Compare The Best ERP Systems
            </p>
            {activeFiltersCount > 0 && (
              <div className="animate-fade-in flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {activeFiltersCount}
                </span>
                <span className="text-xs text-muted-foreground">filters active</span>
              </div>
            )}
          </div>
          <div className={cn(
            "flex flex-col gap-3 rounded-lg border bg-card p-3 transition-all duration-300 sm:flex-row sm:flex-wrap sm:items-center sm:p-4",
            filtersChanged && "ring-2 ring-accent/20"
          )}>
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              {/* Industry Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "flex min-w-[140px] items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm transition-all duration-200 sm:min-w-[160px]",
                    selectedIndustry 
                      ? "border-accent/50 bg-accent/5 text-foreground" 
                      : "bg-background text-muted-foreground hover:bg-muted"
                  )}>
                    <span className={cn(
                      "transition-colors duration-200",
                      selectedIndustry ? "text-foreground font-medium" : "text-muted-foreground"
                    )}>
                      {allIndustries?.find(i => i.slug === selectedIndustry)?.name || "Industry"}
                    </span>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      selectedIndustry && "text-accent"
                    )} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[220px] animate-scale-in bg-background" align="start">
                  <DropdownMenuItem 
                    onClick={() => setSelectedIndustry(null)}
                    className="text-muted-foreground"
                  >
                    All Industries
                  </DropdownMenuItem>
                  {allIndustries?.map((industry) => (
                    <DropdownMenuItem 
                      key={industry.id} 
                      onClick={() => setSelectedIndustry(industry.slug)}
                      className={cn(
                        "transition-colors",
                        selectedIndustry === industry.slug && "bg-accent/10 text-accent font-medium"
                      )}
                    >
                      {industry.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Company Size Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "flex min-w-[140px] items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm transition-all duration-200 sm:min-w-[160px]",
                    selectedSize 
                      ? "border-accent/50 bg-accent/5 text-foreground" 
                      : "bg-background text-muted-foreground hover:bg-muted"
                  )}>
                    <span className={cn(
                      "transition-colors duration-200",
                      selectedSize ? "text-foreground font-medium" : "text-muted-foreground"
                    )}>
                      {selectedSize || "Company Size"}
                    </span>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      selectedSize && "text-accent"
                    )} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[180px] animate-scale-in bg-background" align="start">
                  <DropdownMenuItem 
                    onClick={() => setSelectedSize(null)}
                    className="text-muted-foreground"
                  >
                    All Sizes
                  </DropdownMenuItem>
                  {companySizeOptions.map((size) => (
                    <DropdownMenuItem 
                      key={size} 
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "transition-colors",
                        selectedSize === size && "bg-accent/10 text-accent font-medium"
                      )}
                    >
                      {size}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Deployment Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={cn(
                    "flex min-w-[140px] items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm transition-all duration-200 sm:min-w-[160px]",
                    selectedDeployment 
                      ? "border-accent/50 bg-accent/5 text-foreground" 
                      : "bg-background text-muted-foreground hover:bg-muted"
                  )}>
                    <span className={cn(
                      "transition-colors duration-200",
                      selectedDeployment ? "text-foreground font-medium" : "text-muted-foreground"
                    )}>
                      {selectedDeployment || "Deployment"}
                    </span>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      selectedDeployment && "text-accent"
                    )} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[160px] animate-scale-in bg-background" align="start">
                  <DropdownMenuItem 
                    onClick={() => setSelectedDeployment(null)}
                    className="text-muted-foreground"
                  >
                    All Types
                  </DropdownMenuItem>
                  {deploymentOptions.map((type) => (
                    <DropdownMenuItem 
                      key={type} 
                      onClick={() => setSelectedDeployment(type)}
                      className={cn(
                        "transition-colors",
                        selectedDeployment === type && "bg-accent/10 text-accent font-medium"
                      )}
                    >
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clear filters button with animation */}
              {activeFiltersCount > 0 && (
                <button 
                  onClick={clearFilters}
                  className="flex h-10 animate-fade-in items-center justify-center gap-1.5 rounded-md border border-destructive/30 bg-destructive/5 px-3 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Clear All
                </button>
              )}
            </div>
            <Button 
              onClick={handleSearch} 
              className={cn(
                "w-full bg-accent transition-all duration-200 hover:bg-accent/90 sm:w-auto",
                activeFiltersCount > 0 && "animate-pulse"
              )}
            >
              <Search className="mr-2 h-4 w-4" />
              Search {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
          </div>
        </div>
      </section>

      {/* Dual CTA Section - Demo & Pricing / Expert Advice - Matching PDF */}
      <section className="bg-muted/30 py-8 md:py-12">
        <div className="container-page">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {/* Get ERP Demos & Pricing */}
            <div className="rounded-xl border bg-card p-6 text-center sm:p-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 sm:h-16 sm:w-16">
                <DollarSign className="h-7 w-7 text-accent sm:h-8 sm:w-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground sm:text-xl">ERP System Demos and Pricing</h3>
              <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
                Get custom price quotes and demos from the top 10 ERP vendors in one simple step.
              </p>
              <Link to="/contact" className="mt-4 inline-flex items-center text-sm font-medium text-accent hover:underline sm:text-base">
                Get ERP Demos & Pricing
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Expert ERP Selection Advice */}
            <div className="rounded-xl border bg-card p-6 text-center sm:p-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 sm:h-16 sm:w-16">
                <HelpCircle className="h-7 w-7 text-accent sm:h-8 sm:w-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground sm:text-xl">Expert ERP Selection Advice</h3>
              <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
                Have Questions? Our ERP experts can help you find the top ERP solution for your needs and budget.
              </p>
              <Link to="/contact" className="mt-4 inline-flex items-center text-sm font-medium text-accent hover:underline sm:text-base">
                Get ERP Recommendations
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top ERP Vendors Section - Matching PDF */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container-page">
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="mb-2 inline-block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Decision Platform Featuring
              </span>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
                The Best ERP Systems and Vendors
              </h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                The ERP Rundown decision platform specializes in indexing and comparing the top ERP systems for manufacturing. We focus on showcasing the highest-rated ERP software systems from trusted and proven vendors.
              </p>
              <Link to="/compare" className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
                Compare the top 10 ERP systems side-by-side →
              </Link>
            </div>
            <Link to="/vendors" className="shrink-0">
              <Button variant="outline">
                View All Vendors
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {vendorsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : featuredVendors && featuredVendors.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {featuredVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center sm:p-12">
              <p className="text-muted-foreground">No featured vendors yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Ready to Find CTA Banner - Matching PDF */}
      <section className="bg-primary py-6 sm:py-8">
        <div className="container-page flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">
              Ready to Find a Top ERP System?
            </h2>
            <p className="mt-1 text-sm text-white/80 sm:text-base">
              Our "Best Fit" comparison tool finds the top ERP Systems for your business
            </p>
          </div>
          <Link to="/compare">
            <Button size="lg" variant="secondary" className="whitespace-nowrap">
              Compare Top ERP
            </Button>
          </Link>
        </div>
      </section>

      {/* Industries Section - Matching PDF */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container-page">
          <div className="mb-6 text-center sm:mb-8">
            <h2 className="text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
              Industries
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Find the perfect ERP solution tailored to your specific industry needs
            </p>
          </div>

          {industriesLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-lg bg-muted sm:h-32" />
              ))}
            </div>
          ) : featuredIndustries && featuredIndustries.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {featuredIndustries.map((industry) => (
                <IndustryCard key={industry.id} industry={industry} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center sm:p-12">
              <p className="text-muted-foreground">No industries yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* User Feedback / Testimonials Section - Matching PDF */}
      <section className="bg-muted/30 py-8 md:py-12 lg:py-16">
        <div className="container-page">
          <h2 className="mb-6 text-xl font-bold text-foreground sm:mb-8 sm:text-2xl md:text-3xl">
            Our User Feedback
          </h2>
          
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="rounded-xl border bg-card p-5 sm:p-6">
                <div className="mb-3 text-3xl font-serif text-accent/40 sm:mb-4 sm:text-4xl">"</div>
                <p className="text-sm text-muted-foreground sm:text-base">{testimonial.quote}</p>
                <div className="mt-5 flex items-center gap-3 sm:mt-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted sm:h-12 sm:w-12">
                    <span className="text-sm font-medium text-muted-foreground sm:text-base">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-accent sm:text-sm">{testimonial.role}</p>
                    <p className="text-sm font-semibold text-foreground sm:text-base">{testimonial.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription CTA */}
      <section className="py-8 md:py-12">
        <div className="container-page">
          <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 sm:p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">
                Stay Ahead with ERP Insights
              </h2>
              <p className="mt-3 text-sm text-white/80 sm:text-base">
                Get the latest ERP trends, vendor comparisons, and implementation tips delivered to your inbox weekly.
              </p>
              <form className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="h-11 flex-1 rounded-lg border-0 bg-white/10 px-4 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 sm:max-w-xs"
                />
                <Button 
                  type="submit" 
                  variant="secondary" 
                  className="h-11 whitespace-nowrap"
                >
                  Subscribe Now
                </Button>
              </form>
              <p className="mt-3 text-xs text-white/60">
                Join 5,000+ manufacturing professionals. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advisory Board / Trusted By Section - Matching PDF */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="container-page">
          <div className="mb-6 text-center sm:mb-8">
            <span className="mb-2 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent sm:px-4 sm:text-sm">
              Trusted ERP Advisor To
            </span>
            <h2 className="mt-3 text-xl font-bold text-foreground sm:mt-4 sm:text-2xl md:text-3xl">
              Manufacturing Companies of All Sizes
            </h2>
          </div>

          {/* Company logos */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-6 sm:mb-12 sm:gap-10 md:gap-14">
            {trustedCompanies.map((company, i) => (
              <div key={i} className="flex flex-col items-center gap-2 grayscale opacity-60 transition-all hover:grayscale-0 hover:opacity-100">
                <img 
                  src={company.logo} 
                  alt={company.name} 
                  className="h-8 w-auto max-w-[100px] object-contain sm:h-10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-xs font-medium text-muted-foreground">{company.name}</span>
              </div>
            ))}
          </div>

          {/* Advisory quotes */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {advisoryQuotes.map((item, i) => (
              <div key={i} className="border-l-4 border-accent/30 bg-muted/30 p-4 sm:pl-6">
                <p className="text-sm text-muted-foreground sm:text-base">{item.quote}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-foreground sm:text-sm">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Start Your ERP Journey - 3 Steps - Matching PDF */}
      <section className="bg-muted/30 py-8 md:py-12 lg:py-16">
        <div className="container-page">
          <div className="mb-8 text-center sm:mb-12">
            <h2 className="text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
              Start your ERP journey with 3 simple steps:
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Our experts can <span className="font-semibold text-foreground">save you time and money</span>, plus decrease ERP project risk with our simple, hassle-free 3 step plan.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent bg-accent/10 sm:h-14 sm:w-14">
                <Phone className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-base font-bold text-foreground sm:text-lg">Get In Touch</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Contact us and our team will reach out to schedule a 15-minute call to learn more about your needs.
              </p>
              <Link to="/contact" className="mt-4 inline-flex items-center text-sm font-medium text-accent hover:underline">
                Contact Us
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent bg-accent/10 sm:h-14 sm:w-14">
                <Filter className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-base font-bold text-foreground sm:text-lg">Discovery</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Our team will analyse over 100 ERP solutions to recommend an evaluation shortlist.
              </p>
              <Link to="/contact" className="mt-4 inline-flex items-center text-sm font-medium text-accent hover:underline">
                Contact Us
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent bg-accent/10 sm:h-14 sm:w-14">
                <Gift className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
              </div>
              <h3 className="text-base font-bold text-foreground sm:text-lg">Free Advice & Resources</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We provide every user with a free resource pack and complimentary advice to ensure success.
              </p>
              <Link to="/contact" className="mt-4 inline-flex items-center text-sm font-medium text-accent hover:underline">
                Contact Us
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Enhancement over PDF */}
      <section className="bg-primary py-10 sm:py-12 md:py-16">
        <div className="container-page text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Ready to Transform Your Business?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/80 sm:text-base">
            Join thousands of manufacturing companies who found their perfect ERP match through ERP Rundown.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row sm:gap-4">
            <Link to="/compare">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Compare ERP Systems
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 sm:w-auto">
                Get Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <CompareFloatingBar />
    </PageLayout>
  );
}
