import { PageLayout } from "@/components/layout/PageLayout";

export default function DisclosurePage() {
  return (
    <PageLayout>
      <div className="container-page py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold text-foreground">Disclosure</h1>

          <div className="prose max-w-none prose-headings:text-foreground prose-p:text-muted-foreground">
            <p className="text-lg">
              At ERPRundown, we believe in complete transparency about how we operate 
              and how we may earn revenue.
            </p>

            <h2>How We Make Money</h2>
            <p>
              ERPRundown earns revenue in several ways:
            </p>
            <ul>
              <li>
                <strong>Lead Referrals:</strong> When you request a demo or pricing 
                information through our site, we may receive a referral fee from 
                the ERP vendor.
              </li>
              <li>
                <strong>Affiliate Links:</strong> Some links on our site may be 
                affiliate links. If you click through and make a purchase, we may 
                earn a commission.
              </li>
              <li>
                <strong>Sponsored Content:</strong> Some vendors pay for additional 
                visibility on our platform. Sponsored listings are always clearly 
                labeled as such.
              </li>
            </ul>

            <h2>Editorial Independence</h2>
            <p>
              <strong>Our editorial content is never influenced by our revenue 
              relationships.</strong> We maintain strict separation between our 
              editorial and business teams. Vendors cannot pay for better reviews 
              or higher rankings in our comparison content.
            </p>
            <p>
              Our reviews, comparisons, and recommendations are based on:
            </p>
            <ul>
              <li>Thorough product research and testing</li>
              <li>User reviews and feedback</li>
              <li>Industry expert opinions</li>
              <li>Objective evaluation criteria</li>
            </ul>

            <h2>Sponsored Labels</h2>
            <p>
              When a vendor has paid for additional visibility or placement, we 
              clearly label this content as "Sponsored." This transparency ensures 
              you always know when commercial relationships may be involved.
            </p>

            <h2>Our Commitment</h2>
            <p>
              We are committed to:
            </p>
            <ul>
              <li>Providing accurate, unbiased information</li>
              <li>Clearly disclosing all commercial relationships</li>
              <li>Putting our readers' interests first</li>
              <li>Maintaining editorial integrity in all our content</li>
            </ul>

            <h2>Questions?</h2>
            <p>
              If you have any questions about our disclosure policy or how we 
              operate, please don't hesitate to <a href="/contact">contact us</a>.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}