import { PageLayout } from "@/components/layout/PageLayout";

export default function PrivacyPage() {
  return (
    <PageLayout>
      <div className="container-page py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold text-foreground">Privacy Policy</h1>

          <div className="prose max-w-none prose-headings:text-foreground prose-p:text-muted-foreground">
            <p className="text-sm text-muted-foreground">
              Last updated: January 2025
            </p>

            <h2>Introduction</h2>
            <p>
              ERPRundown ("we," "our," or "us") respects your privacy and is 
              committed to protecting your personal data. This privacy policy 
              explains how we collect, use, and share information about you when 
              you use our website.
            </p>

            <h2>Information We Collect</h2>
            <p>We collect information in several ways:</p>
            
            <h3>Information You Provide</h3>
            <ul>
              <li>Contact information (name, email, company) when you submit forms</li>
              <li>Message content when you contact us</li>
              <li>Information about your ERP needs and preferences</li>
            </ul>

            <h3>Information Collected Automatically</h3>
            <ul>
              <li>Usage data (pages visited, time spent, interactions)</li>
              <li>Device information (browser type, operating system)</li>
              <li>IP address and approximate location</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Respond to your inquiries and requests</li>
              <li>Connect you with ERP vendors you're interested in</li>
              <li>Improve our website and services</li>
              <li>Send you relevant content and updates (with your consent)</li>
              <li>Analyze usage patterns and trends</li>
            </ul>

            <h2>Information Sharing</h2>
            <p>
              When you request information about specific ERP vendors, we share 
              your contact information with those vendors so they can respond to 
              your inquiry. We do not sell your personal information to third 
              parties.
            </p>

            <h2>Cookies</h2>
            <p>
              We use cookies and similar technologies to enhance your experience, 
              analyze usage, and remember your preferences. You can control cookie 
              settings through your browser.
            </p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt out of marketing communications</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to 
              protect your personal data against unauthorized access, alteration, 
              or destruction.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this privacy policy or your personal 
              data, please <a href="/contact">contact us</a>.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}