import { Link } from "react-router-dom";
import "./SiteHeader.css";

function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="site-header__inner" aria-label="Main navigation">
        <Link className="site-header__brand" to="/">
          DentalCare
        </Link>
        <div className="site-header__links">
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/consultation">Consultation</Link>
        </div>
        <Link className="site-header__login" to="/login">
          Log in
        </Link>
      </nav>
    </header>
  );
}

export default SiteHeader;
