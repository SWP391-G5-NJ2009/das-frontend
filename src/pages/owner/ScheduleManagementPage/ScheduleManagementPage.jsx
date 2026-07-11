import React, { useState, useEffect, useMemo } from "react";
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
import { useWorkingHour, useClinicSetting } from "../../../hooks/useClinicScheduleManagement";
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

function ShiftInputRow({ startTime, endTime, onChange }) {
  return (
    <span className="schedule-config__shift-input-row">
      <input
        className="schedule-config__time-input"
        type="time"
        value={startTime}
        onChange={(e) => onChange("start_time", e.target.value)}
      />
      <span className="schedule-config__time-separator">-</span>
      <input
        className="schedule-config__time-input"
        type="time"
        value={endTime}
        onChange={(e) => onChange("end_time", e.target.value)}
      />
    </span>
  );
}

ShiftInputRow.propTypes = {
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

function DayRow({ dayLabel, shifts, isActive, onClick, editable, onShiftChange, onAddShift, onRemoveShift }) {
  const isClosed = shifts.length === 0;
  return (
    <div
      className={`schedule-config__day-row${isClosed ? " schedule-config__day-row--closed" : ""}${isActive ? " schedule-config__day-row--active" : ""}`}
    >
      <div className="schedule-config__day-label">
        <span className="schedule-config__day-name">{dayLabel}</span>
        <button
          className="schedule-config__preview-btn"
          onClick={onClick}
        >
          Preview
        </button>
      </div>
      <div className="schedule-config__day-controls">
        {isClosed ? (
          <span className="schedule-config__closed-text">Closed</span>
        ) : editable ? (
          shifts.map((shift, i) => (
            <React.Fragment key={i}>
              <div className="schedule-config__shift-line">
                {shifts.length > 1 && (
                  <span className="schedule-config__shift-label">
                    {i === 0 ? "Shift 1" : i === 1 ? "Shift 2" : `Shift ${i + 1}`}
                  </span>
                )}
                <ShiftInputRow
                  startTime={shift.shift_start}
                  endTime={shift.shift_end}
                  onChange={(field, value) => onShiftChange(dayLabel, i, field, value)}
                />
                <button
                  className="schedule-config__shift-action"
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onRemoveShift(dayLabel, i); }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </React.Fragment>
          ))
        ) : (
          shifts.map((shift, i) => (
            <React.Fragment key={i}>
              <div className="schedule-config__shift-line">
                {shifts.length > 1 && (
                  <span className="schedule-config__shift-label">
                    {i === 0 ? "Shift 1" : i === 1 ? "Shift 2" : `Shift ${i + 1}`}
                  </span>
                )}
                <span className="schedule-config__shift-time">
                  {shift.shift_start.slice(0, 5)} - {shift.shift_end.slice(0, 5)}
                </span>
              </div>
            </React.Fragment>
          ))
        )}
        {editable && (
          <button
            className="schedule-config__shift-action schedule-config__shift-action--add"
            type="button"
            onClick={(e) => { e.stopPropagation(); onAddShift(dayLabel); }}
          >
            <Plus size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

DayRow.propTypes = {
  dayLabel: PropTypes.string.isRequired,
  shifts: PropTypes.arrayOf(
    PropTypes.shape({
      shift_start: PropTypes.string.isRequired,
      shift_end: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  editable: PropTypes.bool,
  onShiftChange: PropTypes.func,
  onAddShift: PropTypes.func,
  onRemoveShift: PropTypes.func,
};

DayRow.defaultProps = {
  isActive: false,
  onClick: null,
  editable: false,
  onShiftChange: null,
  onAddShift: null,
  onRemoveShift: null,
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
  const { data: workingHour } = useWorkingHour();
  const { data: clinicSetting } = useClinicSetting();

  const [appointmentDuration, setAppointmentDuration] = useState("30");
  const [appointmentBuffer, setAppointmentBuffer] = useState("0");
  const [allowOverbooking, setAllowOverbooking] = useState(false);
  const [bookingLeadDays, setBookingLeadDays] = useState("30");
  const [maxBookingPerSlot, setMaxBookingPerSlot] = useState("1");
  const [holidays, setHolidays] = useState(HOLIDAYS_INITIAL);
  const [saveState, setSaveState] = useState("idle");
  const [selectedDay, setSelectedDay] = useState("Monday");

  useEffect(() => {
    if (clinicSetting) {
      if (clinicSetting.slot_duration_minutes) setAppointmentDuration(String(clinicSetting.slot_duration_minutes));
      if (clinicSetting.appointment_buffer_minutes) setAppointmentBuffer(String(clinicSetting.appointment_buffer_minutes));
      if (clinicSetting.booking_lead_days) setBookingLeadDays(String(clinicSetting.booking_lead_days));
      if (clinicSetting.max_booking_per_slot) setMaxBookingPerSlot(String(clinicSetting.max_booking_per_slot));
    }
  }, [clinicSetting]);

  const [editableShifts, setEditableShifts] = useState([]);
  const [isEditingHours, setIsEditingHours] = useState(false);

  useEffect(() => {
    if (workingHour) {
      setEditableShifts(workingHour.map((s) => ({
        ...s,
        shift_start: s.start_time?.slice(0, 5) ?? "08:00",
        shift_end: s.end_time?.slice(0, 5) ?? "17:00",
      })));
    }
  }, [workingHour]);

  const selectedDayNum = Object.entries(DAY_NAMES).find(([, v]) => v === selectedDay)?.[0];
  const selectedShifts = editableShifts.filter((s) => String(s.day_of_week) === selectedDayNum) ?? [];

  function handleShiftChange(dayLabel, shiftIndex, field, value) {
    const dayNum = Object.entries(DAY_NAMES).find(([, v]) => v === dayLabel)?.[0];
    setEditableShifts((prev) =>
      prev.map((s, i) =>
        String(s.day_of_week) === dayNum && i === shiftIndex
          ? { ...s, [field === "start_time" ? "shift_start" : "shift_end"]: value }
          : s,
      ),
    );
  }

  function handleAddShift(dayLabel) {
    const dayNum = Object.entries(DAY_NAMES).find(([, v]) => v === dayLabel)?.[0];
    setEditableShifts((prev) => [
      ...prev,
      { day_of_week: Number(dayNum), working_hour_id: null, shift_start: "08:00", shift_end: "17:00" },
    ]);
  }

  function handleRemoveShift(dayLabel, shiftIndex) {
    const dayNum = Object.entries(DAY_NAMES).find(([, v]) => v === dayLabel)?.[0];
    setEditableShifts((prev) =>
      prev.filter((s, i) => !(String(s.day_of_week) === dayNum && i === shiftIndex)),
    );
  }

  const timeSlots = useMemo(() => {
    if (!selectedShifts.length) return [];
    const duration = Number(appointmentDuration);
    const slots = [];

    selectedShifts.forEach((shift, si) => {
      if (si > 0) {
        const prevEnd = selectedShifts[si - 1].shift_end.slice(0, 5);
        const currStart = shift.shift_start.slice(0, 5);
        slots.push({ type: "break", label: `Shift Break (${prevEnd} - ${currStart})` });
      }

      const [startH, startM] = shift.shift_start.slice(0, 5).split(":").map(Number);
      const [endH, endM] = shift.shift_end.slice(0, 5).split(":").map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      for (let m = startMinutes; m + duration <= endMinutes; m += duration) {
        const h = Math.floor(m / 60);
        const min = m % 60;
        const label = `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
        slots.push({ type: "slot", label });
      }
    });

    return slots;
  }, [selectedShifts, appointmentDuration]);

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
    setAppointmentBuffer("0");
    setAllowOverbooking(false);
    setBookingLeadDays("30");
    setMaxBookingPerSlot("1");
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
                <button
                  className={`schedule-config__edit-toggle${isEditingHours ? " schedule-config__edit-toggle--active" : ""}`}
                  onClick={() => setIsEditingHours((v) => !v)}
                >
                  {isEditingHours ? "Done Editing" : "Edit Hours"}
                </button>
              </div>
              <div className="schedule-config__day-list">
                {DAYS.map((day) => {
                  const dayNum = Object.entries(DAY_NAMES).find(([, v]) => v === day)?.[0];
                  const shifts = editableShifts.filter((s) => String(s.day_of_week) === dayNum) ?? [];
                  return (
                    <DayRow
                      key={day}
                      dayLabel={day}
                      shifts={shifts}
                      isActive={day === selectedDay}
                      onClick={() => setSelectedDay(day)}
                      editable={isEditingHours}
                      onShiftChange={handleShiftChange}
                      onAddShift={handleAddShift}
                      onRemoveShift={handleRemoveShift}
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
                    Slot Duration
                  </label>
                  <select
                    className="schedule-config__select"
                    value={appointmentDuration}
                    onChange={(e) => setAppointmentDuration(e.target.value)}
                  >
                    <option value="10">10 Minutes</option>
                    <option value="15">15 Minutes</option>
                    <option value="20">20 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="45">45 Minutes</option>
                    <option value="60">60 Minutes</option>
                  </select>
                  <p className="schedule-config__field-hint">
                    The slot size for new bookings.
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
                    Minutes between appointments
                  </p>
                </div>
                <div className="schedule-config__field">
                  <label className="schedule-config__field-label">
                    Booking Lead Days
                  </label>
                  <select
                    className="schedule-config__select"
                    value={bookingLeadDays}
                    onChange={(e) => setBookingLeadDays(e.target.value)}
                  >
                    <option value="7">7 Days</option>
                    <option value="14">14 Days</option>
                    <option value="30">30 Days</option>
                    <option value="60">60 Days</option>
                    <option value="90">90 Days</option>
                  </select>
                  <p className="schedule-config__field-hint">
                    How far in advance patients can book
                  </p>
                </div>
                <div className="schedule-config__field">
                  <label className="schedule-config__field-label">
                    Max Bookings Per Slot
                  </label>
                  <select
                    className="schedule-config__select"
                    value={maxBookingPerSlot}
                    onChange={(e) => setMaxBookingPerSlot(e.target.value)}
                  >
                    <option value="1">1 Booking</option>
                    <option value="2">2 Bookings</option>
                    <option value="3">3 Bookings</option>
                    <option value="5">5 Bookings</option>
                  </select>
                  <p className="schedule-config__field-hint">
                    Maximum number of bookings per slot
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
            <section className="schedule-config__card schedule-config__preview--sticky">
              <div className="schedule-config__card-header">
                <div className="schedule-config__card-header-row">
                  <div className="schedule-config__card-header-left">
                    <CalendarDays size={24} className="schedule-config__card-icon" />
                    <h2 className="schedule-config__card-title">
                      Schedule Preview
                    </h2>
                  </div>
                  <span className="schedule-config__preview-label">
                    {selectedDay} View
                  </span>
                </div>
              </div>
              <div className="schedule-config__preview-grid">
                {timeSlots.length === 0 ? (
                  <p className="schedule-config__empty-text">No schedule data for {selectedDay}.</p>
                ) : timeSlots.map((slot, i) =>
                  slot.type === "break" ? (
                    <div
                      key={i}
                      className="schedule-config__preview-break"
                    >
                      <Coffee size={20} className="schedule-config__preview-break-icon" />
                      <span>{slot.label}</span>
                    </div>
                  ) : (
                    <div
                      key={i}
                      className="schedule-config__preview-slot"
                    >
                      {slot.label}
                    </div>
                  ),
                )}
              </div>
              <p className="schedule-config__preview-note">
                * Preview based on {appointmentDuration}-minute duration and {selectedDay}&apos;s operational hours.
              </p>
            </section>
          </div>
        </div>

        <section className="schedule-config__card schedule-config__card--holidays">
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

          <div className="schedule-config__holiday-body">
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
        </div>

        <div className="schedule-config__holiday-footer">
          <button className="schedule-config__btn schedule-config__btn--import">
            Import Public Holidays
          </button>
        </div>
        </section>
      </div>
    </OwnerPageShell>
  );
}

export default ScheduleManagementPage;
