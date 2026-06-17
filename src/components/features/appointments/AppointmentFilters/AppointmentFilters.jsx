import PropTypes from "prop-types";
import { Search, X } from "lucide-react";
import "./AppointmentFilters.css";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Checked-in", label: "Checked-in" },
  { value: "Completed", label: "Completed" },
  { value: "Conflict", label: "Conflict" },
  { value: "Cancelled", label: "Cancelled" },
  { value: "No-Show", label: "No-Show" },
  { value: "Resolved No-Show", label: "Resolved No-Show" },
];

function AppointmentFilters({
  filters,
  onStatusChange,
  onDateChange,
  onSearchChange,
  statusOptions,
}) {
  const tabs = statusOptions ?? STATUS_TABS;

  return (
    <div className="appt-filters">
      {/* Status tab strip */}
      <div
        className="appt-filters__tabs"
        role="tablist"
        aria-label="Filter by status"
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            id={`appt-filter-tab-${tab.value}`}
            role="tab"
            type="button"
            aria-selected={filters.status === tab.value}
            className={`appt-filters__tab${
              filters.status === tab.value ? " appt-filters__tab--active" : ""
            }`}
            onClick={() => onStatusChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + date row */}
      <div className="appt-filters__controls">
        <div className="appt-filters__search-wrap">
          <Search
            size={16}
            className="appt-filters__search-icon"
            aria-hidden="true"
          />
          <input
            id="appt-filter-search"
            type="text"
            className="appt-filters__search"
            placeholder="Search by patient, service, dentist..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search appointments"
          />
          {filters.search && (
            <button
              type="button"
              className="appt-filters__search-clear"
              aria-label="Clear search"
              onClick={() => onSearchChange("")}
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="appt-filters__date-wrap">
          <input
            id="appt-filter-date"
            type="date"
            className="appt-filters__date"
            value={filters.date}
            onChange={(e) => onDateChange(e.target.value)}
            aria-label="Filter by date"
          />
          {filters.date && (
            <button
              type="button"
              className="appt-filters__date-clear"
              aria-label="Clear date filter"
              onClick={() => onDateChange("")}
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

AppointmentFilters.propTypes = {
  filters: PropTypes.shape({
    status: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
  }).isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  statusOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
};

AppointmentFilters.defaultProps = {
  statusOptions: null,
};

export default AppointmentFilters;
