import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import RoleHeader from "../../components/layout/RoleHeader/RoleHeader";
import RoleSidebar from "../../components/layout/RoleSidebar/RoleSidebar";
import { useAuth } from "../../context/AuthContext";
import { DENTIST_FOOTER_ITEMS, DENTIST_NAV_ITEMS } from "./dentistNavigation";
import "./dentistPageShell.css";

function DentistPageShell({ children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const footerItems = [{
    ...DENTIST_FOOTER_ITEMS[0],
    onClick: () => {
      logout();
      navigate("/staff/login", { replace: true });
    },
  }];

  return (
    <div className="dentist-page">
      <RoleSidebar
        ariaLabel="Dentist navigation"
        navItems={DENTIST_NAV_ITEMS}
        footerItems={footerItems}
      />

      <main className="dentist-page__main">
        <RoleHeader
          isFixed
          mobileNavItems={DENTIST_NAV_ITEMS}
          roleLabel={user?.role || "dentist"}
        />
        <div className="dentist-page__content">{children}</div>
      </main>
    </div>
  );
}

DentistPageShell.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DentistPageShell;
