import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LAST_UPDATED = "21 September 2024";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16" aria-label="Privacy Policy page">
        <div className="container-main max-w-3xl">
          {/* Header */}
          <div className="pb-8 mb-10 border-b border-[rgba(14,255,236,0.08)]">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-[#5E849E]">
                <li>
                  <Link to="/" className="hover:text-[#A8C8D8] transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">·</li>
                <li className="text-[#A8C8D8]" aria-current="page">Privacy Policy</li>
              </ol>
            </nav>
            <h1 className="text-h1 text-[#E8F4F8] mb-3">Privacy Policy</h1>
            <p className="text-[#5E849E] text-sm">
              Last updated: <time dateTime="2024-09-21">{LAST_UPDATED}</time>
            </p>
          </div>

          {/* Content */}
          <div className="prose-ocean space-y-10">
            <Section id="overview" title="Overview">
              <p>
                SagarNetra AI (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is a marine debris
                and anomaly detection system developed for the Smart India Hackathon
                2024. This Privacy Policy explains what data we collect when you
                use our website and analysis workspace, how we use it, and your rights.
              </p>
              <p>
                We process personal data only to the extent necessary to operate
                the service. We do not sell personal data to third parties.
              </p>
            </Section>

            <Section id="data-collected" title="What data we collect">
              <Subsection title="Data you provide">
                <ul>
                  <li>
                    <strong>Uploaded files</strong> — sonar files or images you
                    upload to the analysis workspace. These are processed in memory and are not
                    permanently stored unless you explicitly save a session.
                  </li>
                  <li>
                    <strong>Contact messages</strong> — name, email address, and
                    message content if you use our contact form.
                  </li>
                </ul>
              </Subsection>

              <Subsection title="Data collected automatically">
                <ul>
                  <li>
                    <strong>Log data</strong> — IP address, browser type, operating
                    system, referring URL, pages visited, and timestamps. Retained
                    for up to 90 days for security and debugging purposes.
                  </li>
                  <li>
                    <strong>Cookies</strong> — We use a single session cookie
                    (essential) to maintain state during your visit. We do not use
                    advertising or tracking cookies. See our{" "}
                    <a href="#cookies">Cookie section</a> below.
                  </li>
                </ul>
              </Subsection>
            </Section>

            <Section id="how-we-use" title="How we use your data">
              <ul>
                <li>To provide and operate the sonar analysis workspace</li>
                <li>To respond to contact form enquiries</li>
                <li>To monitor and improve system performance and security</li>
                <li>
                  To comply with legal obligations under applicable Indian and
                  international law
                </li>
              </ul>
              <p>
                We do not use your data for profiling, advertising targeting, or
                automated decision-making that affects legal or similarly significant
                outcomes.
              </p>
            </Section>

            <Section id="data-retention" title="Data retention">
              <p>
                Uploaded sonar files are deleted from our servers within{" "}
                <strong>24 hours</strong> of analysis completion. Contact form
                submissions are retained for up to <strong>12 months</strong> to
                allow for follow-up correspondence. Log data is retained for{" "}
                <strong>90 days</strong>.
              </p>
            </Section>

            <Section id="data-sharing" title="Data sharing">
              <p>
                We do not sell, rent, or share personal data with third parties
                except:
              </p>
              <ul>
                <li>
                  When required by law or valid legal process (e.g., court order)
                </li>
                <li>
                  With infrastructure providers (e.g., hosting) operating under
                  appropriate data processing agreements
                </li>
              </ul>
            </Section>

            <Section id="cookies" title="Cookies">
              <p>
                We use only <strong>essential cookies</strong> required for the
                website to function. We do not use analytics cookies,
                advertising cookies, or social media tracking cookies.
              </p>
              <table className="w-full text-sm border-collapse mt-4">
                <thead>
                  <tr className="border-b border-[rgba(14,255,236,0.1)]">
                    <th className="text-left py-2 pr-4 text-[#A8C8D8] font-medium">Cookie</th>
                    <th className="text-left py-2 pr-4 text-[#A8C8D8] font-medium">Purpose</th>
                    <th className="text-left py-2 text-[#A8C8D8] font-medium">Expiry</th>
                  </tr>
                </thead>
                <tbody className="text-[#5E849E]">
                  <tr className="border-b border-[rgba(14,255,236,0.05)]">
                    <td className="py-2 pr-4 font-mono text-xs">sagarnetra_cookie_consent</td>
                    <td className="py-2 pr-4">Records your cookie preference</td>
                    <td className="py-2">1 year</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-4">
                You can withdraw cookie consent at any time by clearing your
                browser&apos;s local storage for this site.
              </p>
            </Section>

            <Section id="security" title="Security">
              <p>
                We implement appropriate technical and organisational measures to
                protect your data, including TLS encryption in transit, access
                controls, and regular security reviews. No method of transmission
                over the internet is completely secure; we cannot guarantee absolute
                security.
              </p>
            </Section>

            <Section id="your-rights" title="Your rights">
              <p>
                Depending on your jurisdiction, you may have rights to:
              </p>
              <ul>
                <li>Access the personal data we hold about you</li>
                <li>Correct inaccurate personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to or restrict processing in certain circumstances</li>
                <li>Data portability</li>
              </ul>
              <p>
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:privacy@sagarnetra.in" className="text-[#14FFEC] hover:underline">
                  privacy@sagarnetra.in
                </a>
                . We will respond within 30 days.
              </p>
            </Section>

            <Section id="children" title="Children's privacy">
              <p>
                Our service is not directed at children under the age of 13. We do
                not knowingly collect personal data from children. If you believe
                we have inadvertently collected such data, please contact us for
                immediate deletion.
              </p>
            </Section>

            <Section id="changes" title="Changes to this policy">
              <p>
                We may update this policy to reflect changes in our practices or
                applicable law. Material changes will be communicated by updating
                the &ldquo;Last updated&rdquo; date above. Continued use after changes
                constitutes acceptance of the updated policy.
              </p>
            </Section>

            <Section id="contact" title="Contact">
              <p>
                For privacy enquiries:{" "}
                <a href="mailto:privacy@sagarnetra.in" className="text-[#14FFEC] hover:underline">
                  privacy@sagarnetra.in
                </a>
              </p>
              <p className="text-sm text-[#5E849E] mt-2">
                SagarNetra AI · Smart India Hackathon 2026 · India
              </p>
            </Section>
          </div>

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-[rgba(14,255,236,0.08)]">
            <Link to="/" className="btn-ghost pl-0">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        .prose-ocean p { color: #A8C8D8; line-height: 1.7; margin-bottom: 0.875rem; }
        .prose-ocean ul { color: #A8C8D8; padding-left: 1.25rem; space-y: 0.5rem; }
        .prose-ocean ul li { margin-bottom: 0.5rem; list-style-type: disc; }
        .prose-ocean strong { color: #E8F4F8; font-weight: 600; }
        .prose-ocean a { color: #14FFEC; }
        .prose-ocean a:hover { text-decoration: underline; }
        .prose-ocean table th, .prose-ocean table td { text-align: left; }
      `}</style>
    </>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24">
      <h2
        id={`${id}-heading`}
        className="text-h3 text-[#E8F4F8] mb-4 pb-2 border-b border-[rgba(14,255,236,0.08)]"
      >
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Subsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-[#E8F4F8] mb-2">{title}</h3>
      {children}
    </div>
  );
}
