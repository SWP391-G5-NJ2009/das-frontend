import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  AlertTriangle,
  Ban,
  CalendarCheck,
  Clock,
  Plus,
  RefreshCw,
  Send,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Spinner from "../../../components/common/Spinner/Spinner";
import { scheduleService } from "../../../services/schedule.service";
import DentistPageShell from "../DentistPageShell";
import "./DentistScheduleManagement.css";

const WEEKDAYS = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 0, label: "Sun" },
];

const SHIFT_PRESETS = [
  { id: "morning", label: "Morning", startTime: "08:00", endTime: "12:00" },
  { id: "afternoon", label: "Afternoon", startTime: "13:00", endTime: "17:00" },
  { id: "full", label: "Full day", startTime: "08:00", endTime: "17:00" },
  { id: "custom", label: "Custom", startTime: "08:00", endTime: "12:00" },
];

const STATUS_COPY = {
  Pending: {
    className: "dentist-schedule__status dentist-schedule__status--pending",
    label: "Pending owner approval",
  },
  Scheduled: {
    className: "dentist-schedule__status dentist-schedule__status--approved",
    label: "Published",
  },
  Denied: {
    className: "dentist-schedule__status dentist-schedule__status--denied",
    label: "Denied",
  },
};

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonday(date) {
  const next = new Date(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  return next;
}

function getNextMonthBounds() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);

  return {
    isOpen: now.getDate() <= 15,
    allowedFromDay: 1,
    allowedToDay: 15,
    targetMonthStart: toIsoDate(start),
    targetMonthEnd: toIsoDate(end),
  };
}

function toTimeValue(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

function toFullCalendarTime(value, fallback) {
  const normalized = String(value || fallback).slice(0, 5);
  return `${normalized}:00`;
}

function getDefaultForm() {
  const nextMonth = getNextMonthBounds();

  return {
    applyForMonth: true,
    startDate: nextMonth.targetMonthStart,
    endDate: nextMonth.targetMonthEnd,
    weekdays: [1, 3],
    roomId: "",
    shiftPreset: "morning",
    startTime: "08:00",
    endTime: "12:00",
  };
}

function formatScheduleTime(schedule) {
  if (!schedule.startTime || !schedule.endTime) return "No slots selected";
  return `${schedule.startTime} - ${schedule.endTime}`;
}

function getEventColors(status) {
  if (status === "Scheduled") {
    return {
      backgroundColor: "#e8f5e9",
      borderColor: "#2e7d32",
      textColor: "#1b5e20",
    };
  }

  if (status === "Denied") {
    return {
      backgroundColor: "#ffebee",
      borderColor: "#c62828",
      textColor: "#8e0000",
    };
  }

  return {
    backgroundColor: "#fff3e0",
    borderColor: "#e65100",
    textColor: "#7a3500",
  };
}

function getSlotClass(status) {
  const key = String(status || "").toLowerCase();
  return `dentist-schedule__slot dentist-schedule__slot--${key || "neutral"}`;
}

function ScheduleEditor({
  form,
  isSubmitting,
  meta,
  onChange,
  onClose,
  onSubmit,
  onToggleWeekday,
}) {
  const rooms = meta?.rooms || [];
  const clinic = meta?.clinic || { openTime: "08:00", closeTime: "20:00" };
  const scheduleWindow = meta?.scheduleWindow || getNextMonthBounds();
  const canSubmit = scheduleWindow.isOpen !== false;

  return (
    <div className="dentist-schedule__modal-overlay" role="presentation">
      <section
        className="dentist-schedule__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-editor-title"
      >
        <header className="dentist-schedule__modal-header">
          <div>
            <h2 id="schedule-editor-title">Create/Edit Schedule</h2>
            <p>
              Register next month's working schedule between day 1 and day 15.
            </p>
          </div>
          <button
            className="dentist-schedule__icon-btn"
            type="button"
            onClick={onClose}
            aria-label="Close schedule editor"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <form className="dentist-schedule__form" onSubmit={onSubmit}>
          <div className="dentist-schedule__rule-note">
            Clinic hours: {clinic.openTime} - {clinic.closeTime}. Target month:{" "}
            {scheduleWindow.targetMonthStart} to {scheduleWindow.targetMonthEnd}.
          </div>

          {!canSubmit && (
            <div className="dentist-schedule__notice dentist-schedule__notice--error">
              Schedule editing is closed. Dentists can edit next month's
              schedule only from day 1 to day 15.
            </div>
          )}

          <label className="dentist-schedule__checkbox">
            <input
              type="checkbox"
              name="applyForMonth"
              checked={form.applyForMonth}
              onChange={onChange}
            />
            <span>Apply selected working days for all next month</span>
          </label>

          <div className="dentist-schedule__form-grid">
            <label className="dentist-schedule__field">
              <span>Start date</span>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                min={scheduleWindow.targetMonthStart}
                max={scheduleWindow.targetMonthEnd}
                onChange={onChange}
                disabled={form.applyForMonth}
                required
              />
            </label>
            <label className="dentist-schedule__field">
              <span>End date</span>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                min={form.startDate || scheduleWindow.targetMonthStart}
                max={scheduleWindow.targetMonthEnd}
                onChange={onChange}
                disabled={form.applyForMonth}
                required
              />
            </label>
          </div>

          <fieldset className="dentist-schedule__weekday-group">
            <legend>Working days</legend>
            <div className="dentist-schedule__weekday-list">
              {WEEKDAYS.map((day) => (
                <button
                  key={day.value}
                  className={`dentist-schedule__weekday${
                    form.weekdays.includes(day.value)
                      ? " dentist-schedule__weekday--active"
                      : ""
                  }`}
                  type="button"
                  onClick={() => onToggleWeekday(day.value)}
                  aria-pressed={form.weekdays.includes(day.value)}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="dentist-schedule__field">
            <span>Treatment room</span>
            <select
              name="roomId"
              value={form.roomId}
              onChange={onChange}
              required
            >
              <option value="">Select room</option>
              {rooms.map((room) => (
                <option key={room.room_id} value={room.room_id}>
                  Room {room.room_name} - {room.specialization || "General"}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="dentist-schedule__shift-group">
            <legend>Working hours</legend>
            <div className="dentist-schedule__shift-list">
              {SHIFT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  className={`dentist-schedule__shift${
                    form.shiftPreset === preset.id
                      ? " dentist-schedule__shift--active"
                      : ""
                  }`}
                  type="button"
                  onClick={() =>
                    onChange({
                      target: {
                        name: "shiftPreset",
                        value: preset.id,
                        dataset: {
                          startTime: preset.startTime,
                          endTime: preset.endTime,
                        },
                      },
                    })
                  }
                  aria-pressed={form.shiftPreset === preset.id}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="dentist-schedule__form-grid">
            <label className="dentist-schedule__field">
              <span>Start time</span>
              <input
                type="time"
                name="startTime"
                value={form.startTime}
                min={clinic.openTime}
                max={clinic.closeTime}
                step="1800"
                onChange={onChange}
                required
              />
            </label>
            <label className="dentist-schedule__field">
              <span>End time</span>
              <input
                type="time"
                name="endTime"
                value={form.endTime}
                min={clinic.openTime}
                max={clinic.closeTime}
                step="1800"
                onChange={onChange}
                required
              />
            </label>
          </div>

          <footer className="dentist-schedule__modal-actions">
            <button
              className="dentist-schedule__button dentist-schedule__button--secondary"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="dentist-schedule__button dentist-schedule__button--primary"
              type="submit"
              disabled={isSubmitting || !canSubmit}
            >
              <Send size={16} aria-hidden="true" />
              {isSubmitting ? "Verifying..." : "Verify Schedule"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function ConflictWarningModal({
  affectedAppointments,
  isSubmitting,
  onCancel,
  onForce,
}) {
  return (
    <div className="dentist-schedule__modal-overlay" role="presentation">
      <section
        className="dentist-schedule__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="availability-conflict-title"
      >
        <header className="dentist-schedule__modal-header dentist-schedule__modal-header--warning">
          <div>
            <h2 id="availability-conflict-title">MSG25: Confirmed appointments found</h2>
            <p>Review affected patients before force-blocking the selected time.</p>
          </div>
          <button
            className="dentist-schedule__icon-btn"
            type="button"
            onClick={onCancel}
            aria-label="Close conflict warning"
            disabled={isSubmitting}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="dentist-schedule__conflict-body">
          <div className="dentist-schedule__warning-box">
            <AlertTriangle size={20} aria-hidden="true" />
            <span>
              Force blocking will mark these appointments as Conflict and push
              them to receptionist rescheduling.
            </span>
          </div>

          <div className="dentist-schedule__conflict-list">
            {affectedAppointments.map((appointment) => (
              <article
                className="dentist-schedule__conflict-item"
                key={appointment.appointmentId}
              >
                <strong>{appointment.patientName}</strong>
                <span>{appointment.patientPhone || "No phone"}</span>
                <span>{appointment.serviceName}</span>
                <span>
                  {appointment.date} {appointment.time}
                </span>
              </article>
            ))}
          </div>
        </div>

        <footer className="dentist-schedule__modal-actions dentist-schedule__conflict-actions">
          <button
            className="dentist-schedule__button dentist-schedule__button--secondary"
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel Change
          </button>
          <button
            className="dentist-schedule__button dentist-schedule__button--danger"
            type="button"
            onClick={onForce}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Blocking..." : "Force Block & Delegate Rescheduling"}
          </button>
        </footer>
      </section>
    </div>
  );
}

function DentistScheduleManagement() {
  const [calendarRange, setCalendarRange] = useState(() => {
    const start = getMonday(new Date());
    return {
      dateFrom: toIsoDate(start),
      dateTo: toIsoDate(addDays(start, 6)),
    };
  });
  const [availabilityReason, setAvailabilityReason] = useState("");
  const [availabilityScope, setAvailabilityScope] = useState("slots");
  const [conflictWarning, setConflictWarning] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(getDefaultForm);
  const [isAvailabilitySubmitting, setIsAvailabilitySubmitting] =
    useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [meta, setMeta] = useState({
    rooms: [],
    timeSlots: [],
    clinic: { openTime: "08:00", closeTime: "20:00" },
    scheduleWindow: getNextMonthBounds(),
  });
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedSlotIds, setSelectedSlotIds] = useState([]);

  const fetchSchedules = useCallback(
    async (range = calendarRange) => {
      setIsLoading(true);
      setError(null);

      try {
        const [metaData, scheduleData] = await Promise.all([
          scheduleService.getMeta(),
          scheduleService.getMine(range),
        ]);

        const nextMeta = metaData || {};
        setMeta((prevMeta) => ({
          ...prevMeta,
          ...nextMeta,
          clinic: nextMeta.clinic || prevMeta.clinic,
          scheduleWindow: nextMeta.scheduleWindow || prevMeta.scheduleWindow,
        }));
        setSchedules(scheduleData || []);
        setForm((prevForm) => ({
          ...prevForm,
          roomId: prevForm.roomId || String(nextMeta.rooms?.[0]?.room_id || ""),
          ...(prevForm.applyForMonth && nextMeta.scheduleWindow
            ? {
                startDate: nextMeta.scheduleWindow.targetMonthStart,
                endDate: nextMeta.scheduleWindow.targetMonthEnd,
              }
            : {}),
        }));
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [calendarRange],
  );

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const events = useMemo(
    () =>
      schedules.map((schedule) => ({
        id: schedule.id,
        title: `${formatScheduleTime(schedule)} - ${schedule.status}`,
        start: `${schedule.date}T${schedule.startTime || "08:00"}:00`,
        end: `${schedule.date}T${schedule.endTime || "08:30"}:00`,
        extendedProps: schedule,
        ...getEventColors(schedule.status),
      })),
    [schedules],
  );

  const stats = useMemo(
    () => ({
      pending: schedules.filter((schedule) => schedule.status === "Pending").length,
      published: schedules.filter((schedule) => schedule.status === "Scheduled").length,
      denied: schedules.filter((schedule) => schedule.status === "Denied").length,
    }),
    [schedules],
  );

  const scheduleWindow = meta.scheduleWindow || getNextMonthBounds();
  const canEditSchedule = scheduleWindow.isOpen !== false;
  const selectedAvailabilitySlots = useMemo(() => {
    if (!selectedSchedule) return [];

    if (availabilityScope === "shift") {
      return selectedSchedule.slots.filter(
        (slot) => slot.status !== "Unavailable",
      );
    }

    return selectedSchedule.slots.filter((slot) =>
      selectedSlotIds.includes(slot.slot_id),
    );
  }, [availabilityScope, selectedSchedule, selectedSlotIds]);

  const openEditor = () => {
    if (!canEditSchedule) {
      setError(
        new Error(
          "Schedule editing is closed. Dentists can edit next month's schedule only from day 1 to day 15.",
        ),
      );
      return;
    }

    setForm((prevForm) => ({
      ...prevForm,
      roomId: prevForm.roomId || String(meta.rooms?.[0]?.room_id || ""),
      ...(prevForm.applyForMonth
        ? {
            startDate: scheduleWindow.targetMonthStart,
            endDate: scheduleWindow.targetMonthEnd,
          }
        : {}),
    }));
    setIsEditorOpen(true);
    setSelectedSchedule(null);
    setSelectedSlotIds([]);
    setMessage("");
  };

  const handleSelectCalendarRange = (selectionInfo) => {
    if (!canEditSchedule) return;

    const selectedStart = new Date(selectionInfo.start);
    const selectedEnd = selectionInfo.allDay
      ? addDays(new Date(selectionInfo.end), -1)
      : new Date(selectionInfo.end.getTime() - 1);
    const selectedEndTime = new Date(selectionInfo.end);

    setForm((prevForm) => ({
      ...prevForm,
      applyForMonth: false,
      startDate: toIsoDate(selectedStart),
      endDate: toIsoDate(selectedEnd),
      weekdays: [selectedStart.getDay()],
      roomId: prevForm.roomId || String(meta.rooms?.[0]?.room_id || ""),
      ...(!selectionInfo.allDay
        ? {
            startTime: toTimeValue(selectedStart),
            endTime: toTimeValue(selectedEndTime),
            shiftPreset: "custom",
          }
        : {}),
    }));
    setIsEditorOpen(true);
    setMessage("");
  };

  const handleDatesSet = (dateInfo) => {
    const end = addDays(new Date(dateInfo.end), -1);
    const nextRange = {
      dateFrom: toIsoDate(new Date(dateInfo.start)),
      dateTo: toIsoDate(end),
    };

    setCalendarRange((prevRange) => {
      if (
        prevRange.dateFrom === nextRange.dateFrom &&
        prevRange.dateTo === nextRange.dateTo
      ) {
        return prevRange;
      }

      fetchSchedules(nextRange);
      return nextRange;
    });
  };

  const handleInputChange = (event) => {
    const { checked, dataset, name, type, value } = event.target;

    if (name === "applyForMonth") {
      setForm((prevForm) => ({
        ...prevForm,
        applyForMonth: checked,
        ...(checked
          ? {
              startDate: scheduleWindow.targetMonthStart,
              endDate: scheduleWindow.targetMonthEnd,
            }
          : {}),
      }));
      return;
    }

    if (name === "shiftPreset") {
      setForm((prevForm) => ({
        ...prevForm,
        shiftPreset: value,
        startTime: dataset.startTime,
        endTime: dataset.endTime,
      }));
      return;
    }

    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "startTime" || name === "endTime"
        ? { shiftPreset: "custom" }
        : {}),
    }));
  };

  const handleToggleWeekday = (day) => {
    setForm((prevForm) => {
      const nextWeekdays = prevForm.weekdays.includes(day)
        ? prevForm.weekdays.filter((item) => item !== day)
        : [...prevForm.weekdays, day].sort((first, second) => first - second);

      return { ...prevForm, weekdays: nextWeekdays };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage("");

    try {
      const saved = await scheduleService.submitMine({
        startDate: form.startDate,
        endDate: form.endDate,
        weekdays: form.weekdays,
        roomId: Number(form.roomId),
        startTime: form.startTime,
        endTime: form.endTime,
        reason: "Dentist updated monthly work schedule.",
      });

      setMessage(
        `MSG22: ${saved.length} schedule request${
          saved.length === 1 ? "" : "s"
        } sent for owner approval.`,
      );
      setIsEditorOpen(false);
      await fetchSchedules();
    } catch (err) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectSchedule = (schedule) => {
    setSelectedSchedule(schedule);
    setSelectedSlotIds([]);
    setAvailabilityReason("");
    setAvailabilityScope("slots");
  };

  const toggleSlotSelection = (slotId) => {
    setSelectedSlotIds((prevIds) =>
      prevIds.includes(slotId)
        ? prevIds.filter((id) => id !== slotId)
        : [...prevIds, slotId],
    );
  };

  const submitAvailabilityUpdate = async (payload) => {
    setIsAvailabilitySubmitting(true);
    setError(null);
    setMessage("");

    try {
      const result = await scheduleService.updateAvailability(payload);
      setMessage(result.message || "MSG24: Availability updated successfully.");
      setAvailabilityReason("");
      setSelectedSlotIds([]);
      setConflictWarning(null);
      await fetchSchedules();
    } catch (err) {
      if (err.code === "SLOT_HAS_CONFIRMED_APPOINTMENTS") {
        setConflictWarning({
          payload,
          affectedAppointments: err.details?.affectedAppointments || [],
        });
      } else {
        setError(err);
      }
    } finally {
      setIsAvailabilitySubmitting(false);
    }
  };

  const handleAvailabilitySubmit = (event) => {
    event.preventDefault();

    if (!selectedSchedule) return;

    const slotIds = selectedAvailabilitySlots.map((slot) => slot.slot_id);

    submitAvailabilityUpdate({
      scope: availabilityScope,
      scheduleId:
        availabilityScope === "shift" ? selectedSchedule.schedule_id : undefined,
      slotIds,
      reason: availabilityReason,
    });
  };

  const handleForceBlock = () => {
    if (!conflictWarning) return;

    submitAvailabilityUpdate({
      ...conflictWarning.payload,
      force: true,
    });
  };

  return (
    <DentistPageShell>
      <div className="dentist-schedule">
        <header className="dentist-schedule__header">
          <div>
            <p className="dentist-schedule__eyebrow">My Schedule</p>
            <h1>Schedule Management</h1>
            <p className="dentist-schedule__subtitle">
              Manage monthly working shifts and block emergency unavailable
              slots when needed.
            </p>
          </div>
          <div className="dentist-schedule__header-actions">
            <button
              className="dentist-schedule__button dentist-schedule__button--secondary"
              type="button"
              onClick={() => fetchSchedules()}
            >
              <RefreshCw size={16} aria-hidden="true" />
              Refresh
            </button>
            <button
              className="dentist-schedule__button dentist-schedule__button--primary"
              type="button"
              onClick={openEditor}
              disabled={!canEditSchedule}
              title={
                canEditSchedule
                  ? "Create/Edit Schedule"
                  : "Schedule editing opens from day 1 to day 15"
              }
            >
              <Plus size={16} aria-hidden="true" />
              Create/Edit Schedule
            </button>
          </div>
        </header>

        <section className="dentist-schedule__summary" aria-label="Schedule summary">
          <div>
            <span>{stats.pending}</span>
            <p>Pending</p>
          </div>
          <div>
            <span>{stats.published}</span>
            <p>Published</p>
          </div>
          <div>
            <span>{stats.denied}</span>
            <p>Denied</p>
          </div>
        </section>

        {!canEditSchedule && (
          <div className="dentist-schedule__notice dentist-schedule__notice--warning">
            Monthly schedule editing is closed. Availability blocking remains
            available for published emergency changes.
          </div>
        )}

        {message && (
          <div className="dentist-schedule__notice dentist-schedule__notice--success">
            <CalendarCheck size={18} aria-hidden="true" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="dentist-schedule__notice dentist-schedule__notice--error">
            <span>{error.message || "Unable to load schedule."}</span>
          </div>
        )}

        <section className="dentist-schedule__workspace">
          <div className="dentist-schedule__calendar" aria-busy={isLoading}>
            {isLoading && (
              <div className="dentist-schedule__loading">
                <Spinner />
              </div>
            )}
            <FullCalendar
              allDaySlot={false}
              datesSet={handleDatesSet}
              editable={false}
              eventClick={(info) => selectSchedule(info.event.extendedProps)}
              events={events}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "timeGridWeek,timeGridDay",
              }}
              height="auto"
              initialView="timeGridWeek"
              nowIndicator
              plugins={[timeGridPlugin, interactionPlugin]}
              selectable={canEditSchedule}
              select={handleSelectCalendarRange}
              slotDuration="00:30:00"
              slotMinTime={toFullCalendarTime(meta.clinic?.openTime, "08:00")}
              slotMaxTime={toFullCalendarTime(meta.clinic?.closeTime, "20:00")}
            />
          </div>

          <aside className="dentist-schedule__details" aria-label="Schedule details">
            <h2>Selected shift</h2>
            {selectedSchedule ? (
              <div className="dentist-schedule__details-body">
                <span
                  className={
                    STATUS_COPY[selectedSchedule.status]?.className ||
                    STATUS_COPY.Pending.className
                  }
                >
                  {STATUS_COPY[selectedSchedule.status]?.label ||
                    selectedSchedule.status}
                </span>
                <dl>
                  <div>
                    <dt>Date</dt>
                    <dd>{selectedSchedule.date}</dd>
                  </div>
                  <div>
                    <dt>Time</dt>
                    <dd>{formatScheduleTime(selectedSchedule)}</dd>
                  </div>
                  <div>
                    <dt>Room</dt>
                    <dd>{selectedSchedule.roomName}</dd>
                  </div>
                  <div>
                    <dt>Slots</dt>
                    <dd>{selectedSchedule.slotCount}</dd>
                  </div>
                </dl>

                {selectedSchedule.status === "Denied" && (
                  <div className="dentist-schedule__owner-note" role="alert">
                    <strong>MSG23: Request denied</strong>
                    <p>{selectedSchedule.ownerNote || "No owner note provided."}</p>
                  </div>
                )}

                {selectedSchedule.status === "Scheduled" && (
                  <form
                    className="dentist-schedule__availability-form"
                    onSubmit={handleAvailabilitySubmit}
                  >
                    <h3>Update availability</h3>
                    <label className="dentist-schedule__checkbox">
                      <input
                        type="checkbox"
                        checked={availabilityScope === "shift"}
                        onChange={(event) =>
                          setAvailabilityScope(
                            event.target.checked ? "shift" : "slots",
                          )
                        }
                      />
                      <span>Block entire shift</span>
                    </label>

                    <div className="dentist-schedule__slot-list">
                      {selectedSchedule.slots.map((slot) => (
                        <button
                          key={slot.slot_id}
                          className={`${getSlotClass(slot.status)}${
                            selectedSlotIds.includes(slot.slot_id)
                              ? " dentist-schedule__slot--selected"
                              : ""
                          }`}
                          type="button"
                          disabled={
                            availabilityScope === "shift" ||
                            slot.status === "Unavailable"
                          }
                          onClick={() => toggleSlotSelection(slot.slot_id)}
                          aria-pressed={selectedSlotIds.includes(slot.slot_id)}
                        >
                          <span>
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <strong>{slot.status}</strong>
                        </button>
                      ))}
                    </div>

                    <label className="dentist-schedule__field">
                      <span>Reason</span>
                      <textarea
                        value={availabilityReason}
                        onChange={(event) =>
                          setAvailabilityReason(event.target.value)
                        }
                        rows="4"
                        required
                        placeholder="Emergency, sudden illness, leave..."
                      />
                    </label>

                    <button
                      className="dentist-schedule__button dentist-schedule__button--danger"
                      type="submit"
                      disabled={
                        isAvailabilitySubmitting ||
                        selectedAvailabilitySlots.length === 0
                      }
                    >
                      <Ban size={16} aria-hidden="true" />
                      {isAvailabilitySubmitting
                        ? "Updating..."
                        : "Update Status"}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="dentist-schedule__empty-details">
                <Clock size={22} aria-hidden="true" />
                <p>Select a shift on the calendar to view or update slots.</p>
              </div>
            )}
          </aside>
        </section>

        {isEditorOpen && (
          <ScheduleEditor
            form={form}
            isSubmitting={isSubmitting}
            meta={meta}
            onChange={handleInputChange}
            onClose={() => setIsEditorOpen(false)}
            onSubmit={handleSubmit}
            onToggleWeekday={handleToggleWeekday}
          />
        )}

        {conflictWarning && (
          <ConflictWarningModal
            affectedAppointments={conflictWarning.affectedAppointments}
            isSubmitting={isAvailabilitySubmitting}
            onCancel={() => setConflictWarning(null)}
            onForce={handleForceBlock}
          />
        )}
      </div>
    </DentistPageShell>
  );
}

export default DentistScheduleManagement;
