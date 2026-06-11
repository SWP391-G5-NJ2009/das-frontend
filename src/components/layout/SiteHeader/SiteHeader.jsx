import { Link } from "react-router-dom";
import "./SiteHeader.css";

function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="site-header__inner" aria-label="Điều hướng chính">
        <Link className="site-header__brand" to="/">
          DentalCare
        </Link>
        <div className="site-header__links">
          <Link to="/">Trang chủ</Link>
          <Link to="/services">Dịch vụ</Link>
          <Link to="/consultation">Tư vấn</Link>
        </div>
        <Link className="site-header__login" to="/login">
          Đăng nhập
        </Link>
      </nav>
    </header>
  );
}

export default SiteHeader;
