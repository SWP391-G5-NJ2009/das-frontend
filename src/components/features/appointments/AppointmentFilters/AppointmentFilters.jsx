import PropTypes from "prop-types";
import { Search, X, CalendarCheck } from "lucide-react";
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

/* ── Helpers ── */
const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function getDaysInMonth(year, month) {
  if (!year || !month) return 31;
  return new Date(Number(year), Number(month), 0).getDate();
}

function buildYearOptions() {
  const current = new Date().getFullYear();
  const years = [];
  for (let y = current + 1; y >= current - 4; y--) {
    years.push(String(y));
  }
  return years;
}

/* ── Component ── */
function AppointmentFilters({
  filters,
  onStatusChange,
  onDatePartsChange,
  onSearchChange,
  onTodayClick,
  isTodayActive,
  statusOptions,
}) {
  const tabs = statusOptions ?? STATUS_TABS;

  const { year, month, day } = filters;
  const daysInMonth = getDaysInMonth(year, month);
  const dayOptions = Array.from({ length: daysInMonth }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );
  const yearOptions = buildYearOptions();

  /* ── Handlers ── */
  function handleYearChange(e) {
    const newYear = e.target.value;
    // Clamp day if needed when month/year combo has fewer days
    const newDays = newYear && month ? getDaysInMonth(newYear, month) : 31;
    const clampedDay = day && Number(day) > newDays ? "" : day;
    onDatePartsChange({ year: newYear, month: newYear ? month : "", day: clampedDay });
  }

  function handleMonthChange(e) {
    const newMonth = e.target.value;
    const newDays = year && newMonth ? getDaysInMonth(year, newMonth) : 31;
    const clampedDay = day && Number(day) > newDays ? "" : day;
    onDatePartsChange({ year, month: newMonth, day: clampedDay });
  }

  function handleDayChange(e) {
    onDatePartsChange({ year, month, day: e.target.value });
  }

  function clearYear() {
    onDatePartsChange({ year: "", month: "", day: "" });
  }
  function clearMonth() {
    onDatePartsChange({ year, month: "", day: "" });
  }
  function clearDay() {
    onDatePartsChange({ year, month, day: "" });
  }

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

      {/* Search + date pickers row */}
      <div className="appt-filters__controls">
        {/* Search */}
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

        {/* Date selectors — Year / Month / Day */}
        <div className="appt-filters__date-group">
          {/* Today shortcut button */}
          <button
            id="appt-filter-today-btn"
            type="button"
            className={`appt-filters__today-btn${
              isTodayActive ? " appt-filters__today-btn--active" : ""
            }`}
            onClick={onTodayClick}
            aria-label="Filter appointments for today"
            aria-pressed={isTodayActive}
          >
            <CalendarCheck size={14} aria-hidden="true" />
            Today
          </button>

          {/* Year */}
          <div className="appt-filters__select-wrap">
            <select
              id="appt-filter-year"
              className={`appt-filters__select${year ? " appt-filters__select--active" : ""}`}
              value={year}
              onChange={handleYearChange}
              aria-label="Filter by year"
            >
              <option value="">-- Year --</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            {year && (
              <button
                type="button"
                className="appt-filters__select-clear"
                aria-label="Clear year filter"
                onClick={clearYear}
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Month — only enabled when a year is chosen */}
          <div className="appt-filters__select-wrap">
            <select
              id="appt-filter-month"
              className={`appt-filters__select${
                !year
                  ? " appt-filters__select--disabled"
                  : month
                  ? " appt-filters__select--active"
                  : ""
              }`}
              value={month}
              onChange={handleMonthChange}
              disabled={!year}
              aria-label="Filter by month"
            >
              <option value="">-- Month --</option>
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            {month && (
              <button
                type="button"
                className="appt-filters__select-clear"
                aria-label="Clear month filter"
                onClick={clearMonth}
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Day — only enabled when year + month are chosen */}
          <div className="appt-filters__select-wrap">
            <select
              id="appt-filter-day"
              className={`appt-filters__select${
                !month
                  ? " appt-filters__select--disabled"
                  : day
                  ? " appt-filters__select--active"
                  : ""
              }`}
              value={day}
              onChange={handleDayChange}
              disabled={!month}
              aria-label="Filter by day"
            >
              <option value="">-- Day --</option>
              {dayOptions.map((d) => (
                <option key={d} value={d}>
                  Day {Number(d)}
                </option>
              ))}
            </select>
            {day && (
              <button
                type="button"
                className="appt-filters__select-clear"
                aria-label="Clear day filter"
                onClick={clearDay}
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

AppointmentFilters.propTypes = {
  filters: PropTypes.shape({
    status: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    month: PropTypes.string.isRequired,
    day: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
  }).isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onDatePartsChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onTodayClick: PropTypes.func.isRequired,
  isTodayActive: PropTypes.bool,
  statusOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
};

AppointmentFilters.defaultProps = {
  isTodayActive: false,
  statusOptions: null,
};

export default AppointmentFilters;
