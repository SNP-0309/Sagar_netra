import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "SagarNetra AI — Sonar-Based Marine Debris Detection",
  description:
    "SagarNetra AI processes side-scan sonar imagery with deep learning to detect, classify, and map marine debris and underwater anomalies. Built for oceanographers, port authorities, and coast guard operations.",
  alternates: { canonical: "/" },
};

// ─── Data ──────────────────────────────────────────────────────
const DETECTION_CLASSES = [
  { label: "Derelict fishing gear", confidence: 94, severity: "high" },
  { label: "Metallic debris field", confidence: 89, severity: "high" },
  { label: "Submerged vessel", confidence: 76, severity: "medium" },
  { label: "Sediment anomaly", confidence: 61, severity: "low" },
];

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Sonar data ingestion",
    description:
      "Upload raw side-scan sonar files (XTF, JSF, or preprocessed TIFF). The system validates format integrity and normalises waterfall imagery for consistent analysis.",
    icon: UploadIcon,
  },
  {
    step: "02",
    title: "Pre-processing & normalisation",
    description:
      "Slant-range correction, beam-pattern compensation, and noise filtering are applied automatically. Bottom-tracking ensures the seafloor baseline is accurate.",
    icon: ProcessIcon,
  },
  {
    step: "03",
    title: "CNN-based anomaly detection",
    description:
      "A convolutional neural network trained on annotated sonar datasets scans for shadow patterns, acoustic backscatter anomalies, and debris morphologies.",
    icon: ScanIcon,
  },
  {
    step: "04",
    title: "Classification & confidence scoring",
    description:
      "Detected objects are classified into categories — derelict gear, metallic debris, biological matter, or natural features — each with a confidence score.",
    icon: ClassifyIcon,
  },
  {
    step: "05",
    title: "Geo-referenced output",
    description:
      "Results are projected onto a geo-referenced map with WGS84 coordinates, exportable as GeoJSON, KML, or shapefile for integration with GIS tools.",
    icon: MapIcon,
  },
];

const USE_CASES = [
  {
    title: "Harbour & port clearance",
    description:
      "Survey berths and navigation channels before vessel entry. Identify submerged obstructions that create collision or grounding risk.",
    detail: "Typical coverage: 2–8 km² per survey run",
  },
  {
    title: "Ghost gear retrieval",
    description:
      "Locate abandoned fishing nets, pots, and longlines that entangle marine wildlife and degrade reef ecosystems.",
    detail: "Detection range: 0.3–150 m object size",
  },
  {
    title: "Post-disaster assessment",
    description:
      "After cyclones, floods, or shipwrecks — rapidly survey affected seafloor areas and produce damage maps for recovery operations.",
    detail: "Turnaround: survey to report under 4 hours",
  },
  {
    title: "Environmental monitoring",
    description:
      "Track debris accumulation trends over repeat surveys. Generate evidence-based reports for regulatory submissions and cleanup coordination.",
    detail: "Archive: historical comparison across dates",
  },
];

const STATS = [
  { value: "94%", label: "Mean detection accuracy on test dataset" },
  { value: "< 3 min", label: "Processing time per sonar pass (1 km)" },
  { value: "0.3 m", label: "Minimum detectable object size" },
  { value: "400 m", label: "Maximum swath width supported" },
];

// ─── Page ──────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Navbar />

      <main id="main-content">
        {/* Skip to main content (accessibility) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#14FFEC] focus:text-[#060E1A] focus:rounded-md focus:font-semibold"
        >
          Skip to main content
        </a>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section
          className="relative min-h-[92vh] flex flex-col justify-center pt-24 pb-16 overflow-hidden"
          aria-label="Hero section"
        >
          {/* Subtle background grid — not a decorative orb */}
          <div
            className="absolute inset-0 bg-grid-faint bg-grid opacity-100 pointer-events-none"
            aria-hidden="true"
          />
          {/* Gradient fade at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060E1A] to-transparent pointer-events-none"
            aria-hidden="true"
          />

          <div className="container-main relative">
            <div className="max-w-3xl">
              {/* Context label — not a marketing badge */}
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="badge badge-teal">Smart India Hackathon 2024 — PS2</span>
              </div>

              <h1 className="text-display text-[#E8F4F8] mb-6">
                Side-scan sonar that{" "}
                <span className="text-gradient">sees what divers cannot.</span>
              </h1>

              <p className="text-[1.125rem] text-[#A8C8D8] leading-relaxed max-w-2xl mb-10">
                SagarNetra AI processes sonar waterfall imagery to detect,
                classify, and geo-reference marine debris — ghost fishing gear,
                metallic wrecks, and seafloor anomalies — across kilometre-scale
                survey areas in minutes.
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                <Link href="/demo" className="btn-primary">
                  Run a demo scan
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <a href="#how-it-works" className="btn-secondary">
                  How it works
                </a>
              </div>
            </div>

            {/* Sonar display — actual product UI preview */}
            <div className="mt-16 lg:mt-0 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[480px] xl:w-[520px]">
              <SonarPreviewCard />
            </div>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────── */}
        <section
          className="border-y border-[rgba(14,255,236,0.08)] bg-[#0A1628]"
          aria-label="Key metrics"
        >
          <div className="container-main py-10">
            <dl className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <dt className="text-[#5E849E] text-sm mb-1">{stat.label}</dt>
                  <dd className="text-[2rem] font-bold text-[#14FFEC] tracking-tight leading-none">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────────── */}
        <section
          id="how-it-works"
          className="section"
          aria-labelledby="how-heading"
        >
          <div className="container-main">
            <header className="max-w-xl mb-14">
              <p className="text-[#5E849E] text-label uppercase mb-3">Process</p>
              <h2 id="how-heading" className="text-h1 text-[#E8F4F8] mb-4">
                From sonar file to actionable map
              </h2>
              <p className="text-[#A8C8D8] text-body">
                The full pipeline runs on-premise or in a containerised cloud
                environment. No data leaves your network unless you configure it
                to.
              </p>
            </header>

            <ol className="space-y-0" aria-label="Processing pipeline steps">
              {HOW_IT_WORKS_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.step}
                    className="relative flex gap-6 pb-10 last:pb-0"
                  >
                    {/* Connector line */}
                    {i < HOW_IT_WORKS_STEPS.length - 1 && (
                      <div
                        className="absolute left-5 top-12 bottom-0 w-px bg-[rgba(14,255,236,0.1)]"
                        aria-hidden="true"
                      />
                    )}

                    {/* Step number + icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#0A1628] border border-[rgba(14,255,236,0.12)] flex items-center justify-center mt-0.5 z-10">
                      <Icon />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1.5">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-xs text-[#5E849E]">
                          {step.step}
                        </span>
                        <h3 className="text-h3 text-[#E8F4F8]">{step.title}</h3>
                      </div>
                      <p className="text-[#A8C8D8] text-body-sm leading-relaxed max-w-2xl">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ── Detection Output Preview ──────────────────────────── */}
        <section
          className="section bg-[#0A1628]"
          aria-labelledby="detection-heading"
        >
          <div className="container-main">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-[#5E849E] text-label uppercase mb-3">Output</p>
                <h2 id="detection-heading" className="text-h1 text-[#E8F4F8] mb-6">
                  What the analysis produces
                </h2>
                <p className="text-[#A8C8D8] mb-8 leading-relaxed">
                  Each detection comes with a bounding region on the sonar
                  waterfall, geo-coordinates, classification label, confidence
                  score, and severity rating. Operators can accept, reject, or
                  flag results for manual review.
                </p>
                <Link href="/demo" className="btn-primary">
                  See the demo
                </Link>
              </div>

              {/* Detection result card — actual UI representation */}
              <div
                className="surface-card p-6"
                aria-label="Sample detection output"
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[#E8F4F8] font-semibold">Survey Run #0047</p>
                    <p className="text-[#5E849E] text-sm">
                      Port of Chennai — Sector B3 — 1.4 km pass
                    </p>
                  </div>
                  <span className="badge badge-success">Processed</span>
                </div>

                <div className="space-y-3" role="list" aria-label="Detected objects">
                  {DETECTION_CLASSES.map((d) => (
                    <div
                      key={d.label}
                      role="listitem"
                      className="flex items-center gap-3 p-3 bg-[#060E1A] rounded-lg border border-[rgba(14,255,236,0.06)]"
                    >
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          d.severity === "high"
                            ? "bg-[#E05252]"
                            : d.severity === "medium"
                            ? "bg-[#D4A017]"
                            : "bg-[#2ECC71]"
                        }`}
                        aria-label={`${d.severity} severity`}
                      />
                      <span className="text-[#A8C8D8] text-sm flex-1">
                        {d.label}
                      </span>
                      <div className="flex items-center gap-2">
                        {/* Confidence bar */}
                        <div
                          className="w-16 h-1.5 bg-[#0E1F38] rounded-full overflow-hidden"
                          role="img"
                          aria-label={`${d.confidence}% confidence`}
                        >
                          <div
                            className="h-full bg-[#0AAFA3] rounded-full"
                            style={{ width: `${d.confidence}%` }}
                          />
                        </div>
                        <span className="text-[#5E849E] text-xs font-mono w-8 text-right">
                          {d.confidence}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-5 border-t border-[rgba(14,255,236,0.06)] flex items-center justify-between">
                  <p className="text-xs text-[#5E849E]">
                    4 objects detected · 2 high priority
                  </p>
                  <button className="btn-ghost text-sm py-1.5 px-3">
                    Export GeoJSON
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Use Cases ────────────────────────────────────────── */}
        <section
          id="use-cases"
          className="section"
          aria-labelledby="use-cases-heading"
        >
          <div className="container-main">
            <header className="max-w-xl mb-12">
              <p className="text-[#5E849E] text-label uppercase mb-3">Applications</p>
              <h2 id="use-cases-heading" className="text-h1 text-[#E8F4F8] mb-4">
                Where SagarNetra is deployed
              </h2>
            </header>

            <div className="grid sm:grid-cols-2 gap-5">
              {USE_CASES.map((uc) => (
                <article
                  key={uc.title}
                  className="surface-card surface-card-hover p-6"
                >
                  <h3 className="text-[#E8F4F8] font-semibold mb-2">
                    {uc.title}
                  </h3>
                  <p className="text-[#A8C8D8] text-sm leading-relaxed mb-4">
                    {uc.description}
                  </p>
                  <p className="text-xs text-[#5E849E] font-mono border-t border-[rgba(14,255,236,0.06)] pt-3">
                    {uc.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <section
          className="section"
          aria-labelledby="cta-heading"
        >
          <div className="container-main">
            <div className="surface-card p-10 sm:p-14 text-center max-w-2xl mx-auto">
              <h2 id="cta-heading" className="text-h1 text-[#E8F4F8] mb-4">
                Run your first sonar scan
              </h2>
              <p className="text-[#A8C8D8] mb-8 max-w-md mx-auto">
                Upload a sample sonar file and see detection results in under
                three minutes. No account required for the demo.
              </p>
              <Link href="/demo" className="btn-primary text-base px-8 py-3">
                Open the demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}

// ─── Inline Sonar Preview ─────────────────────────────────────
function SonarPreviewCard() {
  return (
    <div className="surface-card p-5 shadow-[0_12px_48px_rgba(0,0,0,0.5)]">
      {/* Card header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse" aria-hidden="true" />
          <span className="text-[#E8F4F8] text-sm font-medium">Live Analysis</span>
        </div>
        <span className="text-xs font-mono text-[#5E849E]">SN-2024-B3</span>
      </div>

      {/* Sonar waterfall representation */}
      <div
        className="relative h-48 bg-[#020810] rounded-lg overflow-hidden mb-4"
        aria-label="Sonar waterfall image with detected anomaly"
        role="img"
      >
        {/* Waterfall scan lines */}
        <div className="absolute inset-0 flex flex-col gap-px opacity-60">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 flex"
              aria-hidden="true"
            >
              <div
                className="flex-1"
                style={{
                  background: `linear-gradient(90deg, 
                    rgba(13,115,119,${0.1 + Math.sin(i * 0.3) * 0.05}) 0%, 
                    rgba(10,175,163,${0.15 + Math.sin(i * 0.5 + 1) * 0.1}) ${30 + Math.sin(i * 0.4) * 10}%, 
                    rgba(13,115,119,${0.08 + Math.sin(i * 0.6) * 0.04}) 100%
                  )`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Detection overlay bounding box */}
        <div
          className="absolute border-2 border-[#E05252] rounded"
          style={{ top: "28%", left: "35%", width: "28%", height: "30%" }}
          aria-hidden="true"
        >
          <div className="absolute -top-5 left-0 text-[10px] font-mono bg-[#E05252] text-white px-1 rounded">
            DEBRIS
          </div>
        </div>

        {/* Secondary detection */}
        <div
          className="absolute border-2 border-[#D4A017] rounded opacity-70"
          style={{ top: "60%", left: "15%", width: "18%", height: "22%" }}
          aria-hidden="true"
        >
          <div className="absolute -top-5 left-0 text-[10px] font-mono bg-[#D4A017] text-[#060E1A] px-1 rounded">
            GEAR
          </div>
        </div>

        {/* Scan progress indicator */}
        <div className="absolute bottom-2 right-2 text-xs font-mono text-[#14FFEC] bg-[#060E1A]/80 px-2 py-1 rounded">
          324m / 1400m
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { value: "2", label: "Detected" },
          { value: "94%", label: "Confidence" },
          { value: "2:47", label: "Elapsed" },
        ].map((s) => (
          <div key={s.label} className="bg-[#060E1A] rounded-lg p-2">
            <p className="text-[#14FFEC] font-bold font-mono text-base">{s.value}</p>
            <p className="text-[#5E849E] text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step Icons ───────────────────────────────────────────────
function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
function ProcessIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function ScanIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function ClassifyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
function MapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14FFEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}
