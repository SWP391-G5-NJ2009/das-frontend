import {
  BarChart3,
  Bell,
  CalendarDays,
  ClipboardList,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./ReceptionistLayout.css";

const NAV_ITEMS = [
  {
    label: "Yêu cầu tư vấn",
    to: "/receptionist/consultation-request",
    Icon: ClipboardList,
  },
  {
    label: "Thanh toán",
    to: "/payments",
    Icon: CreditCard,
  },
  {
    label: "Dashboard",
    to: "/receptionist/dashboard",
    Icon: LayoutDashboard,
  },
  {
    label: "Appointments",
    to: "/admin/appointments",
    Icon: CalendarDays,
  },
  {
    label: "Reports",
    to: "/admin/reports",
    Icon: BarChart3,
  },
  {
    label: "Settings",
    to: "/admin/settings",
    Icon: Settings,
  },
];

function getDisplayName(user) {
  return user?.fullName || user?.name || user?.username || "Nguyễn Thu Lễ Tân";
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function ReceptionistLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const displayName = getDisplayName(user);
  const initials = getInitials(displayName);

  const handleLogout = () => {
    logout();
    navigate("/staff/login", { replace: true });
  };

  return (
    <div className="receptionist-layout">
      <aside className="receptionist-layout__sidebar">
        <div className="receptionist-layout__brand">DentalCare</div>

        <nav className="receptionist-layout__nav" aria-label="Điều hướng lễ tân">
          {NAV_ITEMS.map(({ Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? "receptionist-layout__nav-item receptionist-layout__nav-item--active"
                  : "receptionist-layout__nav-item"
              }
            >
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="receptionist-layout__sidebar-footer">
          <button className="receptionist-layout__nav-item" type="button">
            <HelpCircle size={20} aria-hidden="true" />
            <span>Support</span>
          </button>
          <button
            className="receptionist-layout__nav-item"
            type="button"
            onClick={handleLogout}
          >
            <LogOut size={20} aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="receptionist-layout__main">
        <header className="receptionist-layout__header">
          <label className="receptionist-layout__search">
            <Search size={20} aria-hidden="true" />
            <span className="receptionist-layout__sr-only">Tìm kiếm</span>
            <input placeholder="Search for accounts, names or roles..." type="search" />
          </label>

          <div className="receptionist-layout__header-actions">
            <button className="receptionist-layout__icon-btn" type="button">
              <Bell size={22} aria-hidden="true" />
              <span className="receptionist-layout__sr-only">Thông báo</span>
            </button>
            <button className="receptionist-layout__icon-btn" type="button">
              <HelpCircle size={22} aria-hidden="true" />
              <span className="receptionist-layout__sr-only">Trợ giúp</span>
            </button>
            <div className="receptionist-layout__divider" />
            <div className="receptionist-layout__profile">
              <div className="receptionist-layout__profile-info">
                <strong>{displayName}</strong>
                <span>ADMIN</span>
              </div>
              <div className="receptionist-layout__avatar" aria-hidden="true">
                {initials}
              </div>
            </div>
          </div>
        </header>

        <div className="receptionist-layout__content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default ReceptionistLayout;
