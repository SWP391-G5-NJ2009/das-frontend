import { useState, useCallback, useMemo } from "react";
import { AlertTriangle, CalendarPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../../context/AuthContext";
import PatientPageShell from "../../patient/PatientPageShell";
import ReceptionistPageShell from "../../receptionist/ReceptionistPageShell";
import DentistPageShell from "../../dentist/DentistPageShell";
import Spinner from "../../../components/common/Spinner/Spinner";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import AppointmentFilters from "../../../components/features/appointments/AppointmentFilters/AppointmentFilters";
import AppointmentTable from "../../../components/features/appointments/AppointmentTable/AppointmentTable";
import CancelConfirmModal from "../../../components/features/appointments/CancelConfirmModal/CancelConfirmModal";
import LiftBanModal from "../../../components/features/appointments/LiftBanModal/LiftBanModal";
import NoShowConfirmModal from "../../../components/features/appointments/NoShowConfirmModal/NoShowConfirmModal";
import Toast from "../../../components/common/Toast/Toast";
import Pagination from "../../../components/common/Pagination/Pagination";
import {
  useMyAppointments,
  useAllAppointments,
} from "../../../hooks/useAppointments";
import { patientService } from "../../../services/patient.service";
import "./AppointmentsPage.css";

const PAGE_SIZE = 10;

const ROLE_CONFIG = {
  patient: {
    title: "Lịch hẹn của tôi",
    subtitle: "Xem và quản lý các lịch hẹn đã đặt.",
    bookRoute: "/patient/booking",
    bookBtnId: "patient-book-new-btn",
    headingId: "appts-page-title",
    showPatientInfo: false,
    showRoom: false,
    showBookBtn: true,
    statusOptions: null,
  },
  receptionist: {
    title: "Danh sách lịch hẹn",
    subtitle: "Quản lý và theo dõi tất cả lịch hẹn phòng khám.",
    bookRoute: "/receptionist/book-appointment",
    bookBtnId: "book-appointment-nav-btn",
    headingId: "appts-page-title",
    showPatientInfo: true,
    showRoom: true,
    showBookBtn: true,
    statusOptions: null,
  },
  dentist: {
    title: "Lịch hẹn của tôi",
    subtitle: "Xem tất cả lịch hẹn được phân công cho bạn.",
    bookRoute: null,
    bookBtnId: null,
    headingId: "appts-page-title",
    showPatientInfo: true,
    showRoom: false,
    showBookBtn: false,
    statusOptions: [
      { value: "all", label: "Tất cả" },
      { value: "Confirmed", label: "Đã xác nhận" },
      { value: "Checked-in", label: "Đã check-in" },
    ],
  },
};

function useAppointmentsByRole(role, filters) {
  const isPatient = role === "patient";
  const isStaff = role === "receptionist" || role === "dentist";
  const patient = useMyAppointments(isPatient ? filters : {}, {
    enabled: isPatient,
  });
  const staff = useAllAppointments(isStaff ? filters : {}, {
    enabled: isStaff,
  });
  return role === "patient" ? patient : staff;
}


function PageShell({ role, children }) {
  if (role === "receptionist") {
    return (
      <ReceptionistPageShell
        contentClassName="appts-page"
        contentLabelledBy="appts-page-title"
      >
        {children}
      </ReceptionistPageShell>
    );
  }
  if (role === "dentist") {
    return <DentistPageShell>{children}</DentistPageShell>;
  }
  return <PatientPageShell>{children}</PatientPageShell>;
}

PageShell.propTypes = {
  role: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

function AppointmentsPage() {
  const { user } = useAuth();
  const role = user?.role ?? "patient";
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.patient;
  const isReceptionist = role === "receptionist";
  const navigate = useNavigate();

  const today = new Date();
  const todayYear = String(today.getFullYear());
  const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
  const todayDay = String(today.getDate()).padStart(2, "0");

  const isPatient = role === "patient";

  const [dateParts, setDateParts] = useState(
    isPatient
      ? { year: "", month: "", day: "" }
      : { year: todayYear, month: todayMonth, day: todayDay }
  );

  const isDentist = role === "dentist";

  const [filters, setFilters] = useState({
    status: isPatient ? "Confirmed" : isReceptionist ? "Confirmed" : isDentist ? "Confirmed" : "all",
    date: isPatient ? "" : `${todayYear}-${todayMonth}-${todayDay}`,
    month: "",
    year: "",
    search: "",
  });

  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [liftBanTarget, setLiftBanTarget] = useState(null);
  const [isLiftingBan, setIsLiftingBan] = useState(false);
  const [toast, setToast] = useState(null);
  const [checkingInId, setCheckingInId] = useState(null);
  const [startingTreatmentId, setStartingTreatmentId] = useState(null);
  const [noShowTarget, setNoShowTarget] = useState(null);
  const [isMarkingNoShow, setIsMarkingNoShow] = useState(false);
  const [markingNoShowId, setMarkingNoShowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    appointments,
    isLoading,
    error,
    cancelAppointment,
    checkInAppointment,
    markNoShow,
    startTreatment,
    refetch,
  } = useAppointmentsByRole(role, filters);
  const conflictAlerts = useAllAppointments(
    isReceptionist ? { status: "Conflict" } : {},
    { enabled: isReceptionist },
  );

  const handleStatusChange = useCallback((status) => {
    setFilters((prev) => ({ ...prev, status }));
    setCurrentPage(1);
  }, []);

  const handleDatePartsChange = useCallback(({ year, month, day }) => {
    setDateParts({ year, month, day });
    setFilters((prev) => ({
      ...prev,
      date: year && month && day ? `${year}-${month}-${day}` : "",
      month: year && month && !day ? `${year}-${month}` : "",
      year: year && !month ? year : "",
    }));
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((search) => {
    setFilters((prev) => ({ ...prev, search }));
    setCurrentPage(1);
  }, []);

  const handleViewConflictAppointments = useCallback(() => {
    setDateParts({ year: "", month: "", day: "" });
    setFilters((prev) => ({
      ...prev,
      status: "Conflict",
      date: "",
      month: "",
      year: "",
    }));
    setCurrentPage(1);
  }, []);

  const handleTodayClick = useCallback(() => {
    setFilters((prev) => {
      const isCurrentlyToday =
        prev.date === `${todayYear}-${todayMonth}-${todayDay}`;

      if (isCurrentlyToday) {
        setDateParts({ year: "", month: "", day: "" });
        return {
          ...prev,
          date: "",
          month: "",
          year: "",
        };
      } else {
        setDateParts({ year: todayYear, month: todayMonth, day: todayDay });
        return {
          ...prev,
          date: `${todayYear}-${todayMonth}-${todayDay}`,
          month: "",
          year: "",
        };
      }
    });
    setCurrentPage(1);
  }, [todayYear, todayMonth, todayDay]);

  const isTodayActive =
    filters.date === `${todayYear}-${todayMonth}-${todayDay}`;

  const handleRequestCancel = useCallback((appointment) => {
    setAppointmentToCancel(appointment);
  }, []);

  const handleConfirmCancel = useCallback(
    async (reason) => {
      if (!appointmentToCancel) return;
      setIsCancelling(true);
      try {
        await cancelAppointment(appointmentToCancel.id, reason);
        setToast({
          type: "success",
          message: "Lịch hẹn đã được hủy thành công!",
        });
      } finally {
        setIsCancelling(false);
        setAppointmentToCancel(null);
      }
    },
    [appointmentToCancel, cancelAppointment],
  );

  const handleCloseModal = useCallback(() => {
    if (!isCancelling) setAppointmentToCancel(null);
  }, [isCancelling]);

  const handleWithin24hCancel = useCallback(() => {
    setToast({
      type: "warning",
      message:
        "Chỉ có thể hủy lịch hẹn trước ít nhất 24 giờ. Vui lòng liên hệ trực tiếp với lễ tân để được hỗ trợ.",
    });
  }, []);

  const handleDismissToast = useCallback(() => setToast(null), []);

  const handleCheckIn = useCallback(
    async (appointment) => {
      setCheckingInId(appointment.id);
      try {
        await checkInAppointment(appointment.id);
        setToast({
          type: "success",
          message: "Check-in bệnh nhân thành công.",
        });
      } catch (requestError) {
        setToast({
          type: "error",
          message: requestError.message || "Không thể check-in bệnh nhân.",
        });
      } finally {
        setCheckingInId(null);
      }
    },
    [checkInAppointment],
  );

  const handleStartTreatment = useCallback(
    async (appointment) => {
      setStartingTreatmentId(appointment.id);
      try {
        await startTreatment(appointment.id);
        setToast({
          type: "success",
          message: "Đã bắt đầu điều trị cho bệnh nhân.",
        });
        handleStatusChange("In-Treatment");
      } catch (requestError) {
        setToast({
          type: "error",
          message: requestError.message || "Không thể bắt đầu điều trị.",
        });
      } finally {
        setStartingTreatmentId(null);
      }
    },
    [handleStatusChange, startTreatment],
  );

  const handleRequestMarkNoShow = useCallback((appt) => {
    setNoShowTarget(appt);
  }, []);

  const handleConfirmMarkNoShow = useCallback(async () => {
    if (!noShowTarget) return;
    setIsMarkingNoShow(true);
    setMarkingNoShowId(noShowTarget.id);
    try {
      await markNoShow(noShowTarget.id);
      setToast({
        type: "success",
        message: `Đã đánh dấu No-Show cho ${noShowTarget.patientName}.`,
      });
      setNoShowTarget(null);
    } catch (requestError) {
      setToast({
        type: "error",
        message: requestError.message || "Không thể đánh dấu No-Show.",
      });
    } finally {
      setIsMarkingNoShow(false);
      setMarkingNoShowId(null);
    }
  }, [markNoShow, noShowTarget]);

  const handleCloseNoShowModal = useCallback(() => {
    if (!isMarkingNoShow) setNoShowTarget(null);
  }, [isMarkingNoShow]);

  const handleRequestLiftBan = useCallback((appt) => {
    setLiftBanTarget(appt);
  }, []);

  const handleConfirmLiftBan = useCallback(async () => {
    if (!liftBanTarget) return;
    setIsLiftingBan(true);
    try {
      await patientService.liftBan(liftBanTarget.patientId);
      setToast({
        type: "success",
        message: "Cập nhật trạng thái biểu mẫu thành công.",
      });
      setLiftBanTarget(null);
      window.location.reload();
    } catch {
      setToast({
        type: "error",
        message: "Gỡ bỏ hạn chế đặt lịch thất bại. Vui lòng thử lại.",
      });
    } finally {
      setIsLiftingBan(false);
    }
  }, [liftBanTarget]);

  const handleCloseLiftBanModal = useCallback(() => {
    if (!isLiftingBan) setLiftBanTarget(null);
  }, [isLiftingBan]);

  const totalPage = Math.max(1, Math.ceil(appointments.length / PAGE_SIZE));
  const paginatedAppointments = useMemo(
    () =>
      appointments.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      ),
    [appointments, currentPage],
  );

  return (
    <PageShell role={role}>
      <section
        className="appts-page__section"
        aria-labelledby={config.headingId}
      >
        <div className="appts-page__header">
          <div className="appts-page__heading">
            <h1 id={config.headingId}>{config.title}</h1>
            <p>{config.subtitle}</p>
          </div>

          {config.showBookBtn && (
            <button
              id={config.bookBtnId}
              type="button"
              className="appts-page__book-btn"
              onClick={() => navigate(config.bookRoute)}
              aria-label="Đặt lịch hẹn mới"
            >
              <CalendarPlus size={18} aria-hidden="true" />
              Đặt lịch hẹn mới
            </button>
          )}
        </div>

        {isReceptionist && conflictAlerts.appointments.length > 0 && (
          <div className="appts-page__urgent-alert" role="alert">
            <AlertTriangle size={20} aria-hidden="true" />
            <div className="appts-page__urgent-copy">
              <strong>Nhiệm vụ sắp xếp lại khẩn cấp</strong>
              <span>
                {conflictAlerts.appointments.length} lịch hẹn trùng lịch cần lễ
                tân xử lý.
              </span>
            </div>
            <button
              className="appts-page__urgent-action"
              type="button"
              onClick={handleViewConflictAppointments}
            >
              Xem trùng lịch
            </button>
          </div>
        )}

        <AppointmentFilters
          filters={{ ...filters, ...dateParts }}
          onStatusChange={handleStatusChange}
          onDatePartsChange={handleDatePartsChange}
          onSearchChange={handleSearchChange}
          onTodayClick={handleTodayClick}
          isTodayActive={isTodayActive}
          statusOptions={config.statusOptions}
        />

        {isLoading && <Spinner />}

        {!isLoading && error && (
          <EmptyState
            message={`Lỗi: ${error?.message || "Không thể tải lịch hẹn. Vui lòng thử lại."}`}
          />
        )}

        {!isLoading && !error && appointments.length === 0 && (
          <EmptyState message="Không tìm thấy lịch hẹn nào." />
        )}

        {!isLoading && !error && appointments.length > 0 && (
          <>
            <AppointmentTable
              appointments={paginatedAppointments}
              onCancel={handleRequestCancel}
              onWithin24hCancel={handleWithin24hCancel}
              onLiftBan={role === "receptionist" ? handleRequestLiftBan : null}
              onCheckIn={role === "receptionist" ? handleCheckIn : null}
              checkingInId={checkingInId}
              onMarkNoShow={role === "receptionist" ? handleRequestMarkNoShow : null}
              markingNoShowId={markingNoShowId}
              onStartTreatment={
                role === "dentist" ? handleStartTreatment : null
              }
              startingTreatmentId={startingTreatmentId}
              showPatientInfo={config.showPatientInfo}
              showRoom={config.showRoom}
              actorRole={role}
            />
            <div className="appts-page__pagination">
              <p className="appts-page__pagination-info">
                Hiển thị {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, appointments.length)} trong
                tổng số {appointments.length} lịch hẹn
              </p>
              <Pagination
                currentPage={currentPage}
                totalPage={totalPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </section>

      <CancelConfirmModal
        isOpen={!!appointmentToCancel}
        appointment={appointmentToCancel}
        actorRole={role}
        onConfirm={handleConfirmCancel}
        onClose={handleCloseModal}
        isLoading={isCancelling}
      />

      <LiftBanModal
        isOpen={!!liftBanTarget}
        patient={liftBanTarget}
        onConfirm={handleConfirmLiftBan}
        onClose={handleCloseLiftBanModal}
        isLoading={isLiftingBan}
      />

      <NoShowConfirmModal
        isOpen={!!noShowTarget}
        appointment={noShowTarget}
        onConfirm={handleConfirmMarkNoShow}
        onClose={handleCloseNoShowModal}
        isLoading={isMarkingNoShow}
      />

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={handleDismissToast}
          duration={5000}
        />
      )}
    </PageShell>
  );
}

export default AppointmentsPage;
