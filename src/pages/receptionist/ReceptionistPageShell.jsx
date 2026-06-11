import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import RoleHeader from "../../components/layout/RoleHeader/RoleHeader";
import RoleSidebar from "../../components/layout/RoleSidebar/RoleSidebar";
import { useAuth } from "../../context/AuthContext";
import {
  RECEPTIONIST_FOOTER_ITEMS,
  RECEPTIONIST_NAV_ITEMS,
} from "./receptionistNavigation";
import "./receptionistPage.css";

function ReceptionistPageShell({
  children,
  contentClassName,
  contentLabelledBy,
}) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="receptionist-page">
      <RoleSidebar
        ariaLabel="Dieu huong le tan"
        navItems={RECEPTIONIST_NAV_ITEMS}
        footerItems={RECEPTIONIST_FOOTER_ITEMS}
      />

      <main className="receptionist-page__main">
        <RoleHeader
          isFixed
          roleLabel={user?.role || "receptionist"}
          searchLabel="Tim kiem trong khu vuc le tan"
          showHelp
        />
        <section
          className={`receptionist-page__content${contentClassName ? ` ${contentClassName}` : ""}`}
          aria-labelledby={contentLabelledBy}
        >
          {children}
        </section>
      </main>
    </div>
  );
}

ReceptionistPageShell.propTypes = {
  children: PropTypes.node.isRequired,
  contentClassName: PropTypes.string,
  contentLabelledBy: PropTypes.string,
};

ReceptionistPageShell.defaultProps = {
  contentClassName: "",
  contentLabelledBy: undefined,
};

export default ReceptionistPageShell;
