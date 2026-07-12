import { Link } from "react-router-dom";
import "./SiteFooter.css";

function SiteFooter({ clinicInfo = null }) {
  const clinicName = clinicInfo?.clinic_name || "DentalCare";

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__identity">
          <Link className="site-footer__brand" to="/">
            {clinicName}
          </Link>
          <p>&copy; 2026 {clinicName}. All rights reserved.</p>
        </div>

        {clinicInfo && (
          <ul className="site-footer__contact" aria-label="Clinic contact">
            <li>{clinicInfo.hotline}</li>
            <li>{clinicInfo.address}</li>
            <li>{clinicInfo.operating_hours}</li>
          </ul>
        )}
      </div>
    </footer>
  );
}

export default SiteFooter;
