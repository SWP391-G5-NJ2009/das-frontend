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

const WEEKDAY_LABELS = {
  1: "T2",
  2: "T3",
  3: "T4",
  4: "T5",
  5: "T6",
  6: "T7",
  0: "CN",
};

const FALLBACK_WEEKDAYS = [
  { value: 1, label: "T2" },
  { value: 2, label: "T3" },
  { value: 3, label: "T4" },
  { value: 4, label: "T5" },
  { value: 5, label: "T6" },
  { value: 6, label: "T7" },
];

const STATUS_COPY = {
  Pending: {
    className: "dentist-schedule__status dentist-schedule__status--pending",
    label: "Chờ quản lý duyệt",
  },
  Scheduled: {
    className: "dentist-schedule__status dentist-schedule__status--approved",
    label: "Đã công bố",
  },
  Denied: {
    className: "dentist-schedule__status dentist-schedule__status--denied",
    label: "Đã từ chối",
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

function dbDayToCalendarDay(day) {
  return Number(day) === 7 ? 0 : Number(day);
}

function sortCalendarWeekdays(days) {
  return [...days].sort((first, second) => {
    const firstOrder = first === 0 ? 7 : first;
    const secondOrder = second === 0 ? 7 : second;
    return firstOrder - secondOrder;
  });
}

function getWeekdayOptions(meta) {
  if (Array.isArray(meta?.workingDays) && meta.workingDays.length === 0) {
    return [];
  }

  const workingDays = (meta?.workingDays || [])
    .map(dbDayToCalendarDay)
    .filter((day) => day >= 0 && day <= 6);

  const options = workingDays.length
    ? workingDays.map((day) => ({
        value: day,
        label: WEEKDAY_LABELS[day],
      }))
    : FALLBACK_WEEKDAYS;

  return options.sort((first, second) => {
    const firstOrder = first.value === 0 ? 7 : first.value;
    const secondOrder = second.value === 0 ? 7 : second.value;
    return firstOrder - secondOrder;
  });
}

function getShiftOptions(meta) {
  if (Array.isArray(meta?.workingHours) && meta.workingHours.length === 0) {
    return [];
  }

  const ranges = [];
  const seenRanges = new Set();

  (meta?.workingHours || []).forEach((hour) => {
    const startTime = hour.startTime;
    const endTime = hour.endTime;
    if (!startTime || !endTime) return;

    const id = `${startTime}-${endTime}`;
    if (seenRanges.has(id)) return;

    seenRanges.add(id);
    ranges.push({
      id,
      label: `${startTime} - ${endTime}`,
      startTime,
      endTime,
    });
  });

  ranges.sort((first, second) => first.startTime.localeCompare(second.startTime));

  const options = [...ranges];
  if (ranges.length > 1) {
    options.unshift({
      id: "configured-day",
      label: "Configured day",
      startTime: ranges[0].startTime,
      endTime: ranges[ranges.length - 1].endTime,
    });
  }

  const fallbackStart = options[0]?.startTime || meta?.clinic?.openTime || "08:00";
  const fallbackEnd = options[0]?.endTime || meta?.clinic?.closeTime || "12:00";

  return [
    ...options,
    {
      id: "custom",
      label: "Custom",
      startTime: fallbackStart,
      endTime: fallbackEnd,
    },
  ];
}

function getSlotConfigIdsForTimeRange(meta, calendarDay, startTime, endTime) {
  if (!startTime || !endTime) return [];

  return (meta?.timeSlots || [])
    .filter(
      (slot) =>
        dbDayToCalendarDay(slot.dayOfWeek) === calendarDay &&
        slot.startTime >= startTime &&
        slot.endTime <= endTime,
    )
    .map((slot) => Number(slot.slot_config_id));
}

function normalizeFormForMeta(form, meta) {
  const scheduleWindow = meta?.scheduleWindow || getNextMonthBounds();
  const weekdayOptions = getWeekdayOptions(meta);
  const allowedWeekdays = weekdayOptions.map((day) => day.value);
  const selectedWeekdays = form.weekdays.filter((day) =>
    allowedWeekdays.includes(day),
  );
  const nextWeekdays = selectedWeekdays.length
    ? selectedWeekdays
    : allowedWeekdays.slice(0, Math.min(2, allowedWeekdays.length));
  const allowedSlotConfigIds = new Set(
    (meta?.timeSlots || [])
      .filter((slot) =>
        nextWeekdays.includes(dbDayToCalendarDay(slot.dayOfWeek)),
      )
      .map((slot) => Number(slot.slot_config_id)),
  );

  return {
    ...form,
    weekdays: nextWeekdays,
    busySlotConfigIds: (form.busySlotConfigIds || []).filter((slotConfigId) =>
      allowedSlotConfigIds.has(Number(slotConfigId)),
    ),
    ...(form.applyForMonth
      ? {
          startDate: scheduleWindow.targetMonthStart,
          endDate: scheduleWindow.targetMonthEnd,
        }
      : {}),
  };
}

function getDefaultForm() {
  const nextMonth = getNextMonthBounds();

  return {
    applyForMonth: true,
    startDate: nextMonth.targetMonthStart,
    endDate: nextMonth.targetMonthEnd,
    weekdays: [],
    busySlotConfigIds: [],
  };
}

function formatScheduleTime(schedule) {
  if (!schedule.startTime || !schedule.endTime) return "Chưa chọn khung giờ";
  return `${schedule.startTime} - ${schedule.endTime}`;
}

function translateSlotStatus(status) {
  return {
    Available: "Còn trống",
    Unavailable: "Không khả dụng",
    Booked: "Đã đặt",
  }[status] || status;
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
  onToggleBusySlot,
  onToggleWeekday,
}) {
  const clinic = meta?.clinic || { openTime: "08:00", closeTime: "20:00" };
  const scheduleWindow = meta?.scheduleWindow || getNextMonthBounds();
  const weekdayOptions = getWeekdayOptions(meta);
  const hasScheduleSetup =
    weekdayOptions.length > 0 && (meta?.timeSlots || []).length > 0;
  const canSubmit =
    scheduleWindow.isOpen !== false &&
    hasScheduleSetup &&
    form.weekdays.length > 0;
  const selectedWeekdayOptions = weekdayOptions.filter((day) =>
    form.weekdays.includes(day.value),
  );
  const busySlotIds = new Set(
    (form.busySlotConfigIds || []).map((slotConfigId) => Number(slotConfigId)),
  );

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
            <h2 id="schedule-editor-title">Tạo/Sửa lịch</h2>
            <p>
              Mark busy slots for next month between day 1 and day 15.
              Đăng ký lịch làm việc tháng tới từ ngày 1 đến ngày 15.
            </p>
          </div>
          <button
            className="dentist-schedule__icon-btn"
            type="button"
            onClick={onClose}
            aria-label="Đóng trình chỉnh sửa lịch"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <form className="dentist-schedule__form" onSubmit={onSubmit}>
          <div className="dentist-schedule__rule-note">
            Giờ làm việc: {clinic.openTime} - {clinic.closeTime}. Các khung giờ bận
            slots will be unavailable; all other selected-day slots remain
            available after approval. Target month:{" "}
            {scheduleWindow.targetMonthStart} đến {scheduleWindow.targetMonthEnd}.
            Giờ đã cấu hình: {clinic.openTime} - {clinic.closeTime}. Tháng áp dụng:
            {scheduleWindow.targetMonthStart} đến{" "}
            {scheduleWindow.targetMonthEnd}.
          </div>

          {!canSubmit && (
            <div className="dentist-schedule__notice dentist-schedule__notice--error">
              Đã đóng chỉnh sửa lịch. Nha sĩ chỉ có thể chỉnh lịch tháng tới
              từ ngày 1 đến ngày 15.
            </div>
          )}

          {!hasScheduleSetup && (
            <div className="dentist-schedule__notice dentist-schedule__notice--error">
              Clinic working days or time slots are not configured.
              Ngày làm việc, khung giờ hoặc phòng điều trị của phòng khám chưa được cấu hình.
            </div>
          )}

          <label className="dentist-schedule__checkbox">
            <input
              type="checkbox"
              name="applyForMonth"
              checked={form.applyForMonth}
              onChange={onChange}
            />
            <span>Áp dụng các ngày làm việc đã chọn cho toàn bộ tháng tới</span>
          </label>

          <div className="dentist-schedule__form-grid">
            <label className="dentist-schedule__field">
              <span>Ngày bắt đầu</span>
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
              <span>Ngày kết thúc</span>
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
            <legend>Ngày làm việc</legend>
            <div className="dentist-schedule__weekday-list">
              {weekdayOptions.map((day) => (
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

          <fieldset className="dentist-schedule__busy-group">
            <legend>Busy slots</legend>
            <p className="dentist-schedule__field-hint">
              Select only unavailable slots. Unselected slots are treated as
              free working time.
            </p>
            <div className="dentist-schedule__busy-days">
              {selectedWeekdayOptions.map((day) => {
                const daySlots = (meta?.timeSlots || []).filter(
                  (slot) => dbDayToCalendarDay(slot.dayOfWeek) === day.value,
                );

                return (
                  <section
                    className="dentist-schedule__busy-day"
                    key={day.value}
                    aria-label={`${day.label} busy slots`}
                  >
                    <h3>{day.label}</h3>
                    <div className="dentist-schedule__busy-slot-grid">
                      {daySlots.map((slot) => {
                        const slotConfigId = Number(slot.slot_config_id);
                        const isBusy = busySlotIds.has(slotConfigId);

                        return (
                          <button
                            key={slot.slot_config_id}
                            className={`dentist-schedule__busy-slot${
                              isBusy
                                ? " dentist-schedule__busy-slot--selected"
                                : ""
                            }`}
                            type="button"
                            onClick={() => onToggleBusySlot(slotConfigId)}
                            aria-pressed={isBusy}
                          >
                            {slot.startTime} - {slot.endTime}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </fieldset>


          <footer className="dentist-schedule__modal-actions">
            <button
              className="dentist-schedule__button dentist-schedule__button--secondary"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              className="dentist-schedule__button dentist-schedule__button--primary"
              type="submit"
              disabled={isSubmitting || !canSubmit}
            >
              <Send size={16} aria-hidden="true" />
              {isSubmitting ? "Đang kiểm tra..." : "Kiểm tra lịch"}
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
            <h2 id="availability-conflict-title">MSG25: Tìm thấy lịch hẹn đã xác nhận</h2>
            <p>Xem lại các bệnh nhân bị ảnh hưởng trước khi buộc khóa khung giờ đã chọn.</p>
          </div>
          <button
            className="dentist-schedule__icon-btn"
            type="button"
            onClick={onCancel}
            aria-label="Đóng cảnh báo xung đột"
            disabled={isSubmitting}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="dentist-schedule__conflict-body">
          <div className="dentist-schedule__warning-box">
            <AlertTriangle size={20} aria-hidden="true" />
            <span>
              Buộc khóa sẽ đánh dấu các lịch hẹn này là Xung đột và chuyển
              cho lễ tân sắp xếp lại.
            </span>
          </div>

          <div className="dentist-schedule__conflict-list">
            {affectedAppointments.map((appointment) => (
              <article
                className="dentist-schedule__conflict-item"
                key={appointment.appointmentId}
              >
                <strong>{appointment.patientName}</strong>
                <span>{appointment.patientPhone || "Không có số điện thoại"}</span>
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
            Hủy thay đổi
          </button>
          <button
            className="dentist-schedule__button dentist-schedule__button--danger"
            type="button"
            onClick={onForce}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang khóa..." : "Buộc khóa & chuyển xử lý đổi lịch"}
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
    workingDays: [],
    workingHours: [],
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
        setSchedules(
          (scheduleData || []).filter(
            (schedule) => Number(schedule.slotCount) > 0,
          ),
        );
        setForm((prevForm) => normalizeFormForMeta(prevForm, nextMeta));
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
        title: `${formatScheduleTime(schedule)} - ${
          STATUS_COPY[schedule.status]?.label || schedule.status
        }`,
        start: `${schedule.date}T${schedule.startTime || "08:00"}:00`,
        end: `${schedule.date}T${schedule.endTime || "08:30"}:00`,
        extendedProps: schedule,
        ...getEventColors(schedule.status),
      })),
    [schedules],
  );

  const stats = useMemo(
    () => ({
      pending: schedules.filter((schedule) => schedule.status === "Đang chờ").length,
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
          "Đã đóng chỉnh sửa lịch. Nha sĩ chỉ có thể chỉnh lịch tháng tới từ ngày 1 đến ngày 15.",
        ),
      );
      return;
    }

    setForm((prevForm) => normalizeFormForMeta(prevForm, meta));
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
    const selectedWeekday = selectedStart.getDay();
    const availableWeekdays = getWeekdayOptions(meta).map((day) => day.value);

    if (!availableWeekdays.includes(selectedWeekday)) {
      setError(new Error("Selected day is not configured as a clinic working day."));
      return;
    }

    setForm((prevForm) => ({
      ...prevForm,
      applyForMonth: false,
      startDate: toIsoDate(selectedStart),
      endDate: toIsoDate(selectedEnd),
      weekdays: [selectedWeekday],
      ...(!selectionInfo.allDay
        ? {
            busySlotConfigIds: getSlotConfigIdsForTimeRange(
              meta,
              selectedWeekday,
              toTimeValue(selectedStart),
              toTimeValue(selectedEndTime),
            ),
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
    const { checked, name, type, value } = event.target;

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

    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleToggleWeekday = (day) => {
    setForm((prevForm) => {
      const nextWeekdays = prevForm.weekdays.includes(day)
        ? prevForm.weekdays.filter((item) => item !== day)
        : sortCalendarWeekdays([...prevForm.weekdays, day]);

      return { ...prevForm, weekdays: nextWeekdays };
    });
  };

  const handleToggleBusySlot = (slotConfigId) => {
    setForm((prevForm) => {
      const currentIds = new Set(
        (prevForm.busySlotConfigIds || []).map((id) => Number(id)),
      );

      if (currentIds.has(slotConfigId)) {
        currentIds.delete(slotConfigId);
      } else {
        currentIds.add(slotConfigId);
      }

      return {
        ...prevForm,
        busySlotConfigIds: [...currentIds].sort((first, second) => first - second),
      };
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
        busySlotConfigIds: form.busySlotConfigIds || [],
        reason: "Dentist updated monthly work schedule.",
      });

      setMessage(
        `MSG22: ${saved.length} schedule request${
          saved.length === 1 ? "" : "s"
        } sent for manager approval.`,
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
      setMessage(result.message || "MSG24: Đã cập nhật trạng thái khả dụng.");
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
            <p className="dentist-schedule__eyebrow">Lịch của tôi</p>
            <h1>Quản lý lịch làm việc</h1>
            <p className="dentist-schedule__subtitle">
              Quản lý ca làm hằng tháng và khóa khung giờ khẩn cấp
              khi cần.
            </p>
          </div>
          <div className="dentist-schedule__header-actions">
            <button
              className="dentist-schedule__button dentist-schedule__button--secondary"
              type="button"
              onClick={() => fetchSchedules()}
            >
              <RefreshCw size={16} aria-hidden="true" />
              Làm mới
            </button>
            <button
              className="dentist-schedule__button dentist-schedule__button--primary"
              type="button"
              onClick={openEditor}
              disabled={!canEditSchedule}
              title={
                canEditSchedule
                  ? "Tạo/Sửa lịch"
                  : "Chỉnh sửa lịch mở từ ngày 1 đến ngày 15"
              }
            >
              <Plus size={16} aria-hidden="true" />
              Tạo/Sửa lịch
            </button>
          </div>
        </header>

        <section className="dentist-schedule__summary" aria-label="Tóm tắt lịch">
          <div>
            <span>{stats.pending}</span>
            <p>Đang chờ</p>
          </div>
          <div>
            <span>{stats.published}</span>
            <p>Đã công bố</p>
          </div>
          <div>
            <span>{stats.denied}</span>
            <p>Đã từ chối</p>
          </div>
        </section>

        {!canEditSchedule && (
          <div className="dentist-schedule__notice dentist-schedule__notice--warning">
            Đã đóng chỉnh sửa lịch tháng. Bạn vẫn có thể khóa khung giờ
            cho các thay đổi khẩn cấp đã công bố.
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
            <span>{error.message || "Không thể tải lịch."}</span>
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
              buttonText={{
                today: "Hôm nay",
                week: "Tuần",
                day: "Ngày",
              }}
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

          <aside className="dentist-schedule__details" aria-label="Chi tiết lịch">
            <h2>Ca đã chọn</h2>
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
                    <dt>Ngày</dt>
                    <dd>{selectedSchedule.date}</dd>
                  </div>
                  <div>
                    <dt>Thời gian</dt>
                    <dd>{formatScheduleTime(selectedSchedule)}</dd>
                  </div>
                  <div>
                    <dt>Số khung giờ</dt>
                    <dd>{selectedSchedule.slotCount}</dd>
                  </div>
                </dl>

                {selectedSchedule.status === "Denied" && (
                  <div className="dentist-schedule__manager-note" role="alert">
                    <strong>MSG23: Yêu cầu bị từ chối</strong>
                    <p>{selectedSchedule.managerNote || "Quản lý chưa ghi lý do."}</p>
                  </div>
                )}

                {selectedSchedule.status === "Scheduled" && (
                  <form
                    className="dentist-schedule__availability-form"
                    onSubmit={handleAvailabilitySubmit}
                  >
                    <h3>Cập nhật khả dụng</h3>
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
                      <span>Khóa toàn bộ ca</span>
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
                          <strong>{translateSlotStatus(slot.status)}</strong>
                        </button>
                      ))}
                    </div>

                    <label className="dentist-schedule__field">
                      <span>Lý do</span>
                      <textarea
                        value={availabilityReason}
                        onChange={(event) =>
                          setAvailabilityReason(event.target.value)
                        }
                        rows="4"
                        required
                        placeholder="Việc khẩn cấp, ốm đột xuất, nghỉ phép..."
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
                        ? "Đang cập nhật..."
                        : "Cập nhật trạng thái"}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="dentist-schedule__empty-details">
                <Clock size={22} aria-hidden="true" />
                <p>Chọn một ca trên lịch để xem hoặc cập nhật khung giờ.</p>
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
            onToggleBusySlot={handleToggleBusySlot}
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
