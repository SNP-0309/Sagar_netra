import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "SagarNetra AI Terms of Service — conditions governing the use of our marine debris detection platform.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "21 September 2024";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16" aria-label="Terms of Service page">
        <div className="container-main max-w-3xl">
          {/* Header */}
          <div className="pb-8 mb-10 border-b border-[rgba(14,255,236,0.08)]">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-[#5E849E]">
                <li>
                  <Link href="/" className="hover:text-[#A8C8D8] transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">·</li>
                <li className="text-[#A8C8D8]" aria-current="page">Terms of Service</li>
              </ol>
            </nav>
            <h1 className="text-h1 text-[#E8F4F8] mb-3">Terms of Service</h1>
            <p className="text-[#5E849E] text-sm">
              Last updated: <time dateTime="2024-09-21">{LAST_UPDATED}</time>
            </p>
          </div>

          {/* Content */}
          <div className="prose-ocean space-y-10">
            <Section id="acceptance" title="Acceptance of terms">
              <p>
                By accessing or using the SagarNetra AI platform (&ldquo;Service&rdquo;),
                you agree to be bound by these Terms of Service
                (&ldquo;Terms&rdquo;). If you do not agree, you must not use the
                Service.
              </p>
              <p>
                These Terms constitute a binding agreement between you and
                SagarNetra AI. &ldquo;You&rdquo; refers to the individual or entity
                accessing the Service.
              </p>
            </Section>

            <Section id="description" title="Service description">
              <p>
                SagarNetra AI provides a sonar-image analysis platform for
                detecting marine debris and underwater anomalies. The Service
                includes:
              </p>
              <ul>
                <li>An interactive demo for processing sonar and image files</li>
                <li>Detection, classification, and geo-referencing of anomalies</li>
                <li>Export of analysis results in standard GIS formats</li>
              </ul>
              <p>
                The Service was developed for the Smart India Hackathon 2024
                (PS2). Features and availability may change without notice during
                the hackathon period.
              </p>
            </Section>

            <Section id="permitted-use" title="Permitted use">
              <p>You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
              <ul>
                <li>Upload files containing malicious code, malware, or exploits</li>
                <li>Attempt to reverse-engineer, decompile, or extract the ML models</li>
                <li>Use the Service for any purpose that violates applicable law</li>
                <li>Transmit data you do not have the legal right to process</li>
                <li>Conduct automated attacks, denial of service, or scraping</li>
                <li>
                  Upload files containing personal data of individuals without
                  appropriate lawful basis
                </li>
              </ul>
            </Section>

            <Section id="data-and-files" title="Uploaded data and files">
              <p>
                You retain ownership of any files you upload. By uploading a
                file, you grant SagarNetra AI a limited, non-exclusive licence to
                process the file solely to provide the analysis Service.
              </p>
              <p>
                You represent and warrant that you have all rights necessary to
                upload the files and that doing so does not infringe any third
                party&apos;s rights or violate any applicable law.
              </p>
              <p>
                Uploaded files are processed in memory and deleted within 24
                hours. We do not claim ownership of your data. See our{" "}
                <Link href="/privacy" className="text-[#14FFEC] hover:underline">
                  Privacy Policy
                </Link>{" "}
                for full details.
              </p>
            </Section>

            <Section id="accuracy" title="Accuracy and limitations">
              <p>
                The detection and classification results produced by SagarNetra AI
                are based on machine learning models and are provided{" "}
                <strong>&ldquo;as is&rdquo;</strong> for informational and research
                purposes. They do not constitute:
              </p>
              <ul>
                <li>Certified hydrographic survey data</li>
                <li>Legal evidence of the presence or absence of any object</li>
                <li>A substitute for professional sonar survey interpretation</li>
                <li>Navigational safety information</li>
              </ul>
              <p>
                Results may contain false positives, missed detections, or
                misclassifications. All outputs should be independently verified
                before being used in operational decisions.
              </p>
            </Section>

            <Section id="intellectual-property" title="Intellectual property">
              <p>
                The SagarNetra AI platform, including its source code, models,
                design, and documentation, is the property of the SagarNetra AI
                team. All rights are reserved except where expressly stated.
              </p>
              <p>
                The codebase is developed for the Smart India Hackathon 2024.
                Licensing terms for the open-source components of the platform
                are governed by their respective licences.
              </p>
            </Section>

            <Section id="disclaimers" title="Disclaimers">
              <p>
                THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
                AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
                NON-INFRINGEMENT.
              </p>
              <p>
                We do not warrant that the Service will be uninterrupted,
                error-free, or free of harmful components.
              </p>
            </Section>

            <Section id="liability" title="Limitation of liability">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SAGARNETRA
                AI AND ITS TEAM MEMBERS SHALL NOT BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING
                OUT OF OR RELATED TO YOUR USE OF THE SERVICE, EVEN IF ADVISED OF
                THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p>
                OUR AGGREGATE LIABILITY SHALL NOT EXCEED INR 0 (ZERO) FOR A
                SERVICE PROVIDED AT NO CHARGE.
              </p>
            </Section>

            <Section id="governing-law" title="Governing law">
              <p>
                These Terms are governed by and construed in accordance with the
                laws of India. Any disputes shall be subject to the exclusive
                jurisdiction of the courts of India.
              </p>
            </Section>

            <Section id="changes" title="Changes to these terms">
              <p>
                We reserve the right to modify these Terms at any time. Material
                changes will be indicated by updating the &ldquo;Last
                updated&rdquo; date. Continued use of the Service following any
                changes constitutes your acceptance of the revised Terms.
              </p>
            </Section>

            <Section id="contact" title="Contact">
              <p>
                For questions about these Terms:{" "}
                <a href="mailto:legal@sagarnetra.in" className="text-[#14FFEC] hover:underline">
                  legal@sagarnetra.in
                </a>
              </p>
              <p className="text-sm text-[#5E849E] mt-2">
                SagarNetra AI · Smart India Hackathon 2024 · India
              </p>
            </Section>
          </div>

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-[rgba(14,255,236,0.08)]">
            <Link href="/" className="btn-ghost pl-0">
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        .prose-ocean p { color: #A8C8D8; line-height: 1.7; margin-bottom: 0.875rem; }
        .prose-ocean ul { color: #A8C8D8; padding-left: 1.25rem; }
        .prose-ocean ul li { margin-bottom: 0.5rem; list-style-type: disc; }
        .prose-ocean strong { color: #E8F4F8; font-weight: 600; }
        .prose-ocean a { color: #14FFEC; }
        .prose-ocean a:hover { text-decoration: underline; }
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
