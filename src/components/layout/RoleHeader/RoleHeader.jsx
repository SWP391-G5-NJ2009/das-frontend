import { useState } from "react";
import PropTypes from "prop-types";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./RoleHeader.css";

function getDisplayName(user) {
  return (
    user?.fullName ||
    user?.name ||
    user?.username ||
    user?.email ||
    "DentalCare User"
  );
}

function getInitials(name) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return initials || "DC";
}

const ROLE_LABELS = {
  admin: "Admin",
  dentist: "Dentist",
  owner: "Clinic Owner",
  patient: "Patient",
  receptionist: "Receptionist",
};

function getRoleLabel(roleLabel) {
  return ROLE_LABELS[String(roleLabel).toLowerCase()] || roleLabel;
}

function RoleHeader({ isFixed, mobileNavItems, roleLabel }) {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const displayName = getDisplayName(user);
  const initials = getInitials(displayName);
  const hasMobileNav = mobileNavItems.length > 0;

  return (
    <header className={`role-header${isFixed ? " role-header--fixed" : ""}`}>
      {hasMobileNav && (
        <div className="role-header__mobile-nav">
          <button
            className="role-header__icon-btn role-header__menu-btn"
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-label={
              isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            {isMobileMenuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>

          {isMobileMenuOpen && (
            <nav
              className="role-header__mobile-menu"
              aria-label="Quick navigation"
            >
              {mobileNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `role-header__mobile-menu-item${isActive ? " role-header__mobile-menu-item--active" : ""}`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      )}

      <div className="role-header__actions">
        <div className="role-header__divider" />

        <div className="role-header__profile">
          <div className="role-header__profile-info">
            <p className="role-header__profile-name">{displayName}</p>
            <p className="role-header__profile-role">
              {getRoleLabel(roleLabel)}
            </p>
          </div>
          <div className="role-header__avatar" aria-hidden="true">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}

RoleHeader.propTypes = {
  isFixed: PropTypes.bool,
  mobileNavItems: PropTypes.arrayOf(
    PropTypes.shape({
      end: PropTypes.bool,
      label: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
    }),
  ),
  roleLabel: PropTypes.string.isRequired,
};

RoleHeader.defaultProps = {
  isFixed: false,
  mobileNavItems: [],
};

export default RoleHeader;
