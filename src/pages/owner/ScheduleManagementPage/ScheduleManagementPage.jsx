import React, { useState } from "react";
import {
  CalendarX,
  Clock,
} from "lucide-react";
import OwnerPageShell from "../OwnerPageShell";
import { useWorkingHour, useClinicClosures } from "../../../hooks/useClinicScheduleManagement";
import WorkingHoursSection from "../../../components/features/owner/WorkingHoursSection/WorkingHoursSection";
import ClinicHolidays from "../../../components/features/owner/ClinicHolidays/ClinicHolidays";
import { todayVietnam } from "../../../utils/dateUtils";
import "./ScheduleManagementPage.css";

function ScheduleManagementPage() {
  const { data: workingHourData, isLoading, refetch: refetchWorkingHour } = useWorkingHour();
  const { data: closures, refetch: refetchClosures } = useClinicClosures();

  const today = todayVietnam();

  const allVersionEntries = workingHourData?.versions ?? [];

  const versions = allVersionEntries.map((entry) => ({
    ...entry.version,
    hours: entry.hours,
  }));

  const activeVersion = versions.find((v) => v.effective_date <= today) || versions[0] || null;
  const activeHours = activeVersion?.hours ?? [];

  const hasPendingVersion = versions.some((v) => v.effective_date > today);
  const noVersionExists = versions.length === 0;

  const [activeTab, setActiveTab] = useState("hours");

  const closedDays = (() => {
    const closed = new Set([1, 2, 3, 4, 5, 6, 7]);
    const sourceHours = activeVersion?.hours ?? [];
    sourceHours.forEach((s) => closed.delete(s.day_of_week));
    return closed;
  })();

  function handleRefetchAll() {
    refetchWorkingHour();
  }

  return (
    <OwnerPageShell contentClassName="schedule-config-page">
      <div className="schedule-config">
        <header className="schedule-config__header">
          <div>
            <h1 className="schedule-config__title">Bảng cấu hình lịch</h1>
            <p className="schedule-config__subtitle">
              Cập nhật giờ làm việc, logic hẹn lịch, và lịch nghỉ lễ.
            </p>
          </div>
        </header>

        <div className="schedule-config__tabs">
          <button
            className={`schedule-config__tab${activeTab === "hours" ? " schedule-config__tab--active" : ""}`}
            onClick={() => setActiveTab("hours")}
          >
            <Clock size={18} className="schedule-config__tab-icon" />
            Giờ làm việc
          </button>
          <button
            className={`schedule-config__tab${activeTab === "holidays" ? " schedule-config__tab--active" : ""}`}
            onClick={() => setActiveTab("holidays")}
          >
            <CalendarX size={18} className="schedule-config__tab-icon" />
            Ngày nghỉ
          </button>
        </div>

        {activeTab === "hours" && (
          <WorkingHoursSection
            isLoading={isLoading}
            activeVersion={activeVersion}
            hasPendingVersion={hasPendingVersion}
            noVersionExists={noVersionExists}
            versions={versions}
            activeHours={activeHours}
            onRefetchAll={handleRefetchAll}
          />
        )}

        {activeTab === "holidays" && (
          <ClinicHolidays
            closures={closures}
            closedDays={closedDays}
            onRefetchClosures={refetchClosures}
          />
        )}
      </div>
    </OwnerPageShell>
  );
}

export default ScheduleManagementPage;
