import { PageLayout } from "@/components/layout/PageLayout";
import { Shield, Users, Target, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-page text-center">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            About ERPRundown
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Your trusted resource for ERP software discovery, comparison, and selection guidance.
          </p>
        </div>
      </section>

      <div className="container-page py-12">
        {/* Mission */}
        <section className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We help businesses navigate the complex world of ERP software by providing 
            unbiased, comprehensive information to make informed decisions. Our goal is 
            to simplify the ERP selection process and connect businesses with the right 
            solutions for their unique needs.
          </p>
        </section>

        {/* Values */}
        <section className="mt-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
            What We Stand For
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Independence</h3>
              <p className="text-sm text-muted-foreground">
                Our editorial content is never influenced by advertising or partnerships.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Accuracy</h3>
              <p className="text-sm text-muted-foreground">
                We rigorously research and verify all information before publishing.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">User-First</h3>
              <p className="text-sm text-muted-foreground">
                Every decision we make is guided by what's best for our readers.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Quality</h3>
              <p className="text-sm text-muted-foreground">
                We maintain high standards for all content and recommendations.
              </p>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="mt-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              Our Research Methodology
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                At ERPRundown, we take a systematic approach to evaluating ERP software. 
                Our research process includes:
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Direct product demos and hands-on testing</li>
                <li>Interviews with industry experts and practitioners</li>
                <li>Analysis of user reviews and customer feedback</li>
                <li>Evaluation of pricing, implementation, and support</li>
                <li>Regular updates to reflect product changes</li>
              </ul>
              <p>
                We believe in transparency and are committed to providing you with the 
                information you need to make the right choice for your business.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}