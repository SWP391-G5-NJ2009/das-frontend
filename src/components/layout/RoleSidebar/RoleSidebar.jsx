import PropTypes from "prop-types";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CalendarPlus,
  CalendarRange,
  ClipboardList,
  CreditCard,
  DoorOpen,
  Headphones,
  HelpCircle,
  History,
  LogOut,
  Settings,
  Shield,
  Stethoscope,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import "./RoleSidebar.css";

const ICONS = {
  analytics: BarChart3,
  assessment: BarChart3,
  assignment: ClipboardList,
  business: Building2,
  calendar_month: CalendarRange,
  calendar_plus: CalendarPlus,
  calendar_today: CalendarDays,
  group: Users,
  help: HelpCircle,
  history: History,
  logout: LogOut,
  medical_services: Stethoscope,
  meeting_room: DoorOpen,
  notifications: Bell,
  payments: CreditCard,
  person: User,
  person_add: UserPlus,
  security: Shield,
  settings: Settings,
  support_agent: Headphones,
  work: BriefcaseBusiness,
};

function renderIcon(item) {
  if (item.Icon) {
    const Icon = item.Icon;
    return <Icon size={20} aria-hidden="true" />;
  }

  if (item.icon) {
    const Icon = ICONS[item.icon] || HelpCircle;
    return <Icon size={20} aria-hidden="true" />;
  }

  return null;
}

function RoleSidebar({ ariaLabel, brand, footerItems, navItems }) {
  const handleFooterClick = (item) => {
    item.onClick?.();
  };

  return (
    <aside className="role-sidebar">
      <div className="role-sidebar__brand">
        <h1 className="role-sidebar__brand-name">{brand}</h1>
      </div>

      <nav className="role-sidebar__nav" aria-label={ariaLabel}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `role-sidebar__nav-item${isActive ? " role-sidebar__nav-item--active" : ""}`
            }
          >
            {renderIcon(item)}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="role-sidebar__footer">
        {footerItems.map((item) => (
          <button
            key={item.label}
            className="role-sidebar__nav-item"
            type="button"
            onClick={() => handleFooterClick(item)}
          >
            {renderIcon(item)}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

const sidebarItemShape = PropTypes.shape({
  end: PropTypes.bool,
  icon: PropTypes.string,
  Icon: PropTypes.elementType,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  to: PropTypes.string,
});

RoleSidebar.propTypes = {
  ariaLabel: PropTypes.string,
  brand: PropTypes.string,
  footerItems: PropTypes.arrayOf(sidebarItemShape),
  navItems: PropTypes.arrayOf(sidebarItemShape).isRequired,
};

RoleSidebar.defaultProps = {
  ariaLabel: "Role navigation",
  brand: "DentalCare",
  footerItems: [],
};

export default RoleSidebar;
