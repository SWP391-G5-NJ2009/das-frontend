import React, { useState } from "react";
import {
  Clock,
} from "lucide-react";
import OwnerPageShell from "../OwnerPageShell";
import { useWorkingHour } from "../../../hooks/useClinicScheduleManagement";
import WorkingHoursSection from "../../../components/features/owner/WorkingHoursSection/WorkingHoursSection";
import { todayVietnam } from "../../../utils/dateUtils";
import "./ScheduleManagementPage.css";

function ScheduleManagementPage() {
  const { data: workingHourData, isLoading, refetch: refetchWorkingHour } = useWorkingHour();

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
              Cập nhật giờ làm việc, logic hẹn lịch.
            </p>
          </div>
        </header>

        <WorkingHoursSection
          isLoading={isLoading}
          activeVersion={activeVersion}
          hasPendingVersion={hasPendingVersion}
          noVersionExists={noVersionExists}
          versions={versions}
          activeHours={activeHours}
          onRefetchAll={handleRefetchAll}
        />
      </div>
    </OwnerPageShell>
  );
}

export default ScheduleManagementPage;
