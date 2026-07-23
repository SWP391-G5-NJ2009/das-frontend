import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import RoleHeader from "../../components/layout/RoleHeader/RoleHeader";
import RoleSidebar from "../../components/layout/RoleSidebar/RoleSidebar";
import { useAuth } from "../../context/AuthContext";
import { MANAGER_NAV_ITEMS, MANAGER_FOOTER_ITEMS } from "./managerNavigation";
import "./managerPageShell.css";

function ManagerPageShell({ children, contentClassName }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const footerItems = {
    ...MANAGER_FOOTER_ITEMS[0],
    onClick: () => {
      logout();
      navigate("/staff/login", { replace: true });
    },
  };

  return (
    <div
      className={`manager-page${contentClassName ? ` ${contentClassName}` : ""}`}
    >
      <RoleSidebar
        ariaLabel="Điều hướng quản lý phòng khám"
        navItems={MANAGER_NAV_ITEMS}
        footerItems={[footerItems]}
      />

      <main className="manager-page__main">
        <RoleHeader
          isFixed
          mobileNavItems={MANAGER_NAV_ITEMS}
          roleLabel={user?.role || "Quản lý"}
        />
        <div className="manager-page__content">{children}</div>
      </main>
    </div>
  );
}

ManagerPageShell.propTypes = {
  children: PropTypes.node.isRequired,
  contentClassName: PropTypes.string,
};

ManagerPageShell.defaultProps = {
  contentClassName: "",
};

export default ManagerPageShell;
