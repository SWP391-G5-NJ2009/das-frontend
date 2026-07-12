import React, { useState, useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import {
  CalendarX,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { clinicScheduleManagementService } from "../../../../services/clinicScheduleManagement.service";
import "./ClinicHolidays.css";

function generateCalendarDays(year, month, holidays, closedDays) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const days = [];

  for (let i = 0; i < startWeekday; i++) {
    days.push({ day: null, faded: true, holiday: false, regularClosure: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${monthNames[month - 1]} ${d}`;
    const isHoliday = holidays.some((h) => h.date === dateStr);
    const jsDay = new Date(year, month - 1, d).getDay();
    const dayOfWeek = (jsDay + 6) % 7 + 1;
    const isRegularClosure = closedDays.has(dayOfWeek);
    days.push({ day: d, faded: false, holiday: isHoliday, regularClosure: isRegularClosure });
  }

  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 0; i < remaining; i++) {
    days.push({ day: null, faded: true, holiday: false, regularClosure: false });
  }

  return { days, monthLabel: `${monthNames[month - 1]} ${year}` };
}

function ClinicHolidays({ closures, closedDays, onRefetchClosures }) {
  const [holidays, setHolidays] = useState([]);
  const holidaysRef = useRef([]);
  const now = new Date();
  const [calendarYear, setCalendarYear] = useState(now.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(now.getMonth() + 1);
  const [selectedClosure, setSelectedClosure] = useState(null);
  const [selectedDayFullDate, setSelectedDayFullDate] = useState(null);
  const [showAddClosure, setShowAddClosure] = useState(false);
  const [addClosureDate, setAddClosureDate] = useState("");
  const [addClosureReason, setAddClosureReason] = useState("");
  const [addClosureError, setAddClosureError] = useState(null);
  const [addClosureSubmitting, setAddClosureSubmitting] = useState(false);

  useEffect(() => {
    if (closures) {
      const mapped = closures.map((c) => {
        const dateOnly = String(c.closure_date).slice(0, 10);
        const [y, m, dayNum] = dateOnly.split("-").map(Number);
        const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        const dateStr = `${monthNames[m - 1]} ${dayNum}`;
        return {
          date: dateStr,
          fullDate: dateOnly,
          label: c.reason || "Closure",
          closureId: c.closure_id,
          isClosed: c.is_closed,
        };
      });
      setHolidays(mapped);
      holidaysRef.current = mapped;
    }
  }, [closures]);

  const calendarData = useMemo(
    () => generateCalendarDays(calendarYear, calendarMonth, holidays, closedDays),
    [calendarYear, calendarMonth, holidays, closedDays],
  );

  const monthHolidays = useMemo(
    () => holidays.filter((h) => {
      const [y, m] = h.fullDate.split("-").map(Number);
      return y === calendarYear && m === calendarMonth;
    }),
    [holidays, calendarYear, calendarMonth],
  );

  const handleDayClick = (dayItem) => {
    if (dayItem.faded || dayItem.day == null) return;
    const fullDate = `${calendarYear}-${String(calendarMonth).padStart(2, "0")}-${String(dayItem.day).padStart(2, "0")}`;
    setSelectedDayFullDate(fullDate);
    const closure = holidaysRef.current.find((h) => h.fullDate === fullDate) || null;
    setSelectedClosure(closure);
  };

  const handlePrevMonth = () => {
    setSelectedClosure(null);
    setSelectedDayFullDate(null);
    if (calendarMonth === 1) {
      setCalendarYear((y) => y - 1);
      setCalendarMonth(12);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    setSelectedClosure(null);
    setSelectedDayFullDate(null);
    if (calendarMonth === 12) {
      setCalendarYear((y) => y + 1);
      setCalendarMonth(1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const handleDeleteHoliday = async (closureId) => {
    try {
      await clinicScheduleManagementService.deleteClosure(closureId);
      const next = (prev) => prev.filter((h) => h.closureId !== closureId);
      setHolidays(next);
      holidaysRef.current = next(holidaysRef.current);
    } catch {
      // silently fail
    }
  };

  const handleAddClosure = async (e) => {
    e.preventDefault();
    setAddClosureError(null);
    if (!addClosureDate) {
      setAddClosureError("Please select a date.");
      return;
    }
    setAddClosureSubmitting(true);
    try {
      await clinicScheduleManagementService.createClosure(addClosureDate, addClosureReason || null);
      setShowAddClosure(false);
      setAddClosureDate("");
      setAddClosureReason("");
      await onRefetchClosures();
    } catch (err) {
      setAddClosureError(err.message);
    } finally {
      setAddClosureSubmitting(false);
    }
  };

  return (
    <>
      <section className="clinic-holidays clinic-holidays__card">
        <div className="clinic-holidays__header">
          <div className="clinic-holidays__header-left">
            <CalendarX size={24} className="clinic-holidays__icon" />
            <h2 className="clinic-holidays__title">Clinic Holidays</h2>
          </div>
          <button className="clinic-holidays__btn-add" onClick={() => setShowAddClosure(true)}>
            <Plus size={20} />
            Add Day
          </button>
        </div>

        <div className="clinic-holidays__body">
          <div className="clinic-holidays__calendar">
            <div className="clinic-holidays__calendar-header">
              <span className="clinic-holidays__calendar-month">
                {calendarData.monthLabel}
              </span>
              <div className="clinic-holidays__calendar-nav">
                <button className="clinic-holidays__calendar-nav-btn" onClick={handlePrevMonth}>
                  <ChevronLeft size={20} />
                </button>
                <button className="clinic-holidays__calendar-nav-btn" onClick={handleNextMonth}>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            <div className="clinic-holidays__calendar-weekdays">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="clinic-holidays__calendar-weekday">
                  {d}
                </div>
              ))}
            </div>
            <div className="clinic-holidays__calendar-days">
              {calendarData.days.map((item, i) => {
                const itemFullDate = item.day != null
                  ? `${calendarYear}-${String(calendarMonth).padStart(2, "0")}-${String(item.day).padStart(2, "0")}`
                  : null;
                const isSelectedDay = selectedDayFullDate && itemFullDate && selectedDayFullDate === itemFullDate;
                return (
                  <div
                    key={i}
                    className={`clinic-holidays__calendar-day${item.faded ? " clinic-holidays__calendar-day--faded" : ""}${item.holiday ? " clinic-holidays__calendar-day--holiday" : ""}${item.regularClosure && !item.holiday ? " clinic-holidays__calendar-day--regular-closure" : ""}${isSelectedDay ? " clinic-holidays__calendar-day--selected" : ""}${!item.faded && item.day != null ? " clinic-holidays__calendar-day--clickable" : ""}`}
                    onClick={() => handleDayClick(item)}
                  >
                    {item.day ?? ""}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="clinic-holidays__closure-column">
            <h3 className="clinic-holidays__list-title">Closure Detail</h3>
            {selectedClosure ? (
              <div className="clinic-holidays__item">
                <div className="clinic-holidays__item-left">
                  <div className="clinic-holidays__date-box">
                    <span className="clinic-holidays__date-month">
                      {selectedClosure.date.split(" ")[0].slice(0, 3).toUpperCase()}
                    </span>
                    <span className="clinic-holidays__date-day">
                      {selectedClosure.date.split(" ")[1]}
                    </span>
                  </div>
                  <div>
                    <p className="clinic-holidays__name">{selectedClosure.label}</p>
                    <p className="clinic-holidays__type">Closed all day</p>
                  </div>
                </div>
                <button
                  className="clinic-holidays__delete"
                  onClick={() => { handleDeleteHoliday(selectedClosure.closureId); setSelectedClosure(null); setSelectedDayFullDate(null); }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ) : selectedDayFullDate ? (() => {
              const [sy, sm, sd] = selectedDayFullDate.split("-").map(Number);
              const selectedJsDay = new Date(sy, sm - 1, sd).getDay();
              const selectedDow = (selectedJsDay + 6) % 7 + 1;
              const isRegularClosure = closedDays.has(selectedDow);
              return (
                <p className="clinic-holidays__empty-text">
                  {isRegularClosure
                    ? "Regular closure \u2014 no working hours scheduled for this day."
                    : "No closure recorded for this day."}
                </p>
              );
            })() : (
              <p className="clinic-holidays__empty-text">Click a day to view closure details.</p>
            )}
          </div>

          <div className="clinic-holidays__list">
            <h3 className="clinic-holidays__list-title">Upcoming Closures</h3>
            {monthHolidays.length === 0 ? (
              <p className="clinic-holidays__empty-text">No closures this month.</p>
            ) : monthHolidays.map((h, i) => (
              <div key={i} className="clinic-holidays__item">
                <div className="clinic-holidays__item-left">
                  <div className="clinic-holidays__date-box">
                    <span className="clinic-holidays__date-month">
                      {h.date.split(" ")[0].slice(0, 3).toUpperCase()}
                    </span>
                    <span className="clinic-holidays__date-day">
                      {h.date.split(" ")[1]}
                    </span>
                  </div>
                  <div>
                    <p className="clinic-holidays__name">{h.label}</p>
                    <p className="clinic-holidays__type">Closed all day</p>
                  </div>
                </div>
                <button
                  className="clinic-holidays__delete"
                  onClick={() => handleDeleteHoliday(h.closureId)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showAddClosure && (
        <div
          className="clinic-holidays__modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowAddClosure(false);
          }}
        >
          <div className="clinic-holidays__modal">
            <div className="clinic-holidays__modal-header">
              <h3 className="clinic-holidays__modal-title">Add Clinic Closure</h3>
              <button
                className="clinic-holidays__modal-close"
                type="button"
                onClick={() => setShowAddClosure(false)}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <form className="clinic-holidays__modal-form" onSubmit={handleAddClosure}>
              {addClosureError && (
                <p className="clinic-holidays__modal-error">{addClosureError}</p>
              )}

              <label className="clinic-holidays__modal-field">
                <span className="clinic-holidays__modal-label">Date *</span>
                <input
                  type="date"
                  value={addClosureDate}
                  onChange={(e) => setAddClosureDate(e.target.value)}
                  required
                />
              </label>

              <label className="clinic-holidays__modal-field">
                <span className="clinic-holidays__modal-label">Reason</span>
                <input
                  type="text"
                  placeholder="e.g. Public Holiday"
                  value={addClosureReason}
                  onChange={(e) => setAddClosureReason(e.target.value)}
                  maxLength={255}
                />
              </label>

              <div className="clinic-holidays__modal-actions">
                <button
                  className="clinic-holidays__modal-btn clinic-holidays__modal-btn--cancel"
                  type="button"
                  onClick={() => setShowAddClosure(false)}
                >
                  Cancel
                </button>
                <button
                  className="clinic-holidays__modal-btn clinic-holidays__modal-btn--submit"
                  type="submit"
                  disabled={addClosureSubmitting}
                >
                  {addClosureSubmitting ? "Adding..." : "Add Closure"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

ClinicHolidays.propTypes = {
  closures: PropTypes.arrayOf(
    PropTypes.shape({
      closure_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      closure_date: PropTypes.string.isRequired,
      reason: PropTypes.string,
      is_closed: PropTypes.bool,
    }),
  ),
  closedDays: PropTypes.instanceOf(Set).isRequired,
  onRefetchClosures: PropTypes.func.isRequired,
};

ClinicHolidays.defaultProps = {
  closures: [],
};

export default ClinicHolidays;
