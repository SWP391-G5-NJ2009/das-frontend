import { useState } from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

// month is 1-indexed (1 = January, 3 = March)
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

/**
 * enforceTimingRule — true for patients (blocks slots < 30 min away).
 *                     false for receptionists (only blocks already-past slots).
 */
function DateTimePicker({
  selectedDate,
  onSelectDate,
  selectedSlotId,
  onSelectSlot,
  slots,
  enforceTimingRule,
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
            aria-label="Previous month"
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
            aria-label="Next month"
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
          aria-label="Date selection grid"
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
          Available Time Slots
          {selectedDate && (
            <span className="date-time-picker__slots-date">
              {" "}
              — {formatDate(selectedDate)}
            </span>
          )}
        </p>

        {!selectedDate ? (
          <p className="date-time-picker__slots-empty">
            Please select a date to view available time slots.
          </p>
        ) : slots.length === 0 ? (
          <p className="date-time-picker__slots-empty">
            No available time slots for this date.
          </p>
        ) : (
          <div className="date-time-picker__slots-grid">
            {slots.map((slot) => {
              const isToday = selectedDate && isSameDay(selectedDate, today);
              // Block for ALL roles: slot start time has already passed
              const past = isToday && isSlotPast(slot.time);
              // Block only for patients: slot starts within 30 min
              const tooSoon =
                isToday && enforceTimingRule && isSlotWithin30Min(slot.time);
              const isAvailable =
                slot.status === "Available" && !past && !tooSoon;
              const isSelected = isAvailable && slot.id === selectedSlotId;
              return (
                <button
                  key={slot.id}
                  type="button"
                  className={[
                    "date-time-picker__slot",
                    !isAvailable ? "date-time-picker__slot--disabled" : "",
                    isSelected ? "date-time-picker__slot--selected" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => isAvailable && onSelectSlot(slot)}
                  disabled={!isAvailable}
                  aria-pressed={isSelected}
                  title={
                    isAvailable
                      ? `Select time ${slot.time}`
                      : past
                        ? `${slot.time} - unavailable (time has passed)`
                        : tooSoon
                          ? `${slot.time} - unavailable (less than 30 minutes away)`
                          : slot.status === "Booked"
                            ? `${slot.time} - booked`
                            : `${slot.time} - unavailable`
                  }
                  aria-label={
                    isAvailable
                      ? `Select time ${slot.time}`
                      : past
                        ? `${slot.time} - unavailable (time has passed)`
                        : tooSoon
                          ? `${slot.time} - unavailable (less than 30 minutes away)`
                          : slot.status === "Booked"
                            ? `${slot.time} - booked`
                            : `${slot.time} - unavailable`
                  }
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
      status: PropTypes.oneOf(["Available", "Booked", "Unavailable"])
        .isRequired,
    }),
  ).isRequired,
  /** true = apply 30-min buffer (patient); false = only block past slots (receptionist) */
  enforceTimingRule: PropTypes.bool,
};

DateTimePicker.defaultProps = {
  selectedDate: null,
  selectedSlotId: null,
  enforceTimingRule: false,
};

export default DateTimePicker;
