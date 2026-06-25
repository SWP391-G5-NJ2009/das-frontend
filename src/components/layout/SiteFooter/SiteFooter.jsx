import { Link } from "react-router-dom";
import "./SiteFooter.css";

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <Link className="site-footer__brand" to="/">
          DentalCare
        </Link>
        <p>© 2026 DentalCare. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default SiteFooter;
