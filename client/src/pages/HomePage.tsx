import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CookieBanner from "../components/CookieBanner";

const QUICK_POINTS = [
  { number: "01", title: "Upload", text: "Add a PNG, JPEG, or TIFF sonar image." },
  { number: "02", title: "Review", text: "Inspect anomaly candidates with confidence and severity." },
  { number: "03", title: "Plan", text: "Use the mission workspace, map, routes, and report." },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main id="main-content" className="simple-landing">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#a855f7] focus:text-white focus:rounded-md focus:font-semibold"
        >
          Skip to main content
        </a>

        <section className="simple-landing-hero" aria-labelledby="landing-heading">
          <div className="simple-landing-copy">
            <p className="simple-landing-kicker">SIDE-SCAN SONAR ANALYSIS</p>
            <h1 id="landing-heading">Make the seafloor easier to understand.</h1>
            <p className="simple-landing-lead">
              SagarNetra helps operators review sonar imagery, identify possible
              debris, and move from a scan to a clear mission decision.
            </p>
            <div className="simple-landing-actions">
              <Link to="/analyze" className="btn-primary">Open analysis workspace</Link>
              <a href="#steps-heading" className="btn-secondary">See workflow</a>
            </div>
          </div>

          <div className="simple-landing-preview" aria-label="Analysis summary preview">
            <div className="simple-preview-topline">
              <span className="simple-status-dot" aria-hidden="true" />
              <span>MISSION READY</span>
              <span className="simple-preview-code">SGN-01</span>
            </div>
            <div className="simple-preview-radar" aria-hidden="true">
              <span>65%</span>
              <i />
            </div>
            <div className="simple-preview-stats">
              <div><strong>04</strong><span>candidates</span></div>
              <div><strong>02</strong><span>high priority</span></div>
              <div><strong>OK</strong><span>review status</span></div>
            </div>
          </div>
        </section>

        <section className="simple-landing-steps" aria-labelledby="steps-heading">
          <div className="simple-landing-section-heading">
            <p className="simple-landing-kicker">ONE CLEAR WORKFLOW</p>
            <h2 id="steps-heading">From sonar image to action.</h2>
          </div>

          <div className="simple-landing-step-grid">
            {QUICK_POINTS.map((point) => (
              <article key={point.number} className="simple-landing-step">
                <span>{point.number}</span>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="simple-landing-final" aria-labelledby="final-heading">
          <div>
            <p className="simple-landing-kicker">READY WHEN YOU ARE</p>
            <h2 id="final-heading">Start with one sonar image.</h2>
          </div>
          <Link to="/analyze" className="btn-primary">Start analysis</Link>
        </section>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
