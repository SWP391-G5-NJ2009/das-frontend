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

  return (<div className="request-filters">

    <div
      className="request-filters__tabs"
      role="tablist"
      aria-label="Lọc theo trạng thái"
    >
      <label className="request-filters__date-label">Trạng thái</label>
      {STATUS_TABS.map((tab) => (
        <button
          key={tab.value}
          id={`request-filter-tab-${tab.value}`}
          role="tab"
          type="button"
          aria-selected={filters.status === tab.value}
          className={`request-filters__tab${filters.status === tab.value ? " request-filters__tab--active" : ""
            }`}
          onClick={() => onStatusChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>

    <div className="request-filters__controls">
      <div className="request-filters__search-wrap">
        <Search
          size={16}
          className="request-filters__search-icon"
          aria-hidden="true"
        />
        <input
          id="request-filter-search"
          type="text"
          className="request-filters__search"
          placeholder="Tìm theo họ tên, số điện thoại, email, hoặc nội dung tin nhắn"
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Tìm yêu cầu tư vấn"
        />
        {filters.search && (
          <button
            type="button"
            className="request-filters__search-clear"
            aria-label="Xóa tìm kiếm"
            onClick={() => onSearchChange("")}
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      <label className="request-filters__date-label">Từ ngày</label>
      <div className="request-filters__date-wrap">
        <input
          id="request-filter-date-from"
          type="date"
          className="request-filters__date"
          max={today}
          value={filters.from_date}
          onChange={(e) => onFromDateChange(e.target.value)}
          aria-label="Lọc từ ngày"
        />
        {filters.from_date && (
          <button
            type="button"
            className="request-filters__date-clear"
            aria-label="Xóa bộ lọc từ ngày"
            onClick={() => {
              onFromDateChange("")
              onToDateChange("")
            }}
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      <label className="request-filters__date-label">Đến ngày</label>
      <div className="request-filters__date-wrap">
        <input
          id="request-filter-date-to"
          type="date"
          className="request-filters__date"
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
            className="request-filters__date-clear"
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
