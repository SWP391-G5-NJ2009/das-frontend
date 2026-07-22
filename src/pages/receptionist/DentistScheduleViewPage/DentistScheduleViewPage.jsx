import { CalendarDays, RefreshCw, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Spinner from "../../../components/common/Spinner/Spinner";
import { scheduleService } from "../../../services/schedule.service";
import ReceptionistPageShell from "../ReceptionistPageShell";
import "./DentistScheduleViewPage.css";

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getWeekStart(date) {
  const next = new Date(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  return next;
}

function getRange(dateText, mode) {
  const selected = new Date(`${dateText}T00:00:00`);

  if (mode === "week") {
    const start = getWeekStart(selected);
    return {
      dateFrom: toIsoDate(start),
      dateTo: toIsoDate(addDays(start, 6)),
    };
  }

  return {
    dateFrom: dateText,
    dateTo: dateText,
  };
}

function getSlotClass(status) {
  const key = String(status || "").toLowerCase();
  return `dentist-schedule-view__slot dentist-schedule-view__slot--${key || "neutral"}`;
}

function formatScheduleTime(schedule) {
  if (!schedule.startTime || !schedule.endTime) return "No configured slots";
  return `${schedule.startTime} - ${schedule.endTime}`;
}

function DentistScheduleViewPage() {
  const [date, setDate] = useState(() => toIsoDate(new Date()));
  const [dentists, setDentists] = useState([]);
  const [error, setError] = useState(null);
  const [isDentistLoading, setIsDentistLoading] = useState(true);
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [mode, setMode] = useState("day");
  const [roomFilter, setRoomFilter] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [selectedDentistId, setSelectedDentistId] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchDentists() {
      setIsDentistLoading(true);
      setError(null);

      try {
        const data = await scheduleService.getDentists();
        if (!isMounted) return;
        setDentists(data || []);
        setSelectedDentistId((prevId) => prevId || String(data?.[0]?.dentist_id || ""));
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setIsDentistLoading(false);
      }
    }

    fetchDentists();
    return () => {
      isMounted = false;
    };
  }, []);

  const roomOptions = useMemo(() => {
    const map = new Map();
    dentists.forEach((dentist) => {
      if (dentist.room_id) {
        map.set(String(dentist.room_id), dentist.roomName);
      }
    });
    return [...map.entries()].map(([value, label]) => ({ value, label }));
  }, [dentists]);

  const filteredDentists = useMemo(() => {
    if (!roomFilter) return dentists;
    return dentists.filter((dentist) => String(dentist.room_id) === roomFilter);
  }, [dentists, roomFilter]);

  useEffect(() => {
    if (!filteredDentists.length) {
      setSelectedDentistId("");
      return;
    }

    const stillVisible = filteredDentists.some(
      (dentist) => String(dentist.dentist_id) === String(selectedDentistId),
    );

    if (!stillVisible) {
      setSelectedDentistId(String(filteredDentists[0].dentist_id));
    }
  }, [filteredDentists, selectedDentistId]);

  const selectedDentist = useMemo(
    () =>
      dentists.find(
        (dentist) => String(dentist.dentist_id) === String(selectedDentistId),
      ) || null,
    [dentists, selectedDentistId],
  );

  const fetchSchedule = useCallback(async () => {
    if (!selectedDentistId) {
      setSchedules([]);
      return;
    }

    setIsScheduleLoading(true);
    setError(null);

    try {
      const range = getRange(date, mode);
      const data = await scheduleService.viewDentistSchedule({
        dentistId: selectedDentistId,
        ...range,
      });
      setSchedules(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsScheduleLoading(false);
    }
  }, [date, mode, selectedDentistId]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const slotStats = useMemo(() => {
    const slots = schedules.flatMap((schedule) => schedule.slots || []);
    return {
      available: slots.filter((slot) => slot.status === "Available").length,
      booked: slots.filter((slot) => slot.status === "Booked").length,
      unavailable: slots.filter((slot) => slot.status === "Unavailable").length,
    };
  }, [schedules]);

  return (
    <ReceptionistPageShell
      contentClassName="dentist-schedule-view-page"
      contentLabelledBy="dentist-schedule-view-title"
    >
      <div className="dentist-schedule-view">
        <header className="dentist-schedule-view__header">
          <div>
            <p className="dentist-schedule-view__eyebrow">Schedules</p>
            <h1 id="dentist-schedule-view-title">View Dentist Schedule</h1>
            <p>
              Check working shifts, assigned room, available slots, and
              unavailable time before arranging patients.
            </p>
          </div>
          <button
            className="dentist-schedule-view__button dentist-schedule-view__button--secondary"
            type="button"
            onClick={fetchSchedule}
            disabled={isScheduleLoading}
          >
            <RefreshCw size={16} aria-hidden="true" />
            Refresh
          </button>
        </header>

        <section className="dentist-schedule-view__filters" aria-label="Schedule filters">
          <label>
            <span>Dentist</span>
            <select
              value={selectedDentistId}
              onChange={(event) => setSelectedDentistId(event.target.value)}
              disabled={isDentistLoading || filteredDentists.length === 0}
            >
              {filteredDentists.map((dentist) => (
                <option key={dentist.dentist_id} value={dentist.dentist_id}>
                  {dentist.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Room</span>
            <select
              value={roomFilter}
              onChange={(event) => setRoomFilter(event.target.value)}
            >
              <option value="">All rooms</option>
              {roomOptions.map((room) => (
                <option key={room.value} value={room.value}>
                  {room.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Date</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>

          <div className="dentist-schedule-view__mode" role="group" aria-label="View mode">
            <button
              className={mode === "day" ? "dentist-schedule-view__mode-btn dentist-schedule-view__mode-btn--active" : "dentist-schedule-view__mode-btn"}
              type="button"
              onClick={() => setMode("day")}
            >
              Day
            </button>
            <button
              className={mode === "week" ? "dentist-schedule-view__mode-btn dentist-schedule-view__mode-btn--active" : "dentist-schedule-view__mode-btn"}
              type="button"
              onClick={() => setMode("week")}
            >
              Week
            </button>
          </div>
        </section>

        <section className="dentist-schedule-view__summary" aria-label="Slot summary">
          <div>
            <span>{slotStats.available}</span>
            <p>Available</p>
          </div>
          <div>
            <span>{slotStats.unavailable}</span>
            <p>Unavailable</p>
          </div>
          <div>
            <span>{slotStats.booked}</span>
            <p>Booked</p>
          </div>
        </section>

        {selectedDentist && (
          <section className="dentist-schedule-view__dentist">
            <Search size={18} aria-hidden="true" />
            <span>{selectedDentist.name}</span>
            <strong>{selectedDentist.roomName}</strong>
          </section>
        )}

        {error && (
          <div className="dentist-schedule-view__notice dentist-schedule-view__notice--error">
            {error.message || "Unable to load dentist schedule."}
          </div>
        )}

        {(isDentistLoading || isScheduleLoading) && (
          <div className="dentist-schedule-view__loading">
            <Spinner />
          </div>
        )}

        {!isDentistLoading && !isScheduleLoading && !error && schedules.length === 0 && (
          <div className="dentist-schedule-view__empty">
            <CalendarDays size={24} aria-hidden="true" />
            <p>No schedule is available for the selected dentist and range.</p>
          </div>
        )}

        {!isDentistLoading && !isScheduleLoading && schedules.length > 0 && (
          <section className="dentist-schedule-view__list" aria-label="Dentist schedule">
            {schedules.map((schedule) => (
              <article className="dentist-schedule-view__card" key={schedule.schedule_id}>
                <div className="dentist-schedule-view__card-header">
                  <div>
                    <h2>{schedule.date}</h2>
                    <p>{formatScheduleTime(schedule)}</p>
                  </div>
                  <span>{schedule.roomName}</span>
                </div>
                <div className="dentist-schedule-view__slots">
                  {(schedule.slots || []).map((slot) => (
                    <span className={getSlotClass(slot.status)} key={slot.slot_id}>
                      <span>{slot.startTime} - {slot.endTime}</span>
                      <strong>{slot.status}</strong>
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </ReceptionistPageShell>
  );
}

export default DentistScheduleViewPage;
