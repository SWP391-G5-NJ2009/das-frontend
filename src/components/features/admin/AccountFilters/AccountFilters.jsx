import PropTypes from "prop-types";
import { Search, X } from "lucide-react";
import "./AccountFilters.css";

const STATUS_TABS = [
  { value: "All", label: "Tất cả" },
  { value: "Admin", label: "Admin" },
  { value: "Owner", label: "Chủ phòng khám" },
  { value: "Receptionist", label: "Lễ tân" },
  { value: "Dentist", label: "Nha sĩ" },
  { value: "Patient", label: "Bệnh nhân" },
];

function AccountFilters({
  filters,
  onStatusChange,
  onDateChange,
  onSearchChange,
  statusOptions,
}) {
  const tabs = statusOptions ?? STATUS_TABS;

  return (<div className="appt-filters">

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
          className={`appt-filters__tab${filters.status === tab.value ? " appt-filters__tab--active" : ""
            }`}
          onClick={() => onStatusChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>

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
          placeholder="Tìm theo bệnh nhân, dịch vụ, nha sĩ..."
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Tìm lịch hẹn"
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
            aria-label="Xóa bộ lọc ngày"
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

AccountFilters.defaultProps = {
  statusOptions: null,
};

export default AccountFilters;
