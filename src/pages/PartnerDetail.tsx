import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, ExternalLink, MapPin, Calendar, Users, 
  Globe, Award, Building, Briefcase, CheckCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/layout/PageLayout";
import { LeadForm } from "@/components/forms/LeadForm";
import { usePartner, usePartners } from "@/hooks/usePartners";
import { PartnerCard } from "@/components/partners/PartnerCard";

export default function PartnerDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: partner, isLoading, error } = usePartner(slug || "");
  const { data: allPartners } = usePartners();

  // Get similar partners
  const similarPartners = allPartners
    ?.filter(
      (p) =>
        p.id !== partner?.id &&
        p.erp_specializations?.some((erp) =>
          partner?.erp_specializations?.includes(erp)
        )
    )
    .slice(0, 3);

  const yearsInBusiness = partner?.year_founded 
    ? new Date().getFullYear() - partner.year_founded 
    : null;

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container-page py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-32 rounded bg-muted" />
            <div className="h-64 rounded-lg bg-muted" />
            <div className="h-96 rounded-lg bg-muted" />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !partner) {
    return (
      <PageLayout>
        <div className="container-page py-12 text-center">
          <h1 className="text-2xl font-bold">Partner not found</h1>
          <p className="mt-2 text-muted-foreground">
            The partner you're looking for doesn't exist.
          </p>
          <Link to="/partners">
            <Button className="mt-4">Browse Partners</Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container-page py-4">
          <Link
            to="/partners"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Partners
          </Link>
        </div>
      </div>

      <div className="container-page py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-muted">
                  {partner.logo_url ? (
                    <img
                      src={partner.logo_url}
                      alt={`${partner.name} logo`}
                      className="h-14 w-14 object-contain"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-muted-foreground">
                      {partner.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                      {partner.name}
                    </h1>
                    {partner.featured && (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        <Award className="h-3 w-3 mr-1" />
                        Featured Partner
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    {partner.short_description}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <LeadForm
                  triggerLabel="Contact Partner"
                />
                {partner.website_url && (
                  <a href={partner.website_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Website
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {partner.headquarters && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-wide">Headquarters</span>
                    </div>
                    <p className="mt-1 font-semibold">{partner.headquarters}</p>
                  </CardContent>
                </Card>
              )}
              {yearsInBusiness && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-wide">Founded</span>
                    </div>
                    <p className="mt-1 font-semibold">{partner.year_founded} ({yearsInBusiness}+ years)</p>
                  </CardContent>
                </Card>
              )}
              {partner.employees_count && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-wide">Employees</span>
                    </div>
                    <p className="mt-1 font-semibold">{partner.employees_count}</p>
                  </CardContent>
                </Card>
              )}
              {partner.regions_served && partner.regions_served.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span className="text-xs uppercase tracking-wide">Regions</span>
                    </div>
                    <p className="mt-1 font-semibold">{partner.regions_served.length} regions</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Overview */}
            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Overview</h2>
              <div className="prose max-w-none text-muted-foreground">
                <p>{partner.long_description || partner.short_description}</p>
              </div>
            </section>

            {/* ERP Specializations */}
            {partner.erp_specializations && partner.erp_specializations.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  ERP Specializations
                </h2>
                <div className="flex flex-wrap gap-2">
                  {partner.erp_specializations.map((erp) => (
                    <Badge key={erp} variant="secondary" className="text-sm py-1.5 px-3">
                      {erp}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Services Offered */}
            {partner.services_offered && partner.services_offered.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Services Offered
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {partner.services_offered.map((service) => (
                    <div key={service} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Industries Served */}
            {partner.industries_served && partner.industries_served.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold">Industries Served</h2>
                <div className="flex flex-wrap gap-2">
                  {partner.industries_served.map((ind) => (
                    <Badge key={ind} variant="outline">
                      {ind}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {partner.certifications && partner.certifications.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Certifications & Partnerships
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {partner.certifications.map((cert) => (
                    <Card key={cert}>
                      <CardContent className="flex items-center gap-3 p-4">
                        <Award className="h-5 w-5 text-amber-500" />
                        <span className="text-sm font-medium">{cert}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Notable Clients */}
            {partner.notable_clients && partner.notable_clients.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold">Notable Clients</h2>
                <div className="flex flex-wrap gap-3">
                  {partner.notable_clients.map((client) => (
                    <Badge key={client} variant="outline" className="py-2 px-4">
                      {client}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Regions */}
            {partner.regions_served && partner.regions_served.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Regions Served
                </h2>
                <div className="flex flex-wrap gap-2">
                  {partner.regions_served.map((region) => (
                    <Badge key={region} className="bg-primary/10 text-primary border-primary/20">
                      {region}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* CTA Card */}
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-semibold">
                    Work with {partner.name}
                  </h3>
                  <p className="mb-4 text-sm text-primary-foreground/80">
                    Get in touch to discuss your ERP implementation project.
                  </p>
                  <LeadForm
                    triggerLabel="Contact Partner"
                    triggerVariant="secondary"
                    title={`Contact ${partner.name}`}
                    description="Fill out the form and we'll connect you with this partner."
                  />
                </CardContent>
              </Card>

              {/* Quick Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {partner.headquarters && (
                    <div>
                      <span className="text-sm text-muted-foreground">Headquarters</span>
                      <p className="font-medium">{partner.headquarters}</p>
                    </div>
                  )}
                  {partner.year_founded && (
                    <>
                      <Separator />
                      <div>
                        <span className="text-sm text-muted-foreground">Founded</span>
                        <p className="font-medium">{partner.year_founded}</p>
                      </div>
                    </>
                  )}
                  {partner.employees_count && (
                    <>
                      <Separator />
                      <div>
                        <span className="text-sm text-muted-foreground">Company Size</span>
                        <p className="font-medium">{partner.employees_count} employees</p>
                      </div>
                    </>
                  )}
                  {partner.website_url && (
                    <>
                      <Separator />
                      <a
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-accent hover:underline"
                      >
                        Visit Website
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Similar Partners */}
        {similarPartners && similarPartners.length > 0 && (
          <section className="mt-12 border-t pt-12">
            <h2 className="mb-6 text-xl font-semibold">Similar Partners</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similarPartners.map((p) => (
                <PartnerCard key={p.id} partner={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
}
