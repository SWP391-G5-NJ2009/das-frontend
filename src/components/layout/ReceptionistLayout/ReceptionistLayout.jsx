import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import RoleHeader from "../RoleHeader/RoleHeader";
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

function ReceptionistLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

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
        <RoleHeader
          roleLabel={user?.role || "Receptionist"}
          searchLabel="Tìm kiếm"
          showHelp
        />

        <div className="receptionist-layout__content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default ReceptionistLayout;
