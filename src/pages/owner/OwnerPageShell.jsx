import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import RoleHeader from "../../components/layout/RoleHeader/RoleHeader";
import RoleSidebar from "../../components/layout/RoleSidebar/RoleSidebar";
import { useAuth } from "../../context/AuthContext";
import { OWNER_NAV_ITEMS, OWNER_FOOTER_ITEMS } from "./ownerNavigation";
import "./ownerPageShell.css";

function OwnerPageShell({ children, contentClassName }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const footerItems = {
    ...OWNER_FOOTER_ITEMS,
    onClick: () => {
      logout();
      navigate("/staff/login", { replace: true });
    },
  };

  return (
    <div
      className={`owner-page${contentClassName ? ` ${contentClassName}` : ""}`}
    >
      <RoleSidebar
        ariaLabel="Clinic owner navigation"
        navItems={OWNER_NAV_ITEMS}
        footerItems={[footerItems]}
      />

      <main className="owner-page__main">
        <RoleHeader
          isFixed
          mobileNavItems={OWNER_NAV_ITEMS}
          roleLabel={user?.role || "owner"}
          searchLabel="Search clinic owner area"
          showHelp
        />
        <div className="owner-page__content">{children}</div>
      </main>
    </div>
  );
}

OwnerPageShell.propTypes = {
  children: PropTypes.node.isRequired,
  contentClassName: PropTypes.string,
};

OwnerPageShell.defaultProps = {
  contentClassName: "",
};

export default OwnerPageShell;
