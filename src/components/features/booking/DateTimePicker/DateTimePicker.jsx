import { useState } from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./DateTimePicker.css";

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const MONTHS = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
  "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
  "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

// month là 1-indexed (1 = Tháng 1, 3 = Tháng 3)
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

function formatDateVN(date) {
  return `${WEEKDAYS[date.getDay()]}, ${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function DateTimePicker({ selectedDate, onSelectDate, selectedSlotId, onSelectSlot, slots }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(
    selectedDate ? selectedDate.getFullYear() : today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(
    selectedDate ? selectedDate.getMonth() : today.getMonth()
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
            <span key={d} className="date-time-picker__weekday" role="columnheader">
              {d}
            </span>
          ))}
        </div>

        <div className="date-time-picker__days" role="grid" aria-label="Lưới chọn ngày">
          {/* Empty cells for first day offset */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <span key={`empty-${i}`} className="date-time-picker__day date-time-picker__day--empty" />
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
                aria-label={`${day} tháng ${viewMonth + 1} năm ${viewYear}${isToday ? ", hôm nay" : ""}${past ? ", đã qua" : ""}`}
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
              {" "}— {formatDateVN(selectedDate)}
            </span>
          )}
        </p>

        {!selectedDate ? (
          <p className="date-time-picker__slots-empty">
            Vui lòng chọn ngày để xem khung giờ trống.
          </p>
        ) : slots.length === 0 ? (
          <p className="date-time-picker__slots-empty">
            Không có khung giờ trống cho ngày này.
          </p>
        ) : (
          <div className="date-time-picker__slots-grid">
            {slots.map((slot) => {
              const isAvailable = slot.status === "available";
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
                  aria-label={
                    isAvailable
                      ? `Chọn giờ ${slot.time}`
                      : `${slot.time} — không khả dụng`
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
      status: PropTypes.oneOf(["available", "booked", "passed"]).isRequired,
    })
  ).isRequired,
};

DateTimePicker.defaultProps = {
  selectedDate: null,
  selectedSlotId: null,
};

export default DateTimePicker;
