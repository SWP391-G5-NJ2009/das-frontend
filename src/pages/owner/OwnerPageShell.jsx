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

  return (
    <div
      className={`owner-page${contentClassName ? ` ${contentClassName}` : ""}`}
    >
      <RoleSidebar
        ariaLabel="Dieu huong chu phong kham"
        navItems={OWNER_NAV_ITEMS}
        footerItems={OWNER_FOOTER_ITEMS}
      />

      <main className="owner-page__main">
        <RoleHeader
          isFixed
          roleLabel={user?.role || "owner"}
          searchLabel="Tim kiem trong khu vuc chu phong kham"
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
