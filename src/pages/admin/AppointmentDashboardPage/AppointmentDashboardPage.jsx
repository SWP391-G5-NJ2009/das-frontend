import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";
import OwnerPageShell from "../../owner/OwnerPageShell";
import Spinner from "../../../components/common/Spinner/Spinner";
import { api } from "../../../services/api";
import "./AppointmentDashboardPage.css";

const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MONTH_NAMES = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

const STATUS_CLASSES = {
  Confirmed: "appt-dash__status--confirmed",
  Waiting: "appt-dash__status--waiting",
  "Checked-in": "appt-dash__status--checked-in",
  Cancelled: "appt-dash__status--cancelled",
  "No-Show": "appt-dash__status--no-show",
  Conflict: "appt-dash__status--conflict",
  "In-Treatment": "appt-dash__status--in-treatment",
  Completed: "appt-dash__status--completed",
};

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  const day = new Date(year, month - 1, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function formatDisplayDate(dateStr) {
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function AppointmentDashboardPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [mode, setMode] = useState("month");
  const [selectedDate, setSelectedDate] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [monthlyCounts, setMonthlyCounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDailyLoading, setIsDailyLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMonthlyCounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get(
        `/owner/appointment-dashboard/monthly?year=${currentYear}&month=${currentMonth}`,
      );
      setMonthlyCounts(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentYear, currentMonth]);

  useEffect(() => {
    fetchMonthlyCounts();
  }, [fetchMonthlyCounts]);

  const countMap = useMemo(() => {
    const map = {};
    monthlyCounts.forEach((item) => {
      map[item.date] = item.count;
    });
    return map;
  }, [monthlyCounts]);

  const totalMonthAppointments = useMemo(
    () => monthlyCounts.reduce((sum, item) => sum + item.count, 0),
    [monthlyCounts],
  );

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfWeek(currentYear, currentMonth);
    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push({ key: `empty-${i}`, empty: true });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({
        key: dateStr,
        day: d,
        date: dateStr,
        count: countMap[dateStr] || 0,
        isToday:
          d === today.getDate() &&
          currentMonth === today.getMonth() + 1 &&
          currentYear === today.getFullYear(),
      });
    }
    return cells;
  }, [currentYear, currentMonth, countMap, today]);

  const navigateMonth = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setMode("month");
    setSelectedDate(null);
    setDailyData(null);
  };

  const handleDayClick = async (dateStr) => {
    setSelectedDate(dateStr);
    setMode("day");
    setIsDailyLoading(true);
    setError(null);
    try {
      const data = await api.get(
        `/owner/appointment-dashboard/daily?date=${dateStr}`,
      );
      setDailyData(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsDailyLoading(false);
    }
  };

  const handleBackToMonth = () => {
    setMode("month");
    setSelectedDate(null);
    setDailyData(null);
  };

  const getCountIntensity = (count) => {
    if (count === 0) return "appt-dash__day-cell--empty";
    if (count <= 3) return "appt-dash__day-cell--low";
    if (count <= 6) return "appt-dash__day-cell--medium";
    return "appt-dash__day-cell--high";
  };

  return (
    <OwnerPageShell>
      <div className="appt-dash">
        <header className="appt-dash__header">
          <div>
            <p className="appt-dash__eyebrow">Bảng điều khiển chủ phòng khám</p>
            <h1 className="appt-dash__title">Bảng điều khiển lịch hẹn</h1>
            <p className="appt-dash__subtitle">
              Xem tổng quan lịch hẹn và chi tiết lịch trình.
            </p>
          </div>
        </header>

        {error && (
          <div className="appt-dash__notice appt-dash__notice--error">
            <span>{error.message || "Tải dữ liệu thất bại."}</span>
          </div>
        )}

        {mode === "month" ? (
          <div className="appt-dash__month-view">
            <section className="appt-dash__card">
              <div className="appt-dash__card-header">
                <div className="appt-dash__card-header-left">
                  <CalendarDays size={22} className="appt-dash__card-icon" />
                  <h2 className="appt-dash__card-title">
                    {MONTH_NAMES[currentMonth - 1]} {currentYear}
                  </h2>
                </div>
                <div className="appt-dash__month-nav">
                  <button
                    className="appt-dash__nav-btn"
                    type="button"
                    onClick={() => navigateMonth(-1)}
                    aria-label="Tháng trước"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    className="appt-dash__nav-btn"
                    type="button"
                    onClick={() => {
                      setCurrentYear(today.getFullYear());
                      setCurrentMonth(today.getMonth() + 1);
                    }}
                  >
                    Hôm nay
                  </button>
                  <button
                    className="appt-dash__nav-btn"
                    type="button"
                    onClick={() => navigateMonth(1)}
                    aria-label="Tháng sau"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="appt-dash__summary-row">
                <div className="appt-dash__summary-stat">
                  <Users size={18} />
                  <span className="appt-dash__summary-value">
                    {totalMonthAppointments}
                  </span>
                  <span className="appt-dash__summary-label">
                    Tổng lịch hẹn
                  </span>
                </div>
              </div>

              {isLoading ? (
                <div className="appt-dash__loading">
                  <Spinner />
                </div>
              ) : (
                <>
                  <div className="appt-dash__weekdays">
                    {DAY_LABELS.map((label) => (
                      <div key={label} className="appt-dash__weekday">
                        {label}
                      </div>
                    ))}
                  </div>

                  <div className="appt-dash__calendar-grid">
                    {calendarDays.map((cell) =>
                      cell.empty ? (
                        <div key={cell.key} className="appt-dash__day-cell appt-dash__day-cell--blank" />
                      ) : (
                        <button
                          key={cell.key}
                          className={`appt-dash__day-cell ${getCountIntensity(cell.count)}${
                            cell.isToday ? " appt-dash__day-cell--today" : ""
                          }`}
                          type="button"
                          onClick={() => handleDayClick(cell.date)}
                        >
                          <span className="appt-dash__day-number">{cell.day}</span>
                          {cell.count > 0 && (
                            <span className="appt-dash__day-count">{cell.count}</span>
                          )}
                        </button>
                      ),
                    )}
                  </div>
                </>
              )}
            </section>
          </div>
        ) : (
          <div className="appt-dash__day-view">
            <div className="appt-dash__day-header">
              <button
                className="appt-dash__back-btn"
                type="button"
                onClick={handleBackToMonth}
              >
                <ArrowLeft size={16} />
                Quay lại lịch
              </button>
              <h2 className="appt-dash__day-title">
                <CalendarDays size={20} />
                {selectedDate && formatDisplayDate(selectedDate)}
                {dailyData && (
                  <span className="appt-dash__day-total">
                    {dailyData.totalAppointments} lịch hẹn
                  </span>
                )}
              </h2>
            </div>

            {isDailyLoading ? (
              <div className="appt-dash__loading">
                <Spinner />
              </div>
            ) : dailyData ? (
              <section className="appt-dash__card">
                <div className="appt-dash__timeline">
                  {dailyData.timeSlots.map((slot) => (
                    <div
                      key={slot.start}
                      className={`appt-dash__time-row${
                        slot.appointments.length > 0
                          ? " appt-dash__time-row--has-appts"
                          : " appt-dash__time-row--empty"
                      }`}
                    >
                      <div className="appt-dash__time-label">
                        <Clock size={14} />
                        {slot.label}
                      </div>
                      <div className="appt-dash__time-content">
                        {slot.appointments.length === 0 ? (
                          <span className="appt-dash__no-appt">Không có lịch hẹn</span>
                        ) : (
                          slot.appointments.map((appt) => (
                            <div
                              key={appt.appt_id}
                              className={`appt-dash__appt-card ${STATUS_CLASSES[appt.status] || ""}`}
                            >
                              <div className="appt-dash__appt-header">
                                <span className="appt-dash__appt-patient">
                                  <User size={14} />
                                  {appt.patient_name}
                                </span>
                                <span
                                  className={`appt-dash__appt-status ${
                                    STATUS_CLASSES[appt.status] || ""
                                  }`}
                                >
                                {appt.status === "Confirmed" ? "Đã xác nhận" : appt.status === "Waiting" ? "Đang chờ" : appt.status === "Checked-in" ? "Đã check-in" : appt.status === "Cancelled" ? "Đã hủy" : appt.status === "No-Show" ? "Không đến" : appt.status === "Conflict" ? "Trùng lịch" : appt.status === "In-Treatment" ? "Đang điều trị" : appt.status === "Completed" ? "Hoàn thành" : appt.status}
                                </span>
                              </div>
                              <div className="appt-dash__appt-details">
                                {appt.services.length > 0 && (
                                  <span className="appt-dash__appt-service">
                                    {appt.services.join(", ")}
                                  </span>
                                )}
                                <span className="appt-dash__appt-dentist">
                                  Dr. {appt.dentist_name}
                                </span>
                                {appt.room_name && (
                                  <span className="appt-dash__appt-room">
                                    <MapPin size={12} />
                                    {appt.room_name}
                                  </span>
                                )}
                                {appt.patient_phone && (
                                  <span className="appt-dash__appt-phone">
                                    <Phone size={12} />
                                    {appt.patient_phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </div>
    </OwnerPageShell>
  );
}

export default AppointmentDashboardPage;
