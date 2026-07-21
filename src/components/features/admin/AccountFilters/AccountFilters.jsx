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

const today = new Date().toISOString().split("T")[0];

function AccountFilters({
  filters,
  onStatusChange,
  onFromDateChange,
  onToDateChange,
  onSearchChange,
  statusOptions,
}) {
  const tabs = statusOptions ?? STATUS_TABS;

  return (<div className="account-filters">

    <div
      className="account-filters__tabs"
      role="tablist"
      aria-label="Lọc theo trạng thái"
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          id={`account-filter-tab-${tab.value}`}
          role="tab"
          type="button"
          aria-selected={filters.status === tab.value}
          className={`account-filters__tab${filters.status === tab.value ? " account-filters__tab--active" : ""
            }`}
          onClick={() => onStatusChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>

    <div className="account-filters__controls">
      <div className="account-filters__search-wrap">
        <Search
          size={16}
          className="account-filters__search-icon"
          aria-hidden="true"
        />
        <input
          id="account-filter-search"
          type="text"
          className="account-filters__search"
          placeholder="Tìm theo bệnh nhân, dịch vụ, nha sĩ..."
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Tìm lịch hẹn"
        />
        {filters.search && (
          <button
            type="button"
            className="account-filters__search-clear"
            aria-label="Xóa tìm kiếm"
            onClick={() => onSearchChange("")}
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      <label className="account-filters__date-label">Từ ngày</label>
      <div className="account-filters__date-wrap">
        <input
          id="account-filter-date"
          type="date"
          className="account-filters__date"
          max={today}
          value={filters.from_date}
          onChange={(e) => onFromDateChange(e.target.value)}
          aria-label="Lọc từ ngày"
        />
        {filters.from_date && (
          <button
            type="button"
            className="account-filters__date-clear"
            aria-label="Xóa bộ lọc từ ngày"
            onClick={() => onFromDateChange("")}
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      <label className="account-filters__date-label">Đến ngày</label>
      <div className="account-filters__date-wrap">
        <input
          id="account-filter-date"
          type="date"
          className="account-filters__date"
          min={filters.from_date}
          max={today}
          disabled={!filters.from_date}
          value={filters.to_date}
          onChange={(e) => onToDateChange(e.target.value)}
          aria-label="Lọc đến ngày"
        />
        {filters.to_date && (
          <button
            type="button"
            className="account-filters__date-clear"
            aria-label="Xóa bộ lọc đến ngày"
            onClick={() => onToDateChange("")}
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
