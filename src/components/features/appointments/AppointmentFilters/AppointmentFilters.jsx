import PropTypes from "prop-types";
import { Search, X } from "lucide-react";
import "./AppointmentFilters.css";

const STATUS_TABS = [
  { value: "all", label: "Tất cả" },
  { value: "Waiting", label: "Chờ xác nhận" },
  { value: "Confirmed", label: "Đã xác nhận" },
  { value: "Checked-in", label: "Đã check-in" },
  { value: "In-Treatment", label: "Đang điều trị" },
  { value: "Completed", label: "Hoàn thành" },
  { value: "Cancelled", label: "Đã hủy" },
  { value: "No-Show", label: "Không đến" },
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
        aria-label="Lọc theo trạng thái"
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
            placeholder="Tìm theo tên, dịch vụ, bác sĩ..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Tìm kiếm lịch hẹn"
          />
          {filters.search && (
            <button
              type="button"
              className="appt-filters__search-clear"
              aria-label="Xóa tìm kiếm"
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
            aria-label="Lọc theo ngày"
          />
          {filters.date && (
            <button
              type="button"
              className="appt-filters__date-clear"
              aria-label="Xóa lọc ngày"
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
  /** Override the status tab list (optional) */
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
