import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import RoleHeader from "../../../components/layout/RoleHeader/RoleHeader";
import RoleSidebar from "../../../components/layout/RoleSidebar/RoleSidebar";
import {
  OWNER_FOOTER_ITEMS,
  OWNER_NAV_ITEMS,
} from "../../owner/ownerNavigation";
import "./RoleDashboardPage.css";

const ADMIN_NAV_ITEMS = [
  { icon: "person", label: "Quản lý tài khoản", to: "/admin/accounts" },
  { icon: "dashboard", label: "Bảng điều khiển", to: "/admin/dashboard" },
  { icon: "calendar_today", label: "Lịch hẹn", to: "/admin/appointments" },
  { icon: "assessment", label: "Báo cáo", to: "/admin/reports" },
  { icon: "settings", label: "Cài đặt", to: "/admin/settings" },
];

function RoleDashboardPage({ title }) {
  const { logout, user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isOwner = user?.role === "owner";
  const hasSidebar = isAdmin || isOwner;
  const navItems = isOwner ? OWNER_NAV_ITEMS : ADMIN_NAV_ITEMS;
  const footerItems = isOwner
    ? getOwnerFooterItems(logout)
    : [{ icon: "logout", label: "Đăng xuất", onClick: logout }];

  return (
    <div
      className={`role-dashboard${hasSidebar ? " role-dashboard--with-sidebar" : ""}`}
    >
      {hasSidebar && (
        <RoleSidebar
          ariaLabel="Điều hướng theo vai trò"
          navItems={navItems}
          footerItems={footerItems}
        />
      )}

      <div className="role-dashboard__main">
        <RoleHeader
          isFixed={hasSidebar}
          mobileNavItems={hasSidebar ? navItems : []}
          roleLabel={user?.role || "Staff"}
          showHelp
        />
        <main className="role-dashboard__content">
          <h1>{title}</h1>
          <p>Xin chào, {user?.fullName || user?.email}.</p>
          <button type="button" onClick={logout}>
            Đăng xuất
          </button>
          {user?.role === "owner" && (
            <Link to="/owner/services">Quản lý dịch vụ nha khoa</Link>
          )}
          <Link to="/">Về trang chủ</Link>
        </main>
      </div>
    </div>
  );
}

RoleDashboardPage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default RoleDashboardPage;
