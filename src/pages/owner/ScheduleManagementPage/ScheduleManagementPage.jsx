import React, { useState } from "react";
import {
  CalendarX,
  Clock,
  GitBranch,
} from "lucide-react";
import OwnerPageShell from "../OwnerPageShell";
import { useWorkingHour, useClinicClosures, useVersions } from "../../../hooks/useClinicScheduleManagement";
import { clinicScheduleManagementService } from "../../../services/clinicScheduleManagement.service";
import CreateVersionModal from "../../../components/features/owner/CreateVersionModal/CreateVersionModal";
import WorkingHoursSection from "../../../components/features/owner/WorkingHoursSection/WorkingHoursSection";
import ClinicHolidays from "../../../components/features/owner/ClinicHolidays/ClinicHolidays";
import "./ScheduleManagementPage.css";

function ScheduleManagementPage() {
  const { data: workingHourData, refetch: refetchWorkingHour } = useWorkingHour();
  const { data: closures, refetch: refetchClosures } = useClinicClosures();
  const { data: versions, refetch: refetchVersions } = useVersions();

  const activeVersion = workingHourData?.active?.version ?? null;
  const activeHours = workingHourData?.active?.hours ?? [];
  const pendingVersion = workingHourData?.pending?.version ?? null;
  const pendingHours = workingHourData?.pending?.hours ?? [];

  const hasPendingVersion = !!pendingVersion;
  const noVersionExists = !activeVersion && !pendingVersion;
  const isFirstVersion = !versions || versions.length === 0;

  const [activeTab, setActiveTab] = useState("hours");
  const [showCreateVersionModal, setShowCreateVersionModal] = useState(false);
  const [focusVersionId, setFocusVersionId] = useState(null);

  const closedDays = (() => {
    const closed = new Set([1, 2, 3, 4, 5, 6, 7]);
    const sourceHours = pendingVersion ? pendingHours : activeHours;
    sourceHours.forEach((s) => closed.delete(s.day_of_week));
    return closed;
  })();

  async function handleConfirmCreateVersion(name) {
    try {
      const result = await clinicScheduleManagementService.createVersion(name);
      setFocusVersionId(result.version.version_id);
      setShowCreateVersionModal(false);
      refetchWorkingHour();
      refetchVersions();
    } catch (err) {
      const detail = err?.code ? `[${err.code}] ` : "";
      alert(`${detail}${err.message || "Không thể tạo phiên bản. Vui lòng thử lại."}`);
    }
  }

  function handleRefetchAll() {
    refetchWorkingHour();
    refetchVersions();
  }

  async function handleReactivateVersion(versionId) {
    try {
      await clinicScheduleManagementService.activateVersion(versionId);
      setFocusVersionId(versionId);
      handleRefetchAll();
    } catch (err) {
      const detail = err?.code ? `[${err.code}] ` : "";
      alert(`${detail}${err.message || "Không thể kích hoạt lại phiên bản. Vui lòng thử lại."}`);
    }
  }

  return (
    <OwnerPageShell contentClassName="schedule-config-page">
      <div className="schedule-config">
        <header className="schedule-config__header">
          <div>
            <h1 className="schedule-config__title">Bảng cấu hình</h1>
            <p className="schedule-config__subtitle">
              Cập nhật giờ khám, logic đặt lịch và lịch nghỉ.
            </p>
          </div>
          {noVersionExists && (
            <div className="schedule-config__header-actions">
              <button
                className="schedule-config__btn schedule-config__btn--primary"
                onClick={() => setShowCreateVersionModal(true)}
              >
                <GitBranch size={18} className="schedule-config__btn-icon" />
                Tạo phiên bản
              </button>
            </div>
          )}
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
            Holidays
          </button>
        </div>

        {activeTab === "hours" && (
          <WorkingHoursSection
            activeVersion={activeVersion}
            pendingVersion={pendingVersion}
            hasPendingVersion={hasPendingVersion}
            noVersionExists={noVersionExists}
            versions={versions}
            activeHours={activeHours}
            pendingHours={pendingHours}
            focusVersionId={focusVersionId}
            onShowCreateVersionModal={() => setShowCreateVersionModal(true)}
            onRefetchAll={handleRefetchAll}
            onReactivateVersion={handleReactivateVersion}
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

      {showCreateVersionModal && (
        <CreateVersionModal
          isFirstVersion={isFirstVersion}
          onConfirm={handleConfirmCreateVersion}
          onCancel={() => setShowCreateVersionModal(false)}
        />
      )}
    </OwnerPageShell>
  );
}

export default ScheduleManagementPage;
