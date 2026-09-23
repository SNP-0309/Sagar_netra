import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header
      role="banner"
      className="fixed top-0 left-0 right-0 z-50 bg-[#17171f]/95 backdrop-blur-md border-b border-white/10"
    >
      <div className="container-main">
        <nav className="flex items-center justify-between h-16" aria-label="Main navigation">
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a855f7]"
            aria-label="SagarNetra AI — Go to homepage"
          >
            <SonarLogo />
            <span className="font-semibold text-[#f4f4f7] tracking-tight">
              SagarNetra<span className="text-[#c084fc]"> AI</span>
            </span>
          </Link>

          <Link to="/analyze" className="btn-primary text-sm py-2 px-5">
            Analyze sonar
          </Link>
        </nav>
      </div>
    </header>
  );
}

function SonarLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="14" cy="14" r="13" stroke="#a855f7" strokeWidth="1.5" />
      <circle cx="14" cy="14" r="8" stroke="#c084fc" strokeWidth="1" strokeDasharray="3 2" />
      <circle cx="14" cy="14" r="2.5" fill="#22d3ee" />
      <line x1="14" y1="14" x2="14" y2="2" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="19" cy="8" r="1.5" fill="#f43f8e" opacity="0.9" />
    </svg>
  );
}
