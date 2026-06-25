import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import RoleHeader from "../../components/layout/RoleHeader/RoleHeader";
import RoleSidebar from "../../components/layout/RoleSidebar/RoleSidebar";
import { useAuth } from "../../context/AuthContext";
import { ADMIN_FOOTER_ITEMS, ADMIN_NAV_ITEMS } from "./adminNavigation";

function AdminPageShell({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const footerItems = {
    ...ADMIN_FOOTER_ITEMS[0],
    onClick: () => {
      logout();
      navigate("/staff/login", { replace: true });
    },
  };

  return (
    <div className="admin-accounts">
      <RoleSidebar
        ariaLabel="Admin navigation"
        navItems={ADMIN_NAV_ITEMS}
        footerItems={[footerItems]}
      />

      <main className="admin-accounts__main">
        <RoleHeader
          isFixed
          mobileNavItems={ADMIN_NAV_ITEMS}
          roleLabel="admin"
        />
        <div className="admin-accounts__content">{children}</div>
      </main>
    </div>
  );
}

AdminPageShell.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminPageShell;
