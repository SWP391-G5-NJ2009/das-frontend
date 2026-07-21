import PropTypes from "prop-types";
import { Search, X } from "lucide-react";
import "./RequestFilters.css";

const STATUS_TABS = [
  { value: "All", label: "Tất cả" },
  { value: "Pending", label: "Đang chờ" },
  { value: "Resolved", label: "Đã xử lý" },
  { value: "Spam", label: "Spam" },
  { value: "Fail-to-contact", label: "Không liên hệ được" },
  { value: "Other", label: "Khác" },
];

const today = new Date().toISOString().split("T")[0];

function RequestFilters({
  filters,
  onStatusChange,
  onFromDateChange,
  onToDateChange,
  onSearchChange,
}) {

  return (<div className="appt-filters">

    <div
      className="appt-filters__tabs"
      role="tablist"
      aria-label="Lọc theo trạng thái"
    >
      <label className="account-filters__date-label">Trạng thái</label>
      {STATUS_TABS.map((tab) => (
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
          placeholder="Tìm theo họ tên, số điện thoại, email, hoặc nội dung tin nhắn"
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

RequestFilters.defaultProps = {};

export default RequestFilters;
