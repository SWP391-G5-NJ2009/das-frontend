import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  Clock,
  Coffee,
  Eye,
  GitBranch,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { clinicScheduleManagementService } from "../../../../services/clinicScheduleManagement.service";
import { todayVietnam } from "../../../../utils/dateUtils";
import ConflictResolutionModal from "../ConflictResolutionModal/ConflictResolutionModal";
import "./WorkingHoursSection.css";

const DAYS = [
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
  "Chủ nhật",
];

const DAY_NAMES = {
  1: "Thứ hai",
  2: "Thứ ba",
  3: "Thứ tư",
  4: "Thứ năm",
  5: "Thứ sáu",
  6: "Thứ bảy",
  7: "Chủ nhật",
};

function ShiftInputRow({ startTime, endTime, onChange }) {
  return (
    <span className="whs__shift-input-row">
      <input
        className="whs__time-input"
        type="time"
        value={startTime}
        onChange={(e) => onChange("start_time", e.target.value)}
      />
      <span className="whs__time-separator">-</span>
      <input
        className="whs__time-input"
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
      className={`whs__day-row${isClosed ? " whs__day-row--closed" : ""}${isActive ? " whs__day-row--active" : ""}`}
    >
      <div className="whs__day-label">
        <span className="whs__day-name">{dayLabel}</span>
        {!isActive && (
          <button className="whs__preview-btn" onClick={onClick}>
            Xem trước
          </button>
        )}
      </div>
      <div className="whs__day-controls">
        {isClosed ? (
          <span className="whs__closed-text">Đóng cửa</span>
        ) : editable ? (
          shifts.map((shift, i) => (
            <React.Fragment key={i}>
              <div className="whs__shift-line">
                {shifts.length > 1 && (
                  <span className="whs__shift-label">
                    {i === 0 ? "Ca 1" : i === 1 ? "Ca 2" : `Ca ${i + 1}`}
                  </span>
                )}
                <ShiftInputRow
                  startTime={shift.shift_start}
                  endTime={shift.shift_end}
                  onChange={(field, value) => onShiftChange(dayLabel, i, field, value)}
                />
                <button
                  className="whs__shift-action"
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
              <div className="whs__shift-line">
                {shifts.length > 1 && (
                  <span className="whs__shift-label">
                    {i === 0 ? "Ca 1" : i === 1 ? "Ca 2" : `Ca ${i + 1}`}
                  </span>
                )}
                <span className="whs__shift-time">
                  {shift.shift_start.slice(0, 5)} - {shift.shift_end.slice(0, 5)}
                </span>
              </div>
            </React.Fragment>
          ))
        )}
        {editable && (
          <button
            className="whs__shift-action whs__shift-action--add"
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

function GlobalHoursEditor({ editableShifts, onShiftChange, onAddShift, onRemoveShift, onToggleDay, editable }) {
  const activeDayNums = useMemo(
    () => new Set(editableShifts.map((s) => String(s.day_of_week))),
    [editableShifts],
  );

  const templateShifts = useMemo(() => {
    const firstActive = editableShifts.find((s) => activeDayNums.has(String(s.day_of_week)));
    if (!firstActive) return [];
    const dayNum = String(firstActive.day_of_week);
    return editableShifts.filter((s) => String(s.day_of_week) === dayNum);
  }, [editableShifts, activeDayNums]);

  return (
    <div className="whs__global-editor">
      <div className="whs__global-days">
        <span className="whs__global-days-label">Ngày hoạt động</span>
        <div className="whs__global-days-row">
          {DAYS.map((day, i) => {
            const dayNum = String(i + 1);
            const isActive = activeDayNums.has(dayNum);
            return (
              <label
                key={day}
                className={`whs__global-day-chip${isActive ? " whs__global-day-chip--active" : ""}${!editable ? " whs__global-day-chip--disabled" : ""}`}
              >
                <input
                  type="checkbox"
                  className="whs__global-day-checkbox"
                  checked={isActive}
                  onChange={() => onToggleDay(dayNum, !isActive)}
                  disabled={!editable}
                />
                <span className="whs__global-day-abbr">{day}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="whs__global-shifts">
        <span className="whs__global-shifts-label">Giờ mở cửa (áp dụng cho tất cả ngày hoạt động)</span>
        {templateShifts.length === 0 ? (
          <p className="whs__global-empty">Chưa chọn ngày hoạt động. Bật một ngày ở trên để đặt giờ.</p>
        ) : (
          templateShifts.map((shift, i) => (
            <div key={i} className="whs__global-shift-row">
              <span className="whs__shift-label">
                {templateShifts.length > 1
                  ? `Ca ${i + 1}`
                  : null}
              </span>
              {editable ? (
                <>
                  <ShiftInputRow
                    startTime={shift.shift_start}
                    endTime={shift.shift_end}
                    onChange={(field, value) => onShiftChange(i, field, value)}
                  />
                  {templateShifts.length > 1 && (
                    <button
                      className="whs__shift-action"
                      type="button"
                      onClick={() => onRemoveShift(i)}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </>
              ) : (
                <span className="whs__shift-time">
                  {shift.shift_start.slice(0, 5)} - {shift.shift_end.slice(0, 5)}
                </span>
              )}
            </div>
          ))
        )}
        {editable && templateShifts.length > 0 && (
          <button
            className="whs__shift-action whs__shift-action--add whs__global-add-shift"
            type="button"
            onClick={onAddShift}
          >
            <Plus size={14} />
            <span>Thêm ca</span>
          </button>
        )}
      </div>
    </div>
  );
}

GlobalHoursEditor.propTypes = {
  editableShifts: PropTypes.array.isRequired,
  onShiftChange: PropTypes.func.isRequired,
  onAddShift: PropTypes.func.isRequired,
  onRemoveShift: PropTypes.func.isRequired,
  onToggleDay: PropTypes.func.isRequired,
  editable: PropTypes.bool,
};

GlobalHoursEditor.defaultProps = {
  editable: true,
};

function getDerivedStatus(version, today, mostRecentActiveId) {
  if (version.effective_date <= today) {
    return version.version_id === mostRecentActiveId ? "Active" : "Expired";
  }
  return "Pending";
}

function WorkingHoursSection({
  isLoading,
  activeVersion,
  hasPendingVersion,
  noVersionExists,
  versions,
  activeHours,
  onRefetchAll,
}) {
  const [sameHoursAllDays, setSameHoursAllDays] = useState(true);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [editableShifts, setEditableShifts] = useState([]);
  const [saveState, setSaveState] = useState("idle");

  const [viewingVersion, setViewingVersion] = useState(null);
  const [viewingLoading, setViewingLoading] = useState(false);

  const [effectiveDate, setEffectiveDate] = useState("");
  const [minEffectiveDate, setMinEffectiveDate] = useState("");
  const [effectiveDateLoading, setEffectiveDateLoading] = useState(false);

  const [conflictData, setConflictData] = useState(null);
  const [showConflictModal, setShowConflictModal] = useState(false);

  const todayStr = todayVietnam();

  const mostRecentActiveId = useMemo(() => {
    const candidates = versions.filter((v) => v.effective_date <= todayStr);
    return candidates.length > 0 ? candidates[0].version_id : null;
  }, [versions, todayStr]);

  useEffect(() => {
    if (viewingVersion) return;
    if (activeHours.length > 0) {
      setEditableShifts(activeHours.map((s) => ({
        ...s,
        shift_start: s.start_time?.slice(0, 5) ?? "08:00",
        shift_end: s.end_time?.slice(0, 5) ?? "17:00",
      })));
    } else {
      setEditableShifts([]);
    }
  }, [activeHours, viewingVersion]);

  useEffect(() => {
    if (activeVersion) {
      setViewingVersion(activeVersion);
    }
  }, [activeVersion?.version_id]);

  useEffect(() => {
    if (!viewingVersion) return;
    let cancelled = false;
    setViewingLoading(true);
    clinicScheduleManagementService.getVersionById(viewingVersion.version_id)
      .then((res) => {
        if (cancelled) return;
        const hours = res.hours || [];
        setEditableShifts(hours.map((s) => ({
          ...s,
          shift_start: s.start_time?.slice(0, 5) ?? "08:00",
          shift_end: s.end_time?.slice(0, 5) ?? "17:00",
        })));
        setViewingLoading(false);
      })
      .catch(() => {
        if (!cancelled) setViewingLoading(false);
      });
    return () => { cancelled = true; };
  }, [viewingVersion]);

  useEffect(() => {
    setEffectiveDateLoading(true);
    clinicScheduleManagementService.getMinEffectiveDate()
      .then((res) => {
        setMinEffectiveDate(res.minEffectiveDate || "");
        setEffectiveDateLoading(false);
      })
      .catch(() => {
        setEffectiveDateLoading(false);
      });
  }, [versions]);

  useEffect(() => {
    if (viewingVersion) {
      setEffectiveDate(viewingVersion.effective_date || "");
    } else if (minEffectiveDate) {
      setEffectiveDate(minEffectiveDate);
    }
  }, [viewingVersion, minEffectiveDate]);

  const viewingFullVersion = viewingVersion
    ? versions?.find((v) => v.version_id === viewingVersion.version_id) ?? viewingVersion
    : null;

  const viewingStatus = viewingFullVersion
    ? getDerivedStatus(viewingFullVersion, todayStr, mostRecentActiveId)
    : null;
  const viewingIsPending = viewingStatus === "Pending";
  const viewingIsActive = viewingStatus === "Active";
  const viewingIsExpired = viewingStatus === "Expired";

  const isViewingEditable = viewingFullVersion && (
    viewingFullVersion.status === "Đang chờ" ||
    viewingFullVersion.status === "Expired" ||
    (viewingFullVersion.status === "Active" && !viewingFullVersion.hasLinkedWorkSlots)
  );
  const isEditingAllowed = !viewingVersion || isViewingEditable || (viewingIsActive && viewingFullVersion?.hasLinkedWorkSlots);

  function handleExitViewing() {
    setViewingVersion(activeVersion || null);
    onRefetchAll();
  }

  const selectedDayNum = Object.entries(DAY_NAMES).find(([, v]) => v === selectedDay)?.[0];
  const selectedShifts = useMemo(() => {
    if (sameHoursAllDays) {
      const activeNums = new Set(editableShifts.map((s) => String(s.day_of_week)));
      const first = editableShifts.find((s) => activeNums.has(String(s.day_of_week)));
      if (!first) return [];
      return editableShifts.filter((s) => String(s.day_of_week) === String(first.day_of_week));
    }
    return editableShifts.filter((s) => String(s.day_of_week) === selectedDayNum) ?? [];
  }, [editableShifts, selectedDayNum, sameHoursAllDays]);

  function handleShiftChange(dayLabel, shiftIndex, field, value) {
    const dayNum = Object.entries(DAY_NAMES).find(([, v]) => v === dayLabel)?.[0];
    const targetField = field === "start_time" ? "shift_start" : "shift_end";

    if (sameHoursAllDays) {
      const changedShift = editableShifts.find(
        (s) => String(s.day_of_week) === dayNum,
      );
      if (!changedShift) return;

      const newValue = value;
      const activeDayNums = new Set(editableShifts.map((s) => String(s.day_of_week)));

      setEditableShifts((prev) =>
        prev.map((s) => {
          if (!activeDayNums.has(String(s.day_of_week))) return s;
          if (String(s.day_of_week) === dayNum) {
            return { ...s, [targetField]: newValue };
          }
          if (shiftIndex === 0 && targetField === "shift_start") {
            return { ...s, shift_start: newValue };
          }
          if (shiftIndex === 0 && targetField === "shift_end") {
            return { ...s, shift_end: newValue };
          }
          return s;
        }),
      );
      return;
    }

    setEditableShifts((prev) => {
      let dayCount = 0;
      return prev.map((s) => {
        if (String(s.day_of_week) === dayNum) {
          if (dayCount === shiftIndex) {
            dayCount++;
            return { ...s, [targetField]: value };
          }
          dayCount++;
        }
        return s;
      });
    });
  }

  function handleAddShift(dayLabel) {
    const dayNum = Object.entries(DAY_NAMES).find(([, v]) => v === dayLabel)?.[0];
    setEditableShifts((prev) => {
      const dayShifts = prev.filter((s) => String(s.day_of_week) === dayNum);
      const lastEnd = dayShifts.length > 0
        ? dayShifts[dayShifts.length - 1].shift_end
        : "00:00";
      return [
        ...prev,
        { day_of_week: Number(dayNum), working_hour_id: null, shift_start: lastEnd, shift_end: "23:59" },
      ];
    });
  }

  function handleRemoveShift(dayLabel, shiftIndex) {
    const dayNum = Object.entries(DAY_NAMES).find(([, v]) => v === dayLabel)?.[0];
    setEditableShifts((prev) => {
      let dayCount = 0;
      return prev.filter((s) => {
        if (String(s.day_of_week) === dayNum) {
          if (dayCount === shiftIndex) {
            dayCount++;
            return false;
          }
          dayCount++;
        }
        return true;
      });
    });
  }

  function handleToggleSameHours() {
    if (!sameHoursAllDays) {
      const selectedDayNum = Object.entries(DAY_NAMES).find(([, v]) => v === selectedDay)?.[0];
      const sourceShifts = editableShifts.filter((s) => String(s.day_of_week) === selectedDayNum);
      if (sourceShifts.length === 0) return;

      const activeDayNums = new Set(editableShifts.map((s) => String(s.day_of_week)));
      const firstShift = sourceShifts[0];
      const secondShift = sourceShifts[1];

      setEditableShifts((prev) =>
        prev.map((s) => {
          if (!activeDayNums.has(String(s.day_of_week))) return s;
          if (String(s.day_of_week) === selectedDayNum) return s;
          if (secondShift) {
            const existing = prev.filter(
              (p) => String(p.day_of_week) === String(s.day_of_week),
            );
            if (existing.length < 2) {
              return s;
            }
          }
          return { ...s, shift_start: firstShift.shift_start, shift_end: firstShift.shift_end };
        }),
      );
    } else {
      setSelectedDay("Thứ hai");
    }
    setSameHoursAllDays((v) => !v);
  }

  function getActiveDayNums() {
    return new Set(editableShifts.map((s) => String(s.day_of_week)));
  }

  function getTemplateShifts() {
    const activeNums = getActiveDayNums();
    const first = editableShifts.find((s) => activeNums.has(String(s.day_of_week)));
    if (!first) return [];
    return editableShifts.filter((s) => String(s.day_of_week) === String(first.day_of_week));
  }

  function handleGlobalShiftChange(shiftIndex, field, value) {
    const targetField = field === "start_time" ? "shift_start" : "shift_end";
    const template = getTemplateShifts();
    if (!template[shiftIndex]) return;

    const activeNums = getActiveDayNums();

    setEditableShifts((prev) => {
      const dayCounters = {};
      return prev.map((s) => {
        const dayNum = String(s.day_of_week);
        if (!activeNums.has(dayNum)) return s;

        if (!(dayNum in dayCounters)) dayCounters[dayNum] = 0;
        const idx = dayCounters[dayNum];
        dayCounters[dayNum]++;

        if (idx === shiftIndex) {
          return { ...s, [targetField]: value };
        }
        return s;
      });
    });
  }

  function handleGlobalAddShift() {
    const template = getTemplateShifts();
    const lastEnd = template.length > 0 ? template[template.length - 1].shift_end : "00:00";
    const activeNums = getActiveDayNums();

    setEditableShifts((prev) => {
      const newShifts = [];
      activeNums.forEach((dayNum) => {
        newShifts.push({
          day_of_week: Number(dayNum),
          working_hour_id: null,
          shift_start: lastEnd,
          shift_end: "23:59",
        });
      });
      return [...prev, ...newShifts];
    });
  }

  function handleGlobalRemoveShift(shiftIndex) {
    const activeNums = getActiveDayNums();

    setEditableShifts((prev) => {
      const result = [];
      const seenDays = new Set();
      for (const s of prev) {
        if (!activeNums.has(String(s.day_of_week))) {
          result.push(s);
          continue;
        }
        const dayKey = String(s.day_of_week);
        if (!seenDays.has(dayKey)) {
          seenDays.add(dayKey);
          const dayShifts = prev.filter(
            (p) => String(p.day_of_week) === dayKey,
          );
          dayShifts.forEach((ds, i) => {
            if (i !== shiftIndex) result.push(ds);
          });
        }
      }
      return result;
    });
  }

  function handleToggleDay(dayNum, enable) {
    if (enable) {
      const template = getTemplateShifts();
      if (template.length > 0) {
        setEditableShifts((prev) => [
          ...prev,
          ...template.map((t) => ({
            day_of_week: Number(dayNum),
            working_hour_id: null,
            shift_start: t.shift_start,
            shift_end: t.shift_end,
          })),
        ]);
      } else {
        setEditableShifts((prev) => [
          ...prev,
          { day_of_week: Number(dayNum), working_hour_id: null, shift_start: "08:00", shift_end: "17:00" },
        ]);
      }
    } else {
      setEditableShifts((prev) =>
        prev.filter((s) => String(s.day_of_week) !== dayNum),
      );
    }
  }

  const timeSlots = useMemo(() => {
    if (!selectedShifts.length) return [];
    const duration = 30;
    const slots = [];

    selectedShifts.forEach((shift, si) => {
      if (si > 0) {
        const prevEnd = selectedShifts[si - 1].shift_end.slice(0, 5);
        const currStart = shift.shift_start.slice(0, 5);
        slots.push({ type: "break", label: `Nghỉ giữa ca (${prevEnd} - ${currStart})` });
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
  }, [selectedShifts]);

  const buildPayloads = () => {
    const hoursPayload = editableShifts.map((s) => ({
      day_of_week: s.day_of_week,
      start_time: s.shift_start,
      end_time: s.shift_end,
    }));
    return { hoursPayload };
  };

  const handleSave = async () => {
    for (const shift of editableShifts) {
      if (shift.shift_start >= shift.shift_end) {
        setSaveState("idle");
        alert(`Thời gian không hợp lệ cho ${DAY_NAMES[shift.day_of_week]}: giờ bắt đầu phải trước giờ kết thúc.`);
        return;
      }
    }

    const versionId = viewingVersion?.version_id || pendingVersion?.version_id || activeVersion?.version_id;
    if (!versionId) {
      onShowCreateVersionModal();
      return;
    }

    setSaveState("saving");
    try {
      const { hoursPayload } = buildPayloads();

      if (!versionId) {
        const result = await clinicScheduleManagementService.createVersionWithHours(
          "default",
          todayStr,
          hoursPayload
        );
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 2000);
        onRefetchAll();
        return;
      }

      const result = await clinicScheduleManagementService.saveAll(versionId, hoursPayload);

      if (result && result.success === false) {
        setConflictData({
          conflicts: result.conflicts,
          hours: hoursPayload,
          versionId,
        });
        setShowConflictModal(true);
        setSaveState("idle");
        return;
      }

      if (effectiveDate) {
        await clinicScheduleManagementService.updateEffectiveDate(versionId, effectiveDate);
      }

      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
      onRefetchAll();
    } catch (err) {
      const detail = err?.code ? `[${err.code}] ` : "";
      alert(`${detail}${err.message || "Không thể lưu thay đổi. Vui lòng thử lại."}`);
      setSaveState("idle");
    }
  };

  const handleForceSave = async () => {
    const versionId = viewingVersion?.version_id || pendingVersion?.version_id || activeVersion?.version_id;
    if (!versionId) return;

    setSaveState("saving");
    try {
      const { hoursPayload } = buildPayloads();
      await Promise.all([
        clinicScheduleManagementService.saveAll(versionId, hoursPayload),
        effectiveDate
          ? clinicScheduleManagementService.updateEffectiveDate(versionId, effectiveDate)
          : Promise.resolve(),
      ]);

      setConflictData(null);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
      onRefetchAll();
    } catch (err) {
      const detail = err?.code ? `[${err.code}] ` : "";
      alert(`${detail}${err.message || "Không thể lưu thay đổi. Vui lòng thử lại."}`);
      setSaveState("idle");
    }
  };

  const handleForceSave = async () => {
    const versionId = viewingVersion?.version_id || pendingVersion?.version_id || activeVersion?.version_id;
    if (!versionId) return;

    setSaveState("saving");
    try {
      const { hoursPayload } = buildPayloads();
      await Promise.all([
        clinicScheduleManagementService.saveAll(versionId, hoursPayload, true),
        effectiveDate
          ? clinicScheduleManagementService.updateEffectiveDate(versionId, effectiveDate)
          : Promise.resolve(),
      ]);

      setConflictData(null);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
      onRefetchAll();
    } catch (err) {
      const detail = err?.code ? `[${err.code}] ` : "";
      alert(`${detail}${err.message || "Không thể lưu thay đổi. Vui lòng thử lại."}`);
      setSaveState("idle");
    }
  };

  async function handleDeleteVersion(versionId) {
    try {
      await clinicScheduleManagementService.deleteVersion(versionId);
      onRefetchAll();
    } catch (err) {
      const detail = err?.code ? `[${err.code}] ` : "";
      alert(`${detail}${err.message || "Áp dụng thay đổi thất bại. Vui lòng thử lại."}`);
      setSaveState("idle");
      setShowConflictModal(false);
    }
  }

  async function handleScheduleForLater(selectedDate) {
    if (!conflictData) return;

    setSaveState("saving");
    try {
      await clinicScheduleManagementService.createVersionWithHours(
        null,
        selectedDate,
        conflictData.hours
      );

      setShowConflictModal(false);
      setConflictData(null);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
      onRefetchAll();
    } catch (err) {
      const detail = err?.code ? `[${err.code}] ` : "";
      alert(`${detail}${err.message || "Tạo phiên bản thất bại. Vui lòng thử lại."}`);
      setSaveState("idle");
      setShowConflictModal(false);
    }
  }

  function handleCancelConflict() {
    setShowConflictModal(false);
    setConflictData(null);
  }

  async function handleDeleteVersion(versionId) {
    if (!window.confirm("Xóa phiên bản này? Hành động này không thể hoàn tác.")) return;
    try {
      await clinicScheduleManagementService.deleteVersion(versionId);
      if (viewingVersion?.version_id === versionId) {
        setViewingVersion(activeVersion || null);
      }
      onRefetchAll();
    } catch (err) {
      alert(err.message || "Xóa phiên bản thất bại.");
    }
  }

  return (
    <>
      {noVersionExists && (
        <div className="whs__empty-state">
          <GitBranch size={48} className="whs__empty-state-icon" />
          <h2 className="whs__empty-state-title">Chưa cấu hình lịch</h2>
          <p className="whs__empty-state-text">
            Tạo phiên bản lịch đầu tiên để cấu hình giờ hoạt động và
            thiết lập quản lý thời gian cho phòng khám.
          </p>
          <button
            className="whs__btn whs__btn--primary"
            onClick={onShowCreateVersionModal}
          >
            <GitBranch size={18} className="whs__btn-icon" />
            Tạo phiên bản đầu tiên
          </button>
        </div>
      )}

      {viewingVersion && (
        <div className="whs__viewing-banner">
          <span className="whs__viewing-banner-text">
            Đang xem phiên bản "{viewingVersion.name || "Unnamed"}&quot;
            {viewingVersion.effective_date && ` (effective ${viewingVersion.effective_date})`}
            {viewingFullVersion?.status === "Expired" && " — đã hết hạn"}
            {!isViewingEditable && viewingFullVersion?.hasLinkedWorkSlots
              ? " — có lịch hẹn hiện tại"
              : (!isViewingEditable && " — chỉ đọc")}
          </span>
          <div className="whs__viewing-banner-actions">
            {viewingVersion.status === "Expired" && onReactivateVersion && (
              <button
                className="whs__viewing-banner-btn whs__viewing-banner-btn--reactivate"
                onClick={() => onReactivateVersion(viewingVersion.version_id)}
              >
                <RefreshCw size={14} />
                Kích hoạt lại
              </button>
            )}
            <button
              className="whs__viewing-banner-btn"
              onClick={handleExitViewing}
            >
              <ArrowLeft size={14} />
              Về bản hiện tại
            </button>
          </div>
        </div>
      )}

      {!noVersionExists && versions.length > 0 && (
        <section className="whs__card whs__versions">
          <div className="whs__card-header">
            <div className="whs__card-header-row">
              <div className="whs__card-header-left">
                <GitBranch size={24} className="whs__card-icon" />
                <h2 className="whs__card-title">Lịch sử phiên bản</h2>
              </div>
            </div>
          </div>
          <div className="whs__versions-list">
            {versions.map((v) => {
              const isActive = v.status === "Active";
              const isPending = v.status === "Đang chờ";
              const canDelete = isPending || (v.status === "Expired" && !v.hasLinkedWorkSlots);
              const isViewing = viewingVersion?.version_id === v.version_id;
              return (
                <div
                  key={v.version_id}
                  className={`whs__version-row${isViewing ? " whs__version-row--viewing" : ""}`}
                >
                  <div className="whs__version-row-left">
                    <span className={`whs__version-badge whs__version-badge--${status.toLowerCase()}`}>
                      {status}
                    </span>
                    <span className="whs__version-name">
                      {v.name || "Chưa đặt tên"}
                    </span>
                    <span className="whs__version-date">
                      Hiệu lực: {v.effective_date}
                    </span>
                  </div>
                  <div className="whs__version-row-right">
                    {!isViewing && (
                      <button
                        className="whs__version-view"
                        onClick={() => setViewingVersion(v)}
                        title="Xem phiên bản này"
                      >
                        <Eye size={14} />
                      </button>
                    )}
                    {!v.hasLinkedWorkSlots && (
                      <button
                        className="whs__version-delete"
                        onClick={() => handleDeleteVersion(v.version_id)}
                        title="Xóa phiên bản"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="whs__grid">
        {viewingLoading && (
          <div className="whs__viewing-loading">
            <RefreshCw size={18} className="whs__btn-icon--spin" />
            Đang tải dữ liệu phiên bản...
          </div>
        )}
        <div className="whs__left">
          <section className="whs__card">
            <div className="whs__card-header">
              <div className="whs__card-header-row">
                <div className="whs__card-header-left">
                  <Clock size={24} className="whs__card-icon" />
                  <h2 className="whs__card-title">Giờ hoạt động</h2>
                  <label className="whs__same-hours-toggle">
                    <input
                      type="checkbox"
                      className="whs__same-hours-checkbox"
                      checked={sameHoursAllDays}
                      onChange={handleToggleSameHours}
                      disabled={!isEditingAllowed}
                    />
                    <span className="whs__same-hours-slider" />
                    <span className="whs__same-hours-label">
                      Cùng giờ cho tất cả ngày hoạt động
                    </span>
                  </label>
                </div>
              </div>
            </div>
            {sameHoursAllDays ? (
              <GlobalHoursEditor
                editableShifts={editableShifts}
                onShiftChange={handleGlobalShiftChange}
                onAddShift={handleGlobalAddShift}
                onRemoveShift={handleGlobalRemoveShift}
                onToggleDay={handleToggleDay}
                editable={isEditingAllowed}
              />
            ) : (
              <div className="whs__day-list">
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
                      editable={isEditingAllowed}
                      onShiftChange={handleShiftChange}
                      onAddShift={handleAddShift}
                      onRemoveShift={handleRemoveShift}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <div className="whs__right">
          <section className="whs__card whs__preview--sticky">
            <div className="whs__card-header">
              <div className="whs__card-header-row">
                <div className="whs__card-header-left">
                  <CalendarDays size={24} className="whs__card-icon" />
                  <h2 className="whs__card-title">Xem trước lịch</h2>
                </div>
                <span className="whs__preview-label">
                  {sameHoursAllDays ? "Tất cả ngày hoạt động" : selectedDay}
                </span>
              </div>
            </div>
            <div className="whs__preview-grid">
              {timeSlots.length === 0 ? (
                <p className="whs__empty-text">Không có dữ liệu lịch cho {selectedDay}.</p>
              ) : timeSlots.map((slot, i) =>
                slot.type === "break" ? (
                  <div key={i} className="whs__preview-break">
                    <Coffee size={20} className="whs__preview-break-icon" />
                    <span>{slot.label}</span>
                  </div>
                ) : (
                  <div key={i} className="whs__preview-slot">
                    {slot.label}
                  </div>
                ),
              )}
            </div>
            <p className="whs__preview-note">
              * Xem trước dựa trên thời lượng 30 phút và {sameHoursAllDays ? "tất cả ngày hoạt động" : `ngày ${selectedDay}`} giờ hoạt động.
            </p>

            <div className="whs__effective-date">
              <label className="whs__effective-date-label">Ngày hiệu lực</label>
              <div className="whs__effective-date-row">
                <input
                  type="date"
                  className="whs__effective-date-input"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  min={minEffectiveDate || undefined}
                  disabled={!isEditingAllowed || effectiveDateLoading}
                />
                {minEffectiveDate && (
                  <span className="whs__effective-date-hint">
                    Tối thiểu: {minEffectiveDate}
                  </span>
                )}
              </div>
              <p className="whs__field-hint">
                Phiên bản này sẽ có hiệu lực vào ngày đã chọn. Ngày tối thiểu được đặt sau tất cả lịch hẹn đã đặt hiện tại.
              </p>
            </div>

            <button
              className={`whs__btn whs__btn--primary whs__save-btn${saveState !== "idle" ? " whs__btn--loading" : ""}`}
              onClick={handleSave}
              disabled={saveState !== "idle" || !isEditingAllowed || (hasPendingVersion && viewingVersion?.version_id !== pendingVersion?.version_id)}
              title={hasPendingVersion && viewingVersion?.version_id !== pendingVersion?.version_id ? "Vui lòng hủy hoặc kích hoạt phiên bản Pending trước khi lưu." : ""}
            >
              {saveState === "saving" ? (
                <RefreshCw size={18} className="whs__btn-icon whs__btn-icon--spin" />
              ) : saveState === "saved" ? (
                <CheckCircle size={18} className="whs__btn-icon" />
              ) : (
                <Save size={18} className="whs__btn-icon" />
              )}
              {saveState === "saving"
                ? "Đang cập nhật..."
                : saveState === "saved"
                  ? "Đã lưu thành công"
                  : "Lưu thay đổi"}
            </button>
            {hasPendingVersion && viewingVersion?.version_id !== pendingVersion?.version_id && (
              <p className="whs__field-hint">
                Vui lòng hủy phiên bản Pending hiện tại trước khi tạo phiên bản mới.
              </p>
            )}
          </section>
        </div>
      </div>

      {showConflictModal && conflictData && (
        <ConflictResolutionModal
          conflicts={conflictData.conflicts}
          hours={conflictData.hours}
          onForceSave={handleForceSave}
          onScheduleForLater={handleScheduleForLater}
          onCancel={handleCancelConflict}
        />
      )}
    </>
  );
}

WorkingHoursSection.propTypes = {
  isLoading: PropTypes.bool,
  activeVersion: PropTypes.shape({
    version_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    effective_date: PropTypes.string,
    hasLinkedWorkSlots: PropTypes.bool,
  }),
  hasPendingVersion: PropTypes.bool.isRequired,
  noVersionExists: PropTypes.bool.isRequired,
  versions: PropTypes.arrayOf(
    PropTypes.shape({
      version_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string,
      effective_date: PropTypes.string,
      hasLinkedWorkSlots: PropTypes.bool,
    }),
  ),
  activeHours: PropTypes.array,
  onRefetchAll: PropTypes.func.isRequired,
};

WorkingHoursSection.defaultProps = {
  isLoading: false,
  activeVersion: null,
  versions: [],
  activeHours: [],
};

export default WorkingHoursSection;
