import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container-page py-12">
        {/* Disclosure Banner */}
        <div className="mb-8 rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
          We may earn from referrals or partnerships. This does not affect our editorial content.{" "}
          <Link to="/disclosure" className="font-medium text-accent hover:underline">
            Learn more
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">ER</span>
              </div>
              <span className="font-semibold text-foreground">ERPRundown</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Your trusted resource for ERP software discovery, comparison, and selection guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/vendors" className="text-muted-foreground hover:text-accent">
                  Browse Vendors
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-muted-foreground hover:text-accent">
                  Implementation Partners
                </Link>
              </li>
              <li>
                <Link to="/industries" className="text-muted-foreground hover:text-accent">
                  Industries
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-muted-foreground hover:text-accent">
                  Compare ERPs
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-accent">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-accent">
                  ERP Selection Guide
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-accent">
                  Implementation Tips
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-accent">
                  Pricing Insights
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-muted-foreground hover:text-accent">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-accent">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-accent">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/disclosure" className="text-muted-foreground hover:text-accent">
                  Disclosure
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-accent">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-accent">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} ERPRundown. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}