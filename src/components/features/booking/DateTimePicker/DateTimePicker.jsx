import { useState } from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import "./DateTimePicker.css";

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const MONTHS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
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

/** BR-14 (patient & others): slot start time has already passed. */
function isSlotPast(slotTimeStr) {
  const now = new Date();
  const [hours, minutes] = slotTimeStr.split(":").map(Number);
  const slotDateTime = new Date();
  slotDateTime.setHours(hours, minutes, 0, 0);
  return slotDateTime.getTime() <= now.getTime();
}

/** BR-14 (receptionist): slot end time has already passed. */
function isSlotEndPast(slotEndTimeStr) {
  if (!slotEndTimeStr) return false;
  const now = new Date();
  const [hours, minutes] = slotEndTimeStr.split(":").map(Number);
  const slotEndDateTime = new Date();
  slotEndDateTime.setHours(hours, minutes, 0, 0);
  return slotEndDateTime.getTime() <= now.getTime();
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
  bookedTimeSet,
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
    // Receptionist: ẩn slot khi end_time đã qua; Patient/others: ẩn khi start_time đã qua
    const past = isTodayDate &&
      (enforceTimingRule
        ? isSlotPast(slot.time)
        : isSlotEndPast(slot.timeEnd || slot.time));
    const tooSoon =
      isTodayDate && enforceTimingRule && isSlotWithin30Min(slot.time);
    const alreadyBooked =
      bookedTimeSet &&
      selectedDate &&
      bookedTimeSet.has(
        `${
          [
            selectedDate.getFullYear(),
            String(selectedDate.getMonth() + 1).padStart(2, "0"),
            String(selectedDate.getDate()).padStart(2, "0"),
          ].join("-")
        }|${slot.time}`,
      );
    return {
      available: slot.status === "Available" && !past && !tooSoon && !alreadyBooked,
      alreadyBooked: !!alreadyBooked,
    };
  });

  function isSlotAvailable(idx) {
    return slotAvailability[idx]?.available ?? false;
  }

  function canBeStartSlot(idx) {
    if (!isSlotAvailable(idx)) return false;
    if (!isMultiSlot) return true;
    for (let k = 0; k < normalizedSlotCount; k++) {
      if (idx + k >= slots.length || !isSlotAvailable(idx + k)) return false;
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
                aria-label={`${day} ${MONTHS[viewMonth]} ${viewYear}${isToday ? ", hôm nay" : ""}${past ? ", đã qua" : ""}`}
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
              tự động giữ tất cả {normalizedSlotCount} khung giờ.
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
              const individuallyAvailable = isSlotAvailable(idx);
              const canStart = canBeStartSlot(idx);
              const isAlreadyBooked = slotAvailability[idx]?.alreadyBooked ?? false;

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
                if (isAlreadyBooked)
                  return `${slot.time} – bạn đã có lịch hẹn vào giờ này`;
                if (isClickableFollowOn)
                  return `Nhấp để bắt đầu từ ${slot.time}`;
                if (isRangeFollowOn)
                  return `${slot.time} – được tự động bao gồm trong lịch hẹn`;
                if (isInsufficientStart)
                  return `${slot.time} – có trống, nhưng không đủ khung giờ liên tiếp sau để hoàn thành dịch vụ`;
                if (isMultiSlot && canStart)
                  return `Chọn giờ bắt đầu ${slot.time} (giữ ${normalizedSlotCount} khung giờ liên tiếp)`;
                if (!isMultiSlot && individuallyAvailable)
                  return `Chọn giờ ${slot.time}`;
                if (past) return `${slot.time} - không khả dụng (giờ đã qua)`;
                if (tooSoon)
                  return `${slot.time} - không khả dụng (còn dưới 30 phút)`;
                if (slot.status === "Booked") return `${slot.time} - đã được đặt`;
                return `${slot.time} - không khả dụng`;
              };

              return (
                <button
                  key={slot.id}
                  type="button"
                  className={[
                    "date-time-picker__slot",
                    isAlreadyBooked
                      ? "date-time-picker__slot--my-booked"
                      : isDisabled && !isInsufficientStart
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
  bookedTimeSet: PropTypes.instanceOf(Set),
};

DateTimePicker.defaultProps = {
  selectedDate: null,
  selectedSlotId: null,
  enforceTimingRule: false,
  slotOccupied: 1,
  bookedTimeSet: null,
};

export default DateTimePicker;
