import PropTypes from "prop-types";
import { Bell } from "lucide-react";
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
  onNotificationClick,
  roleLabel,
  searchLabel,
  searchPlaceholder,
}) {
  const { user } = useAuth();
  const displayName = getDisplayName(user);
  const initials = getInitials(displayName);

  return (
    <header className={`role-header${isFixed ? " role-header--fixed" : ""}`}>
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
            <p className="role-header__profile-role">{getRoleLabel(roleLabel)}</p>
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
  onNotificationClick: PropTypes.func,
  roleLabel: PropTypes.string.isRequired,
  searchLabel: PropTypes.string,
  searchPlaceholder: PropTypes.string,
};

RoleHeader.defaultProps = {
  isFixed: false,
  onNotificationClick: undefined,
  searchLabel: "Tìm kiếm",
  searchPlaceholder: "Tìm tài khoản, tên hoặc vai trò...",
};

export default RoleHeader;
