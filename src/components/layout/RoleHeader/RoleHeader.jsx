import { useState } from "react";
import PropTypes from "prop-types";
import { Bell, Menu, X } from "lucide-react";
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
  admin: "Quan tri vien",
  dentist: "Nha si",
  owner: "Chu phong kham",
  patient: "Benh nhan",
  receptionist: "Le tan",
  staff: "Nhan vien",
};

function getRoleLabel(roleLabel) {
  return ROLE_LABELS[String(roleLabel).toLowerCase()] || roleLabel;
}

function RoleHeader({
  isFixed,
  mobileNavItems,
  onNotificationClick,
  roleLabel,
}) {
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
              isMobileMenuOpen ? "Dong menu dieu huong" : "Mo menu dieu huong"
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
              aria-label="Dieu huong nhanh"
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
        <button
          className="role-header__icon-btn"
          type="button"
          onClick={onNotificationClick}
          aria-label="Thông báo"
        >
          <Bell size={20} aria-hidden="true" />
        </button>

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
  onNotificationClick: PropTypes.func,
  roleLabel: PropTypes.string.isRequired,
};

RoleHeader.defaultProps = {
  isFixed: false,
  mobileNavItems: [],
  onNotificationClick: undefined,
};

export default RoleHeader;
