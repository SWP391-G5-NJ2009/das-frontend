import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import RoleHeader from "../../components/layout/RoleHeader/RoleHeader";
import RoleSidebar from "../../components/layout/RoleSidebar/RoleSidebar";
import { useAuth } from "../../context/AuthContext";
import { PATIENT_FOOTER_ITEMS, PATIENT_NAV_ITEMS } from "./patientNavigation";
import "./patientPageShell.css";

function PatientPageShell({ children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const footerItems = {
    ...PATIENT_FOOTER_ITEMS[0],
    onClick: () => {
      logout();
      navigate("/login", { replace: true });
    },
  };

  return (
    <div className="patient-page">
      <RoleSidebar
        ariaLabel="Patient navigation"
        navItems={PATIENT_NAV_ITEMS}
        footerItems={footerItems}
      />

      <main className="patient-page__main">
        <RoleHeader
          isFixed
          mobileNavItems={PATIENT_NAV_ITEMS}
          roleLabel={user?.role || "patient"}
        />
        <div className="patient-page__content">{children}</div>
      </main>
    </div>
  );
}

PatientPageShell.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PatientPageShell;
