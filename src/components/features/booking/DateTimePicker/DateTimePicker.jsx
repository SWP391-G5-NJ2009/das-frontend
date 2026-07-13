import { useState } from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import "./DateTimePicker.css";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(date) {
  return `${WEEKDAYS[date.getDay()]}, ${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** BR-14 (all roles): slot start time has already passed. */
function isSlotPast(slotTimeStr) {
  const now = new Date();
  const [hours, minutes] = slotTimeStr.split(":").map(Number);
  const slotDateTime = new Date();
  slotDateTime.setHours(hours, minutes, 0, 0);
  return slotDateTime.getTime() <= now.getTime();
}

/** BR-14 (patient only): slot starts within 30 minutes of now. */
function isSlotWithin30Min(slotTimeStr) {
  const now = new Date();
  const [hours, minutes] = slotTimeStr.split(":").map(Number);
  const slotDateTime = new Date();
  slotDateTime.setHours(hours, minutes, 0, 0);
  const diffMs = slotDateTime.getTime() - now.getTime();
  return diffMs > 0 && diffMs < 30 * 60 * 1000;
}

function DateTimePicker({
  selectedDate,
  onSelectDate,
  selectedSlotId,
  onSelectSlot,
  slots,
  enforceTimingRule,
  slotOccupied,
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(
    selectedDate ? selectedDate.getFullYear() : today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    selectedDate ? selectedDate.getMonth() : today.getMonth(),
  );

  const daysInMonth = getDaysInMonth(viewYear, viewMonth + 1);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  function handlePrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function handleNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function isPastDate(day) {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  }

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const normalizedSlotCount = Math.max(1, Number(slotOccupied) || 1);
  const isMultiSlot = normalizedSlotCount > 1;

  const isTodayDate = selectedDate && isSameDay(selectedDate, today);

  const slotAvailability = slots.map((slot) => {
    const past = isTodayDate && isSlotPast(slot.time);
    const tooSoon =
      isTodayDate && enforceTimingRule && isSlotWithin30Min(slot.time);
    return slot.status === "Available" && !past && !tooSoon;
  });

  function canBeStartSlot(idx) {
    if (!slotAvailability[idx]) return false;
    if (!isMultiSlot) return true;
    for (let k = 0; k < normalizedSlotCount; k++) {
      if (idx + k >= slots.length || !slotAvailability[idx + k]) return false;
      if (k > 0) {
        const prevTimeEnd = slots[idx + k - 1].timeEnd;
        const currTime = slots[idx + k].time;
        if (prevTimeEnd && prevTimeEnd !== currTime) return false;
      }
    }
    return true;
  }

  const selectedStartIdx = selectedSlotId
    ? slots.findIndex((s) => s.id === selectedSlotId)
    : -1;
  const selectedRangeIds = new Set();
  if (selectedStartIdx >= 0) {
    for (let k = 0; k < normalizedSlotCount; k++) {
      if (selectedStartIdx + k < slots.length) {
        selectedRangeIds.add(slots[selectedStartIdx + k].id);
      }
    }
  }

  return (
    <div className="date-time-picker">
      {/* Calendar */}
      <div className="date-time-picker__calendar">
        <div className="date-time-picker__cal-header">
          <button
            type="button"
            className="date-time-picker__nav-btn"
            onClick={handlePrevMonth}
            disabled={!canGoPrev}
            aria-label="Tháng trước"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="date-time-picker__month-label">
            {MONTHS[viewMonth]},{" "}
            <span className="date-time-picker__year">{viewYear}</span>
          </span>
          <button
            type="button"
            className="date-time-picker__nav-btn"
            onClick={handleNextMonth}
            aria-label="Tháng sau"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="date-time-picker__weekdays" role="row">
          {WEEKDAYS.map((d) => (
            <span
              key={d}
              className="date-time-picker__weekday"
              role="columnheader"
            >
              {d}
            </span>
          ))}
        </div>

        <div
          className="date-time-picker__days"
          role="grid"
          aria-label="Lưới chọn ngày"
        >
          {/* Empty cells for first day offset */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <span
              key={`empty-${i}`}
              className="date-time-picker__day date-time-picker__day--empty"
            />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(viewYear, viewMonth, day);
            const past = isPastDate(day);
            const isToday = isSameDay(date, today);
            const isSelected = selectedDate && isSameDay(date, selectedDate);

            return (
              <button
                key={day}
                type="button"
                className={[
                  "date-time-picker__day",
                  past ? "date-time-picker__day--past" : "",
                  isToday ? "date-time-picker__day--today" : "",
                  isSelected ? "date-time-picker__day--selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => !past && onSelectDate(date)}
                disabled={past}
                aria-label={`${day} ${MONTHS[viewMonth]} ${viewYear}${isToday ? ", today" : ""}${past ? ", past" : ""}`}
                aria-pressed={isSelected}
                role="gridcell"
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div className="date-time-picker__slots">
        <p className="date-time-picker__slots-label">
          Khung giờ còn trống
          {selectedDate && (
            <span className="date-time-picker__slots-date">
              {" "}
              — {formatDate(selectedDate)}
            </span>
          )}
        </p>

        {/* Multi-slot info chip */}
        {isMultiSlot && selectedDate && (
          <div className="date-time-picker__slot-info" role="note">
            <Clock size={13} aria-hidden="true" />
            <span>
              Dịch vụ này cần{" "}
              <strong>{normalizedSlotCount} khung giờ liên tiếp</strong> (
              {normalizedSlotCount * 30} phút). Khi chọn giờ bắt đầu, hệ thống sẽ
              tự động giữ tất cả {normalizedSlotCount} slots.
            </span>
          </div>
        )}

        {!selectedDate ? (
          <p className="date-time-picker__slots-empty">
            Vui lòng chọn ngày để xem khung giờ còn trống.
          </p>
        ) : slots.length === 0 ? (
          <p className="date-time-picker__slots-empty">
            Không có khung giờ trống cho ngày này.
          </p>
        ) : (
          <div className="date-time-picker__slots-grid">
            {slots.map((slot, idx) => {
              const individuallyAvailable = slotAvailability[idx];
              const canStart = canBeStartSlot(idx);

              const isRangeStart =
                selectedStartIdx >= 0 && idx === selectedStartIdx;
              const isRangeFollowOn =
                selectedStartIdx >= 0 &&
                idx > selectedStartIdx &&
                selectedRangeIds.has(slot.id);

              const isClickableFollowOn =
                isRangeFollowOn && canBeStartSlot(idx);

              const isInsufficientStart =
                isMultiSlot &&
                individuallyAvailable &&
                !canStart &&
                !isRangeFollowOn;

              const isDisabled = isRangeFollowOn
                ? !isClickableFollowOn
                : isMultiSlot
                  ? !canStart
                  : !individuallyAvailable;

              const past = isTodayDate && isSlotPast(slot.time);
              const tooSoon =
                isTodayDate &&
                enforceTimingRule &&
                isSlotWithin30Min(slot.time);

              const buildTitle = () => {
                if (isClickableFollowOn)
                  return `Click to start from ${slot.time} instead`;
                if (isRangeFollowOn)
                  return `${slot.time} – automatically included in booking`;
                if (isInsufficientStart)
                  return `${slot.time} – available, but not enough consecutive slots after this time for the full service`;
                if (isMultiSlot && canStart)
                  return `Select start time ${slot.time} (reserves ${normalizedSlotCount} consecutive slots)`;
                if (!isMultiSlot && individuallyAvailable)
                  return `Select time ${slot.time}`;
                if (past) return `${slot.time} - unavailable (time has passed)`;
                if (tooSoon)
                  return `${slot.time} - unavailable (less than 30 minutes away)`;
                if (slot.status === "Booked") return `${slot.time} - booked`;
                return `${slot.time} - unavailable`;
              };

              return (
                <button
                  key={slot.id}
                  type="button"
                  className={[
                    "date-time-picker__slot",
                    isDisabled && !isInsufficientStart
                      ? "date-time-picker__slot--disabled"
                      : "",
                    isInsufficientStart
                      ? "date-time-picker__slot--insufficient"
                      : "",
                    isRangeStart ? "date-time-picker__slot--range-start" : "",
                    isRangeFollowOn && !isClickableFollowOn
                      ? "date-time-picker__slot--in-range"
                      : "",
                    isClickableFollowOn
                      ? "date-time-picker__slot--in-range-clickable"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => {
                    if (isClickableFollowOn) {
                      onSelectSlot(slot); // shift selection to start from here
                      return;
                    }
                    if (isRangeFollowOn) return; // last follow-on, not a valid start
                    if (!isMultiSlot && individuallyAvailable)
                      onSelectSlot(slot);
                    if (isMultiSlot && canStart) onSelectSlot(slot);
                  }}
                  disabled={isDisabled}
                  aria-pressed={isRangeStart || isRangeFollowOn}
                  title={buildTitle()}
                  aria-label={buildTitle()}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

DateTimePicker.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  onSelectDate: PropTypes.func.isRequired,
  selectedSlotId: PropTypes.string,
  onSelectSlot: PropTypes.func.isRequired,
  slots: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      timeEnd: PropTypes.string,
      status: PropTypes.oneOf(["Available", "Booked", "Unavailable"])
        .isRequired,
    }),
  ).isRequired,
  enforceTimingRule: PropTypes.bool,
  slotOccupied: PropTypes.number,
};

DateTimePicker.defaultProps = {
  selectedDate: null,
  selectedSlotId: null,
  enforceTimingRule: false,
  slotOccupied: 1,
};

export default DateTimePicker;
