import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import RoleHeader from "../../../components/layout/RoleHeader/RoleHeader";
import RoleSidebar from "../../../components/layout/RoleSidebar/RoleSidebar";
import "./RoleDashboardPage.css";

const ADMIN_NAV_ITEMS = [
  { icon: "person", label: "Manage Account", to: "/admin/accounts" },
  { icon: "dashboard", label: "Dashboard", to: "/admin/dashboard" },
  { icon: "calendar_today", label: "Appointments", to: "/admin/appointments" },
  { icon: "assessment", label: "Reports", to: "/admin/reports" },
  { icon: "settings", label: "Settings", to: "/admin/settings" },
];

function RoleDashboardPage({ title }) {
  const { logout, user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className={`role-dashboard${isAdmin ? " role-dashboard--with-sidebar" : ""}`}>
      {isAdmin && (
        <RoleSidebar
          ariaLabel="Admin navigation"
          navItems={ADMIN_NAV_ITEMS}
          footerItems={[{ icon: "logout", label: "Logout", onClick: logout }]}
        />
      )}

      <div className="role-dashboard__main">
        <RoleHeader
          isFixed={isAdmin}
          roleLabel={user?.role || "Staff"}
          showHelp
        />
      <main className="role-dashboard__content">
        <h1>{title}</h1>
        <p>Xin chao, {user?.fullName || user?.email}.</p>
        <button type="button" onClick={logout}>
          Dang xuat
        </button>
        {user?.role === "owner" && (
          <Link to="/owner/services">Quan ly dich vu nha khoa</Link>
        )}
        <Link to="/">Ve trang chu</Link>
      </main>
      </div>
    </div>
  );
}

RoleDashboardPage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default RoleDashboardPage;
