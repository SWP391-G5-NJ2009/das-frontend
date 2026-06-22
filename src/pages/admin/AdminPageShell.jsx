import PropTypes from "prop-types";
import RoleHeader from "../../components/layout/RoleHeader/RoleHeader";
import RoleSidebar from "../../components/layout/RoleSidebar/RoleSidebar";
import { ADMIN_FOOTER_ITEMS, ADMIN_NAV_ITEMS } from "./adminNavigation";

function AdminPageShell({ children, onNotificationClick }) {
  return (
    <div className="admin-accounts">
      <RoleSidebar
        ariaLabel="Admin navigation"
        navItems={ADMIN_NAV_ITEMS}
        footerItems={ADMIN_FOOTER_ITEMS}
      />

      <main className="admin-accounts__main">
        <RoleHeader
          isFixed
          mobileNavItems={ADMIN_NAV_ITEMS}
          onNotificationClick={onNotificationClick}
          roleLabel="admin"
        />
        <div className="admin-accounts__content">{children}</div>
      </main>
    </div>
  );
}

AdminPageShell.propTypes = {
  children: PropTypes.node.isRequired,
  onNotificationClick: PropTypes.func,
};

AdminPageShell.defaultProps = {
  onNotificationClick: undefined,
};

export default AdminPageShell;
