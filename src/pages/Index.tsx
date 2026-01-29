import { Link } from "react-router-dom";
import { ArrowRight, Search, DollarSign, HelpCircle, Phone, Filter, Gift, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageLayout } from "@/components/layout/PageLayout";
import { VendorCard } from "@/components/vendors/VendorCard";
import { IndustryCard } from "@/components/industries/IndustryCard";
import { CompareFloatingBar } from "@/components/compare/CompareFloatingBar";
import { useVendors } from "@/hooks/useVendors";
import { useIndustries } from "@/hooks/useIndustries";
import { useState } from "react";

// Mock featured logos - in production these would come from a database
const featuredLogos = [
  { name: "Oracle NetSuite", logo: "ORACLE NETSUITE" },
  { name: "Sage Intacct", logo: "sage Intacct" },
  { name: "SAP Business One", logo: "SAP Business One" },
  { name: "Infor CloudSuite", logo: "Infor CloudSuite" },
  { name: "Odoo", logo: "odoo" },
  { name: "Microsoft Dynamics 365", logo: "Microsoft Dynamics 365" },
  { name: "Acumatica", logo: "Acumatica" },
  { name: "SAP ByDesign", logo: "SAP ByDesign" },
];

// Testimonials data
const testimonials = [
  {
    quote: "ERP Rundown helped us find the right ERP solutions for our business. This enabled us to start our project on time, saving us months of shortlisting and vendor interviews.",
    name: "Jessica Stevens",
    role: "Finance Director",
  },
  {
    quote: "We saved time and money by using ERP Rundown to short-list vendor options. They gave us free support on technical aspects of our requirements, reducing risk and saving time.",
    name: "Michael Derlacki",
    role: "IT Manager",
  },
  {
    quote: "Our ERP implementation was a massive success because of the expert team at ERP Rundown. I would recommend every organization evaluating ERP systems to start their journey here.",
    name: "Gareth Edwards",
    role: "Vice President",
  },
];

// Advisory board quotes
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

// Trusted companies
const trustedCompanies = ["BOBST", "UCC", "NUCOR", "Deloitte", "Boston Scientific", "BASF"];

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/vendors?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container-page">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left side - Text content */}
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-5xl">
                The Top ERP Systems:
                <br />
                <span className="text-primary">Search, Compare, Select</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Our ERP decision platform compares the top ERP systems for manufacturing businesses of all sizes. Browse our curated comparison of top-tier ERP systems or tap into personalized recommendations from our experts.
              </p>
              
              {/* CTA Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/compare">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Compare The Best ERP
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline">
                    Get Recommendations
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side - Comparison preview card */}
            <div className="rounded-xl border bg-card p-1 shadow-lg">
              <div className="rounded-lg bg-muted/30 p-4">
                {/* Browser dots */}
                <div className="mb-4 flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                
                {/* Comparison table preview */}
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {["NetSuite ERP", "SAP S/4HANA", "Cetec ERP", "Epicor Kinetic"].map((vendor, i) => (
                    <div key={i} className="rounded-lg bg-background p-3 text-center">
                      <div className="mb-2 text-[10px] font-medium text-primary uppercase tracking-wider">
                        {["ORACLE", "SAP", "CETEC", "EPICOR"][i]}
                      </div>
                      <div className="font-semibold text-foreground text-[11px]">{vendor}</div>
                      <div className="mt-3 space-y-1.5 text-[9px] text-muted-foreground">
                        <div className="flex justify-between">
                          <span>PRICE RANGE</span>
                          <span className="font-medium text-foreground">{["$10K-$100K", "N/A", "$3K-$40K", "$4K-$500K"][i]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>COST/USER</span>
                          <span className="font-medium text-foreground">{["$125/mo", "$2,000/mo", "$40/mo", "$125/mo"][i]}</span>
                        </div>
                        <div className="mt-2 flex justify-center gap-1">
                          <span className="rounded bg-accent/10 px-1.5 py-0.5 text-accent">Cloud</span>
                          <span className="rounded bg-muted px-1.5 py-0.5">On-Prem</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured In / Logo Bar */}
      <section className="border-y bg-muted/30 py-8">
        <div className="container-page">
          <div className="grid grid-cols-4 gap-6 md:grid-cols-8">
            {featuredLogos.map((item, i) => (
              <div key={i} className="flex items-center justify-center">
                <span className="text-xs font-semibold text-muted-foreground/70 md:text-sm">{item.logo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare ERP Systems Filter Bar */}
      <section className="section-padding">
        <div className="container-page">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Compare The Best ERP Systems
          </p>
          <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-4">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <div className="flex min-w-[140px] items-center gap-2 rounded-md border bg-background px-3 py-2">
                <span className="text-sm text-muted-foreground">Industry</span>
                <ArrowRight className="h-4 w-4 rotate-90 text-muted-foreground" />
              </div>
              <div className="flex min-w-[180px] items-center gap-2 rounded-md border bg-background px-3 py-2">
                <span className="text-sm text-muted-foreground">Manufacturing Mode</span>
                <ArrowRight className="h-4 w-4 rotate-90 text-muted-foreground" />
              </div>
              <div className="flex min-w-[140px] items-center gap-2 rounded-md border bg-background px-3 py-2">
                <span className="text-sm text-muted-foreground">Company Size</span>
                <ArrowRight className="h-4 w-4 rotate-90 text-muted-foreground" />
              </div>
              <div className="flex min-w-[120px] items-center gap-2 rounded-md border bg-background px-3 py-2">
                <span className="text-sm text-muted-foreground">Technology</span>
              </div>
              <button className="flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground hover:bg-muted">
                <Filter className="h-4 w-4" />
              </button>
            </div>
            <Button className="bg-accent hover:bg-accent/90">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Dual CTA Section - Demo & Pricing / Expert Advice */}
      <section className="section-padding bg-muted/30">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Get ERP Demos & Pricing */}
            <div className="rounded-xl border bg-card p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <DollarSign className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground">ERP System Demos and Pricing</h3>
              <p className="mt-3 text-muted-foreground">
                Get custom price quotes and demos from the top 10 ERP vendors in one simple step.
              </p>
              <Link to="/contact" className="mt-4 inline-flex items-center font-medium text-accent hover:underline">
                Get ERP Demos & Pricing
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Expert ERP Selection Advice */}
            <div className="rounded-xl border bg-card p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <HelpCircle className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Expert ERP Selection Advice</h3>
              <p className="mt-3 text-muted-foreground">
                Have Questions? Our ERP experts can help you find the top ERP solution for your needs and budget.
              </p>
              <Link to="/contact" className="mt-4 inline-flex items-center font-medium text-accent hover:underline">
                Get ERP Recommendations
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top ERP Vendors Section */}
      <section className="section-padding">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="mb-2 inline-block text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Decision Platform Featuring
              </span>
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                The Best ERP Systems and Vendors
              </h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                The ERP Rundown decision platform specializes in indexing and comparing the top ERP systems for manufacturing. We focus on showcasing the highest-rated ERP software systems from trusted and proven vendors.
              </p>
              <Link to="/compare" className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
                Compare the top 10 ERP systems side-by-side
              </Link>
            </div>
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
        </div>
      </section>

      {/* Ready to Find CTA Banner */}
      <section className="bg-primary py-8">
        <div className="container-page flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Ready to Find a Top ERP System?
            </h2>
            <p className="mt-1 text-white/80">
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

      {/* Industries Section */}
      <section className="section-padding">
        <div className="container-page">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Industries
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              Find the perfect ERP solution tailored to your specific industry needs
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
        </div>
      </section>

      {/* User Feedback / Testimonials Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-page">
          <h2 className="mb-8 text-2xl font-bold text-foreground md:text-3xl">
            Our User Feedback
          </h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="rounded-xl border bg-card p-6">
                <Quote className="mb-4 h-8 w-8 text-accent/30" />
                <p className="text-muted-foreground">"{testimonial.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <span className="text-sm font-medium text-muted-foreground">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-accent">{testimonial.role}</p>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Board / Trusted By Section */}
      <section className="section-padding">
        <div className="container-page">
          <div className="mb-8 text-center">
            <span className="mb-2 inline-block rounded-full bg-accent/10 px-4 py-1 text-sm font-medium text-accent">
              Trusted ERP Advisor To
            </span>
            <h2 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">
              Manufacturing Companies of All Sizes
            </h2>
          </div>

          {/* Company logos */}
          <div className="mb-12 flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {trustedCompanies.map((company, i) => (
              <span key={i} className="text-lg font-bold text-muted-foreground/60 md:text-xl">
                {company}
              </span>
            ))}
          </div>

          {/* Advisory quotes */}
          <div className="grid gap-6 md:grid-cols-3">
            {advisoryQuotes.map((item, i) => (
              <div key={i} className="border-l-4 border-accent/30 pl-4">
                <p className="text-muted-foreground">"{item.quote}"</p>
                <p className="mt-3 font-semibold uppercase tracking-wider text-foreground">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Start Your ERP Journey - 3 Steps */}
      <section className="section-padding bg-muted/30">
        <div className="container-page">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Start your ERP journey with 3 simple steps:
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Our experts can <span className="font-semibold text-foreground">save you time and money</span>, plus decrease ERP project risk with our simple, hassle-free 3 step plan.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent bg-accent/10">
                <Phone className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Get In Touch</h3>
              <p className="mt-2 text-muted-foreground">
                Contact us and our team will reach out to schedule a 15-minute call to learn more about your needs.
              </p>
              <Link to="/contact" className="mt-4 inline-flex items-center text-sm font-medium text-accent hover:underline">
                Contact Us
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent bg-accent/10">
                <Filter className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Discovery</h3>
              <p className="mt-2 text-muted-foreground">
                Our team will analyse over 100 ERP solutions to recommend an evaluation shortlist.
              </p>
              <Link to="/contact" className="mt-4 inline-flex items-center text-sm font-medium text-accent hover:underline">
                Contact Us
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent bg-accent/10">
                <Gift className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Free Advice & Resources</h3>
              <p className="mt-2 text-muted-foreground">
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

      <CompareFloatingBar />
    </PageLayout>
  );
}
