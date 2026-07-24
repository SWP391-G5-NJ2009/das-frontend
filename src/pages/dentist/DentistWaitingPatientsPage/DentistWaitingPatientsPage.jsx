import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, History, Search, X } from "lucide-react";
import Badge from "../../../components/common/Badge/Badge";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import Spinner from "../../../components/common/Spinner/Spinner";
import Pagination from "../../../components/common/Pagination/Pagination";
import { useAuth } from "../../../context/AuthContext";
import { useAllAppointments } from "../../../hooks/useAppointments";
import DentistPageShell from "../DentistPageShell";
import "./DentistWaitingPatientsPage.css";

const PAGE_SIZE = 10;

function formatDate(date) {
  return date ? date.split("-").reverse().join("/") : "Chưa có lịch";
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDefaultFollowUpForm() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    appointmentDate: toIsoDate(tomorrow),
    appointmentTime: "09:00",
    reason: "",
  };
}

function getPatientKey(appointment) {
  return appointment.patientId || appointment.patientPhone || appointment.id;
}

function getAppointmentDateTime(appointment) {
  return `${appointment.scheduledDate ?? ""} ${appointment.scheduledTime ?? ""}`;
}

function compareAppointmentsDesc(a, b) {
  return getAppointmentDateTime(b).localeCompare(getAppointmentDateTime(a));
}

function normalizeSearchValue(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function buildPatientRows(appointments) {
  const groups = appointments.reduce((result, appointment) => {
    const key = getPatientKey(appointment);
    const patientAppointments = result.get(key) || [];
    result.set(key, [...patientAppointments, appointment]);
    return result;
  }, new Map());

  return Array.from(groups.values())
    .map((patientAppointments) => {
      const latestAppointment = patientAppointments
        .slice()
        .sort(compareAppointmentsDesc)[0];
      if (!latestAppointment) return null;
      return {
        latestDate: latestAppointment.scheduledDate || "",
        latestTime: latestAppointment.scheduledTime || "",
        latestTimeEnd: latestAppointment.scheduledTimeEnd || "",
        patientId: latestAppointment.patientId,
        patientName: latestAppointment.patientName || "Chưa cập nhật",
        patientPhone: latestAppointment.patientPhone || "",
        latestAppointment,
        status: latestAppointment.status || "Waiting",
        serviceName: latestAppointment.serviceName || "Chưa cập nhật",
      };
    })
    .filter(Boolean)
    .sort((a, b) =>
      compareAppointmentsDesc(a.latestAppointment, b.latestAppointment),
    );
}

function FollowUpReminderModal({
  error,
  form,
  patient,
  onChange,
  onClose,
  onSubmit,
}) {
  if (!patient) return null;

  return (
    <div
      className="dentist-waiting-patients__modal-overlay"
      role="presentation"
    >
      <section
        className="dentist-waiting-patients__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="follow-up-title"
      >
        <header className="dentist-waiting-patients__modal-header">
          <div>
            <h2 id="follow-up-title">Schedule Follow-up Appointment</h2>
            <p>{patient.patientName}</p>
          </div>
          <button
            className="dentist-waiting-patients__modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close follow-up reminder"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <form
          className="dentist-waiting-patients__follow-up-form"
          onSubmit={onSubmit}
        >
          {error && (
            <div className="dentist-waiting-patients__form-error">{error}</div>
          )}

          <div className="dentist-waiting-patients__form-grid">
            <label>
              <span>Appointment date</span>
              <input
                type="date"
                name="appointmentDate"
                value={form.appointmentDate}
                min={toIsoDate(new Date())}
                onChange={onChange}
                required
              />
            </label>
            <label>
              <span>Appointment time</span>
              <input
                type="time"
                name="appointmentTime"
                value={form.appointmentTime}
                onChange={onChange}
                required
              />
            </label>
          </div>

          <label>
            <span>Treatment reason</span>
            <textarea
              name="reason"
              value={form.reason}
              onChange={onChange}
              rows="4"
              maxLength={500}
              placeholder="Treatment progress check, recovery monitoring..."
              required
            />
          </label>

          <footer className="dentist-waiting-patients__modal-actions">
            <button
              className="dentist-waiting-patients__modal-btn dentist-waiting-patients__modal-btn--secondary"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="dentist-waiting-patients__modal-btn dentist-waiting-patients__modal-btn--primary"
              type="submit"
            >
              Confirm Reminder
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

function DentistWaitingPatientsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [followUpError, setFollowUpError] = useState("");
  const [followUpForm, setFollowUpForm] = useState(getDefaultFollowUpForm);
  const [followUpMessage, setFollowUpMessage] = useState("");
  const [followUpTarget, setFollowUpTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { appointments, error, isLoading } = useAllAppointments({});

  const patients = useMemo(() => {
    const ownAppointments = user?.profileId
      ? appointments.filter(
          (appointment) =>
            String(appointment.dentistId) === String(user.profileId),
        )
      : appointments;
    return buildPatientRows(ownAppointments);
  }, [appointments, user?.profileId]);

  const filteredPatients = useMemo(() => {
    const keyword = normalizeSearchValue(searchTerm);
    if (!keyword) return patients;

    return patients.filter((patient) =>
      [patient.patientName, patient.patientPhone, patient.serviceName].some(
        (value) => normalizeSearchValue(value).includes(keyword),
      ),
    );
  }, [patients, searchTerm]);

  const totalPage = Math.max(1, Math.ceil(filteredPatients.length / PAGE_SIZE));
  const paginatedPatients = useMemo(
    () =>
      filteredPatients.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
      ),
    [currentPage, filteredPatients],
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPage));
  }, [totalPage]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const openFollowUpModal = (patient) => {
    setFollowUpTarget(patient);
    setFollowUpForm(getDefaultFollowUpForm());
    setFollowUpError("");
    setFollowUpMessage("");
  };

  const handleFollowUpChange = (event) => {
    const { name, value } = event.target;
    setFollowUpForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleFollowUpSubmit = (event) => {
    event.preventDefault();

    const reason = followUpForm.reason.trim();
    const followUpDateTime = new Date(
      `${followUpForm.appointmentDate}T${followUpForm.appointmentTime}:00`,
    );

    if (!reason) {
      setFollowUpError("Treatment reason is required.");
      return;
    }

    if (
      Number.isNaN(followUpDateTime.getTime()) ||
      followUpDateTime <= new Date()
    ) {
      setFollowUpError("Follow-up date and time must be in the future.");
      return;
    }

    setFollowUpMessage(
      `The follow-up appointment has been successfully scheduled for ${formatDate(
        followUpForm.appointmentDate,
      )} at ${followUpForm.appointmentTime}. Reminder message will be shown to patient a day before follow-up appointment.`,
    );
    setFollowUpTarget(null);
    setFollowUpError("");
  };

  return (
    <DentistPageShell>
      <section
        className="dentist-waiting-patients"
        aria-labelledby="dentist-waiting-patients-title"
      >
        <div className="dentist-waiting-patients__header">
          <h1
            className="dentist-waiting-patients__title"
            id="dentist-waiting-patients-title"
          >
            Danh sách bệnh nhân
          </h1>
        </div>

        {isLoading && <Spinner />}
        {!isLoading && error && (
          <EmptyState message="Không thể tải danh sách bệnh nhân. Vui lòng thử lại." />
        )}
        {!isLoading && !error && patients.length === 0 && (
          <EmptyState message="Chưa có bệnh nhân nào trong danh sách." />
        )}

        {!isLoading && !error && patients.length > 0 && (
          <>
            <div className="dentist-waiting-patients__toolbar">
              <label className="dentist-waiting-patients__search">
                <Search aria-hidden="true" size={18} />
                <span className="dentist-waiting-patients__visually-hidden">
                  Tìm kiếm bệnh nhân
                </span>
                <input
                  autoComplete="off"
                  onChange={handleSearchChange}
                  placeholder="Tìm theo tên, số điện thoại hoặc dịch vụ..."
                  type="search"
                  value={searchTerm}
                />
              </label>
            </div>

            {followUpMessage && (
              <div className="dentist-waiting-patients__notice">
                {followUpMessage}
              </div>
            )}

            {filteredPatients.length === 0 && (
              <EmptyState message="Không tìm thấy bệnh nhân phù hợp với từ khóa." />
            )}

            {filteredPatients.length > 0 && (
              <>
                <div
                  className="dentist-waiting-patients__table-wrap"
                  role="region"
                  aria-label="My Patients list"
                >
                  <table className="dentist-waiting-patients__table">
                    <thead className="dentist-waiting-patients__table-head">
                      <tr>
                        <th scope="col">Tên bệnh nhân</th>
                        <th scope="col">Số điện thoại</th>
                        <th scope="col">Dịch vụ</th>
                        <th scope="col">Lần khám gần nhất</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedPatients.map((patient) => (
                        <tr key={patient.patientId || patient.patientPhone}>
                          <td>
                            <span className="dentist-waiting-patients__patient-name">
                              {patient.patientName}
                            </span>
                          </td>
                          <td>
                            <span className="dentist-waiting-patients__time">
                              {patient.patientPhone || "Chưa cập nhật"}
                            </span>
                          </td>
                          <td>
                            <span className="dentist-waiting-patients__time">
                              {patient.serviceName}
                            </span>
                          </td>
                          <td>
                            <span className="dentist-waiting-patients__time">
                              {patient.latestTime || "Chưa có giờ"}
                              {patient.latestTimeEnd &&
                                ` - ${patient.latestTimeEnd}`}
                            </span>
                            <span className="dentist-waiting-patients__muted-info">
                              {formatDate(patient.latestDate)}
                            </span>
                          </td>
                          <td>
                            <Badge status={patient.status} />
                          </td>
                          <td>
                            <div className="dentist-waiting-patients__actions">
                              <button
                                aria-label={`Xem lịch sử điều trị của ${patient.patientName}`}
                                className="dentist-waiting-patients__action-button"
                                disabled={!patient.patientId}
                                onClick={() =>
                                  navigate(
                                    `/dentist/patients/${patient.patientId}/treatment-history`,
                                    {
                                      state: {
                                        patient: patient.latestAppointment,
                                      },
                                    },
                                  )
                                }
                                title="Xem lịch sử điều trị"
                                type="button"
                              >
                                <History aria-hidden="true" size={15} />
                              </button>
                              <button
                                aria-label={`Schedule follow-up for ${patient.patientName}`}
                                className="dentist-waiting-patients__icon-action dentist-waiting-patients__icon-action--follow-up"
                                onClick={() => openFollowUpModal(patient)}
                                title="Schedule follow-up reminder"
                                type="button"
                              >
                                <CalendarPlus aria-hidden="true" size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="dentist-waiting-patients__pagination">
                  <p className="dentist-waiting-patients__pagination-info">
                    Hiển thị {(currentPage - 1) * PAGE_SIZE + 1}–
                    {Math.min(currentPage * PAGE_SIZE, filteredPatients.length)}{" "}
                    trong tổng số {filteredPatients.length} bệnh nhân
                  </p>
                  <Pagination
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    totalPage={totalPage}
                  />
                </div>
              </>
            )}
          </>
        )}

        <FollowUpReminderModal
          error={followUpError}
          form={followUpForm}
          patient={followUpTarget}
          onChange={handleFollowUpChange}
          onClose={() => setFollowUpTarget(null)}
          onSubmit={handleFollowUpSubmit}
        />
      </section>
    </DentistPageShell>
  );
}

DentistWaitingPatientsPage.propTypes = {};

export default DentistWaitingPatientsPage;
