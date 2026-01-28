import { PageLayout } from "@/components/layout/PageLayout";

export default function TermsPage() {
  return (
    <PageLayout>
      <div className="container-page py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold text-foreground">Terms of Service</h1>

          <div className="prose max-w-none prose-headings:text-foreground prose-p:text-muted-foreground">
            <p className="text-sm text-muted-foreground">
              Last updated: January 2025
            </p>

            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using ERPRundown (the "Website"), you accept and 
              agree to be bound by these Terms of Service. If you do not agree 
              to these terms, please do not use our Website.
            </p>

            <h2>Use of the Website</h2>
            <p>
              You may use our Website for lawful purposes only. You agree not to:
            </p>
            <ul>
              <li>Use the Website in any way that violates applicable laws</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Website's operation</li>
              <li>Collect user information without consent</li>
              <li>Use automated systems to access the Website without permission</li>
            </ul>

            <h2>Content and Information</h2>
            <p>
              The information on ERPRundown is provided for general informational 
              purposes only. While we strive for accuracy, we make no warranties 
              about the completeness, reliability, or accuracy of this information.
            </p>
            <p>
              ERP vendor information, pricing, and features may change. We 
              recommend verifying details directly with vendors before making 
              purchase decisions.
            </p>

            <h2>Lead Generation</h2>
            <p>
              When you submit your information through our forms, you consent to:
            </p>
            <ul>
              <li>Being contacted by the specified ERP vendor(s)</li>
              <li>Receiving relevant communications from ERPRundown</li>
            </ul>
            <p>
              You can opt out of communications at any time.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              All content on ERPRundown, including text, graphics, logos, and 
              software, is the property of ERPRundown or its content suppliers 
              and is protected by copyright laws.
            </p>

            <h2>Third-Party Links</h2>
            <p>
              Our Website may contain links to third-party websites. We are not 
              responsible for the content or practices of these external sites.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              ERPRundown shall not be liable for any indirect, incidental, 
              special, or consequential damages arising from your use of the 
              Website or reliance on information provided.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Continued 
              use of the Website after changes constitutes acceptance of the 
              new terms.
            </p>

            <h2>Contact</h2>
            <p>
              For questions about these Terms of Service, please{" "}
              <a href="/contact">contact us</a>.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}