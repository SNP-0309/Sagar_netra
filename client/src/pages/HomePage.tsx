import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CookieBanner from "../components/CookieBanner";

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
              Review sonar imagery, identify possible debris, and move from a
              scan to a clear mission decision.
            </p>
            <Link to="/analyze" className="btn-primary">
              Open analysis workspace
            </Link>
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
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
