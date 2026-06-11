import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import "./RoleSidebar.css";

function renderIcon(item) {
  if (item.Icon) {
    const Icon = item.Icon;
    return <Icon size={20} aria-hidden="true" />;
  }

  if (item.icon) {
    return (
      <span className="material-symbols-outlined" aria-hidden="true">
        {item.icon}
      </span>
    );
  }

  return null;
}

function RoleSidebar({ ariaLabel, brand, footerItems, navItems }) {
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

      {footerItems.length > 0 && (
        <div className="role-sidebar__footer">
          {footerItems.map((item) => {
            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  className="role-sidebar__nav-item"
                  type="button"
                  onClick={item.onClick}
                >
                  {renderIcon(item)}
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="role-sidebar__nav-item"
              >
                {renderIcon(item)}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
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
