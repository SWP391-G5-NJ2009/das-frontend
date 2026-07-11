import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  CalendarDays,
  CalendarX,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Plus,
  RefreshCw,
  Save,
  Timer,
  Trash2,
} from "lucide-react";
import OwnerPageShell from "../OwnerPageShell";
import { useWorkingHour } from "../../../hooks/useClinicScheduleManagement";
import "./ScheduleManagementPage.css";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DAY_NAMES = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};

const HOLIDAYS_INITIAL = [
  { date: "Dec 24", label: "Christmas Eve", fullDate: "2024-12-24" },
  { date: "Dec 25", label: "Christmas Day", fullDate: "2024-12-25" },
  { date: "Jan 01", label: "New Year's Day", fullDate: "2025-01-01" },
];

function DayRow({ dayLabel, shifts }) {
  const isClosed = shifts.length === 0;
  return (
    <div
      className={`schedule-config__day-row${isClosed ? " schedule-config__day-row--closed" : ""}`}
    >
      <div className="schedule-config__day-label">
        <span className="schedule-config__day-name">{dayLabel}</span>
      </div>
      <div className="schedule-config__day-controls">
        {isClosed ? (
          <span className="schedule-config__closed-text">Closed</span>
        ) : (
          shifts.map((shift, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="schedule-config__shift-separator">&</span>}
              <span className="schedule-config__shift-time">
                {shift.start_time.slice(0, 5)} - {shift.end_time.slice(0, 5)}
              </span>
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
}

DayRow.propTypes = {
  dayLabel: PropTypes.string.isRequired,
  shifts: PropTypes.arrayOf(
    PropTypes.shape({
      start_time: PropTypes.string.isRequired,
      end_time: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const CALENDAR_DAYS = [
  { day: 24, faded: true },
  { day: 25, faded: true },
  { day: 26, faded: true },
  { day: 27, faded: true },
  { day: 28, faded: true },
  { day: 29, faded: true },
  { day: 30, faded: true },
  { day: 1, faded: false },
  { day: 2, faded: false },
  { day: 3, faded: false },
  { day: 4, faded: false },
  { day: 5, faded: false },
  { day: 6, faded: false },
  { day: 7, faded: false },
  { day: 8, faded: false },
  { day: 9, faded: false },
  { day: 10, faded: false },
  { day: 11, faded: false },
  { day: 12, faded: false },
  { day: 13, faded: false },
  { day: 14, faded: false },
  { day: 15, faded: false },
  { day: 16, faded: false },
  { day: 17, faded: false },
  { day: 18, faded: false },
  { day: 19, faded: false },
  { day: 20, faded: false },
  { day: 21, faded: false },
  { day: 22, faded: false },
  { day: 23, faded: false },
  { day: 24, faded: false, holiday: true },
  { day: 25, faded: false, holiday: true },
  { day: 26, faded: false },
  { day: 27, faded: false },
  { day: 28, faded: false },
  { day: 29, faded: false },
  { day: 30, faded: false },
  { day: 31, faded: false, holiday: true },
];

function ScheduleManagementPage() {
  const { data: workingHour, isLoading, error } = useWorkingHour();

  const [appointmentDuration, setAppointmentDuration] = useState(30);
  const [timeSlot, setTimeSlot] = useState([
    "08:00 AM",
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "BREAK",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
  ]);

  const [shiftBreak, setShiftBreak] = useState("60");
  const [appointmentBuffer, setAppointmentBuffer] = useState("0");
  const [allowOverbooking, setAllowOverbooking] = useState(false);
  const [holidays, setHolidays] = useState(HOLIDAYS_INITIAL);
  const [saveState, setSaveState] = useState("idle");

  const handleDeleteHoliday = (index) => {
    setHolidays((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    }, 1000);
  };

  const handleReset = () => {
    setAppointmentDuration("30");
    setShiftBreak("60");
    setAppointmentBuffer("0");
    setAllowOverbooking(false);
  };

  return (
    <OwnerPageShell contentClassName="schedule-config-page">
      <div className="schedule-config">
        <header className="schedule-config__header">
          <div>
            <h1 className="schedule-config__title">Configuration Dashboard</h1>
            <p className="schedule-config__subtitle">
              Update clinical hours, appointment logic, and holiday calendars.
            </p>
          </div>
          <div className="schedule-config__header-actions">
            <button
              className="schedule-config__btn schedule-config__btn--secondary"
              onClick={handleReset}
            >
              Reset to Defaults
            </button>
            <button
              className={`schedule-config__btn schedule-config__btn--primary${saveState !== "idle" ? " schedule-config__btn--loading" : ""}`}
              onClick={handleSave}
              disabled={saveState !== "idle"}
            >
              {saveState === "saving" ? (
                <RefreshCw size={18} className="schedule-config__btn-icon schedule-config__btn-icon--spin" />
              ) : saveState === "saved" ? (
                <CheckCircle size={18} className="schedule-config__btn-icon" />
              ) : (
                <Save size={18} className="schedule-config__btn-icon" />
              )}
              {saveState === "saving"
                ? "Updating..."
                : saveState === "saved"
                  ? "Saved Successfully"
                  : "Save Changes"}
            </button>
          </div>
        </header>

        <div className="schedule-config__grid">
          <div className="schedule-config__left">
            <section className="schedule-config__card">
              <div className="schedule-config__card-header">
                <Clock size={24} className="schedule-config__card-icon" />
                <h2 className="schedule-config__card-title">
                  Operational Hours
                </h2>
              </div>
              <div className="schedule-config__day-list">
                {DAYS.map((day) => {
                  const dayNum = Object.entries(DAY_NAMES).find(([, v]) => v === day)?.[0];
                  const shifts = workingHour?.filter((s) => String(s.day_of_week) === dayNum) ?? [];
                  return (
                    <DayRow
                      key={day}
                      dayLabel={day}
                      shifts={shifts}
                    />
                  );
                })}
              </div>
            </section>

            <section className="schedule-config__card">
              <div className="schedule-config__card-header">
                <Timer size={24} className="schedule-config__card-icon" />
                <h2 className="schedule-config__card-title">
                  Time Management Logic
                </h2>
              </div>
              <div className="schedule-config__form-grid">
                <div className="schedule-config__field">
                  <label className="schedule-config__field-label">
                    Default Appointment Duration
                  </label>
                  <select
                    className="schedule-config__select"
                    value={appointmentDuration}
                    onChange={(e) => setAppointmentDuration(e.target.value)}
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes</option>
                    <option value="90">90 Minutes</option>
                  </select>
                  <p className="schedule-config__field-hint">
                    The standard slot size for new bookings.
                  </p>
                </div>
                <div className="schedule-config__field">
                  <label className="schedule-config__field-label">
                    Shift Break
                  </label>
                  <select
                    className="schedule-config__select"
                    value={shiftBreak}
                    onChange={(e) => setShiftBreak(e.target.value)}
                  >
                    <option value="30">30 Minutes</option>
                    <option value="60">60 Minutes (Lunch)</option>
                    <option value="90">90 Minutes</option>
                    <option value="none">No Shift Break</option>
                  </select>
                  <p className="schedule-config__field-hint">
                    Break period between morning and afternoon shifts (e.g.,
                    lunch)
                  </p>
                </div>
                <div className="schedule-config__field">
                  <label className="schedule-config__field-label">
                    Appointment Buffer
                  </label>
                  <select
                    className="schedule-config__select"
                    value={appointmentBuffer}
                    onChange={(e) => setAppointmentBuffer(e.target.value)}
                  >
                    <option value="0">0 Minutes</option>
                    <option value="5">5 Minutes</option>
                    <option value="10">10 Minutes</option>
                    <option value="15">15 Minutes</option>
                  </select>
                  <p className="schedule-config__field-hint">
                    Minutes between individual appointments
                  </p>
                </div>
                <div className="schedule-config__field schedule-config__field--disabled">
                  <label className="schedule-config__field-label">
                    Emergency Buffer
                  </label>
                  <select
                    className="schedule-config__select"
                    disabled
                  >
                    <option>Auto-calculated</option>
                  </select>
                  <p className="schedule-config__field-hint">
                    Reserved capacity for urgent walk-ins.
                  </p>
                </div>
                <div className="schedule-config__field--full">
                  <div className="schedule-config__toggle-row">
                    <div>
                      <p className="schedule-config__toggle-row-title">
                        Allow Online Overbooking
                      </p>
                      <p className="schedule-config__toggle-row-desc">
                        Enable patients to request slots during filled times for
                        emergencies.
                      </p>
                    </div>
                    <label className="schedule-config__toggle">
                      <input
                        className="schedule-config__toggle-input"
                        type="checkbox"
                        checked={allowOverbooking}
                        onChange={(e) =>
                          setAllowOverbooking(e.target.checked)
                        }
                      />
                      <span className="schedule-config__toggle-track" />
                    </label>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="schedule-config__right">
            <section className="schedule-config__card">
              <div className="schedule-config__card-header">
                <div className="schedule-config__card-header-row">
                  <div className="schedule-config__card-header-left">
                    <CalendarDays size={24} className="schedule-config__card-icon" />
                    <h2 className="schedule-config__card-title">
                      Schedule Preview
                    </h2>
                  </div>
                  <span className="schedule-config__preview-label">
                    Typical Monday View
                  </span>
                </div>
              </div>
              <div className="schedule-config__preview-grid">
                {timeSlot.map((slot, i) =>
                  slot === "BREAK" ? (
                    <div
                      key={i}
                      className="schedule-config__preview-break"
                    >
                      <Coffee size={20} className="schedule-config__preview-break-icon" />
                      <span>Shift Break (12:00 PM - 01:00 PM)</span>
                    </div>
                  ) : (
                    <div
                      key={i}
                      className="schedule-config__preview-slot"
                    >
                      {slot}
                    </div>
                  ),
                )}
              </div>
              <p className="schedule-config__preview-note">
                * Preview based on 30-minute duration and 60-minute shift break.
              </p>
            </section>
            <section className="schedule-config__card schedule-config__card--sticky">
              <div className="schedule-config__holiday-header">
                <div className="schedule-config__card-header">
                  <CalendarX size={24} className="schedule-config__card-icon" />
                  <h2 className="schedule-config__card-title">
                    Clinic Holidays
                  </h2>
                </div>
                <button className="schedule-config__btn-add">
                  <Plus size={20} />
                  Add Day
                </button>
              </div>

              <div className="schedule-config__calendar">
                <div className="schedule-config__calendar-header">
                  <span className="schedule-config__calendar-month">
                    December 2024
                  </span>
                  <div className="schedule-config__calendar-nav">
                    <button className="schedule-config__calendar-nav-btn">
                      <ChevronLeft size={20} />
                    </button>
                    <button className="schedule-config__calendar-nav-btn">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
                <div className="schedule-config__calendar-weekdays">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <div key={d} className="schedule-config__calendar-weekday">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="schedule-config__calendar-days">
                  {CALENDAR_DAYS.map((item, i) => (
                    <div
                      key={i}
                      className={`schedule-config__calendar-day${item.faded ? " schedule-config__calendar-day--faded" : ""}${item.holiday ? " schedule-config__calendar-day--holiday" : ""}`}
                    >
                      {item.day}
                    </div>
                  ))}
                </div>
              </div>

              <div className="schedule-config__holiday-list">
                <h3 className="schedule-config__holiday-list-title">
                  Upcoming Closures
                </h3>
                {holidays.map((h, i) => (
                  <div
                    key={i}
                    className="schedule-config__holiday-item"
                  >
                    <div className="schedule-config__holiday-item-left">
                      <div className="schedule-config__holiday-date-box">
                        <span className="schedule-config__holiday-date-month">
                          {h.date.split(" ")[0]}
                        </span>
                        <span className="schedule-config__holiday-date-day">
                          {h.date.split(" ")[1]}
                        </span>
                      </div>
                      <div>
                        <p className="schedule-config__holiday-name">
                          {h.label}
                        </p>
                        <p className="schedule-config__holiday-type">
                          Closed all day
                        </p>
                      </div>
                    </div>
                    <button
                      className="schedule-config__holiday-delete"
                      onClick={() => handleDeleteHoliday(i)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="schedule-config__holiday-footer">
                <button className="schedule-config__btn schedule-config__btn--import">
                  Import Public Holidays
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </OwnerPageShell>
  );
}

export default ScheduleManagementPage;
