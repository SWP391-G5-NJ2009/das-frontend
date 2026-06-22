import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import RoleHeader from "../../../components/layout/RoleHeader/RoleHeader";
import RoleSidebar from "../../../components/layout/RoleSidebar/RoleSidebar";
import {
  OWNER_FOOTER_ITEMS,
  OWNER_NAV_ITEMS,
} from "../../owner/ownerNavigation";
import "./RoleDashboardPage.css";

const ADMIN_NAV_ITEMS = [
  { icon: "person", label: "Account Management", to: "/admin/accounts" },
  { icon: "dashboard", label: "Dashboard", to: "/admin/dashboard" },
  { icon: "calendar_today", label: "Appointments", to: "/admin/appointments" },
  { icon: "assessment", label: "Reports", to: "/admin/reports" },
  { icon: "settings", label: "Settings", to: "/admin/settings" },
];

function RoleDashboardPage({ title }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  const isOwner = user?.role === "owner";
  const hasSidebar = isAdmin || isOwner;
  const navItems = isOwner ? OWNER_NAV_ITEMS : ADMIN_NAV_ITEMS;
  const handleLogout = () => {
    logout();
    navigate(user?.role === "patient" ? "/login" : "/staff/login", {
      replace: true,
    });
  };
  const footerItems = [{
    ...(isOwner
      ? OWNER_FOOTER_ITEMS[0]
      : { icon: "logout", label: "Log out", to: "/staff/login" }),
    onClick: handleLogout,
  }];

  return (
    <div
      className={`role-dashboard${hasSidebar ? " role-dashboard--with-sidebar" : ""}`}
    >
      {hasSidebar && (
        <RoleSidebar
          ariaLabel="Role navigation"
          navItems={navItems}
          footerItems={footerItems}
        />
      )}

      <div className="role-dashboard__main">
        <RoleHeader
          isFixed={hasSidebar}
          mobileNavItems={hasSidebar ? navItems : []}
          roleLabel={user?.role || "Staff"}
        />
        <main className="role-dashboard__content">
          <h1>{title}</h1>
          <p>Hello, {user?.fullName || user?.email}.</p>
          <button type="button" onClick={handleLogout}>
            Log out
          </button>
          {user?.role === "owner" && (
            <Link to="/owner/services">Manage dental services</Link>
          )}
          <Link to="/">Back to home</Link>
        </main>
      </div>
    </div>
  );
}

RoleDashboardPage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default RoleDashboardPage;
