"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/demo", label: "Live Demo" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#use-cases", label: "Use Cases" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#060E1A]/95 backdrop-blur-md border-b border-[rgba(14,255,236,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="container-main">
          <nav
            className="flex items-center justify-between h-16"
            aria-label="Main navigation"
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14FFEC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060E1A] rounded-md"
              aria-label="SagarNetra AI — Go to homepage"
            >
              <SonarLogo />
              <span className="font-semibold text-[#E8F4F8] tracking-tight">
                SagarNetra<span className="text-[#14FFEC]"> AI</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1" role="list">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  role="listitem"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                    pathname === link.href
                      ? "text-[#14FFEC] bg-[rgba(14,255,236,0.08)]"
                      : "text-[#A8C8D8] hover:text-[#E8F4F8] hover:bg-[rgba(14,255,236,0.05)]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/demo" className="btn-primary text-sm py-2 px-5">
                Try Demo
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-md hover:bg-[rgba(14,255,236,0.06)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14FFEC]"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              <span
                className={`block w-5 h-0.5 bg-[#A8C8D8] transition-all duration-200 ${
                  menuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-[#A8C8D8] my-1 transition-all duration-200 ${
                  menuOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-[#A8C8D8] transition-all duration-200 ${
                  menuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
                }`}
              />
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-[#060E1A]/80 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Panel */}
        <div
          className={`absolute top-16 left-0 right-0 bg-[#0A1628] border-b border-[rgba(14,255,236,0.1)] transition-transform duration-300 ${
            menuOpen ? "translate-y-0" : "-translate-y-4 opacity-0"
          }`}
        >
          <nav className="container-main py-6 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 rounded-md text-base font-medium transition-colors ${
                  pathname === link.href
                    ? "text-[#14FFEC] bg-[rgba(14,255,236,0.08)]"
                    : "text-[#A8C8D8] hover:text-[#E8F4F8]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-[rgba(14,255,236,0.08)]">
              <Link href="/demo" className="btn-primary w-full justify-center">
                Try Live Demo
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

function SonarLogo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer ring */}
      <circle cx="14" cy="14" r="13" stroke="#0D7377" strokeWidth="1.5" />
      {/* Mid ring */}
      <circle cx="14" cy="14" r="8" stroke="#0AAFA3" strokeWidth="1" strokeDasharray="3 2" />
      {/* Center dot */}
      <circle cx="14" cy="14" r="2.5" fill="#14FFEC" />
      {/* Scan line */}
      <line x1="14" y1="14" x2="14" y2="2" stroke="#14FFEC" strokeWidth="1.5" strokeLinecap="round" />
      {/* Detection blip */}
      <circle cx="19" cy="8" r="1.5" fill="#14FFEC" opacity="0.7" />
    </svg>
  );
}
