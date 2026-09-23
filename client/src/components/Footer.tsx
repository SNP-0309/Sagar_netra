import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-white/10 bg-[#121218]"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="container-main flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
        <p className="text-xs text-[#8f8fa0]">
          © {year} SagarNetra AI
        </p>
        <div className="flex items-center gap-4">
          <Link to="/privacy" className="text-xs text-[#b8b8c7] hover:text-[#c084fc]">
            Privacy
          </Link>
          <Link to="/terms" className="text-xs text-[#b8b8c7] hover:text-[#c084fc]">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
