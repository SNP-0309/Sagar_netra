import { Link } from "react-router-dom";

const FOOTER_LINKS = {
  product: [
    { label: "Analyze sonar", href: "/analyze" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Why SagarNetra", href: "/#usps" },
    { label: "Use Cases", href: "/#use-cases" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  contact: [
    { label: "sagarnetra.in", href: "mailto:hello@sagarnetra.in" },
    { label: "GitHub", href: "https://github.com/sagarnetra-ai", external: true },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-[rgba(14,255,236,0.08)] bg-[#060E1A]"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container-main py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14FFEC] rounded-md"
            >
              <SonarLogoSmall />
              <span className="font-semibold text-[#E8F4F8]">
                SagarNetra<span className="text-[#14FFEC]"> AI</span>
              </span>
            </Link>
            <p className="text-[#5E849E] text-sm leading-relaxed max-w-xs">
              Sonar-based marine debris and anomaly detection. Built for
              oceanographers, coast guard, and port operations teams.
            </p>
            <p className="mt-4 text-xs text-[#3A5A6E]">
              Developed for Smart India Hackathon 2026 — PS2
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-semibold text-[#5E849E] uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#A8C8D8] hover:text-[#E8F4F8] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#14FFEC] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold text-[#5E849E] uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#A8C8D8] hover:text-[#E8F4F8] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#14FFEC] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-[#5E849E] uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.contact.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="text-sm text-[#A8C8D8] hover:text-[#E8F4F8] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#14FFEC] rounded"
                  >
                    {link.label}
                    {link.external && (
                      <span className="sr-only"> (opens in new tab)</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[rgba(14,255,236,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#3A5A6E]">
            &copy; {year} SagarNetra AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="text-xs text-[#3A5A6E] hover:text-[#5E849E] transition-colors"
            >
              Privacy
            </Link>
            <span className="text-[#1A2A3A]" aria-hidden="true">·</span>
            <Link
              to="/terms"
              className="text-xs text-[#3A5A6E] hover:text-[#5E849E] transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SonarLogoSmall() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="14" cy="14" r="13" stroke="#0D7377" strokeWidth="1.5" />
      <circle cx="14" cy="14" r="8" stroke="#0AAFA3" strokeWidth="1" strokeDasharray="3 2" />
      <circle cx="14" cy="14" r="2.5" fill="#14FFEC" />
      <line x1="14" y1="14" x2="14" y2="2" stroke="#14FFEC" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="19" cy="8" r="1.5" fill="#14FFEC" opacity="0.7" />
    </svg>
  );
}
