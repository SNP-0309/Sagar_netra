import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        className="min-h-screen flex items-center justify-center pt-16"
        aria-label="Page not found"
      >
        <div className="container-main text-center max-w-lg py-20">
          {/* Sonar ring graphic */}
          <div className="relative w-24 h-24 mx-auto mb-8" aria-hidden="true">
            <div className="absolute inset-0 rounded-full border border-[rgba(14,255,236,0.3)]" />
            <div
              className="absolute inset-3 rounded-full border border-[rgba(14,255,236,0.2)]"
              style={{ animation: "sonar-ping 2.5s ease-out infinite" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold font-mono text-[#14FFEC] text-xl">404</span>
            </div>
          </div>

          <h1 className="text-h2 text-[#E8F4F8] mb-3">Signal lost</h1>
          <p className="text-[#A8C8D8] mb-8 leading-relaxed">
            The page you&apos;re looking for is not in our sonar range. It may
            have been moved, deleted, or never existed.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary">
              Return to home
            </Link>
            <Link href="/demo" className="btn-secondary">
              Open the demo
            </Link>
          </div>

          {/* Helpful navigation */}
          <div className="mt-12 pt-8 border-t border-[rgba(14,255,236,0.08)]">
            <p className="text-sm text-[#5E849E] mb-4">
              Looking for something specific?
            </p>
            <nav aria-label="Helpful links">
              <ul className="flex flex-wrap gap-4 justify-center">
                {[
                  { href: "/", label: "Home" },
                  { href: "/demo", label: "Live Demo" },
                  { href: "/privacy", label: "Privacy Policy" },
                  { href: "/terms", label: "Terms of Service" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#A8C8D8] hover:text-[#14FFEC] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        @keyframes sonar-ping {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </>
  );
}
