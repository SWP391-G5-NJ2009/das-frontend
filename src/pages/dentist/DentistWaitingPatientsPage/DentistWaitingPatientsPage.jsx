import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, Search } from "lucide-react";
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
      const latestAppointment = patientAppointments.slice().sort(compareAppointmentsDesc)[0];
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
    .sort((a, b) => compareAppointmentsDesc(a.latestAppointment, b.latestAppointment));
}

function DentistWaitingPatientsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { appointments, error, isLoading } = useAllAppointments({});

  const patients = useMemo(() => {
    const ownAppointments = user?.profileId
      ? appointments.filter(
          (appointment) => String(appointment.dentistId) === String(user.profileId),
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
    () => filteredPatients.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage, filteredPatients],
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPage));
  }, [totalPage]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  return (
    <DentistPageShell>
      <section className="dentist-waiting-patients" aria-labelledby="dentist-waiting-patients-title">
        <div className="dentist-waiting-patients__header">
          <h1 className="dentist-waiting-patients__title" id="dentist-waiting-patients-title">
            Danh sách bệnh nhân
          </h1>
        </div>

        {isLoading && <Spinner />}
        {!isLoading && error && <EmptyState message="Không thể tải danh sách bệnh nhân. Vui lòng thử lại." />}
        {!isLoading && !error && patients.length === 0 && <EmptyState message="Chưa có bệnh nhân nào trong danh sách." />}

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

            {filteredPatients.length === 0 && (
              <EmptyState message="Không tìm thấy bệnh nhân phù hợp với từ khóa." />
            )}

            {filteredPatients.length > 0 && (
              <>
            <div className="dentist-waiting-patients__table-wrap" role="region" aria-label="My Patients list">
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
                    <td><span className="dentist-waiting-patients__patient-name">{patient.patientName}</span></td>
                    <td><span className="dentist-waiting-patients__time">{patient.patientPhone || "Chưa cập nhật"}</span></td>
                    <td><span className="dentist-waiting-patients__time">{patient.serviceName}</span></td>
                    <td>
                      <span className="dentist-waiting-patients__time">
                        {patient.latestTime || "Chưa có giờ"}
                        {patient.latestTimeEnd && ` - ${patient.latestTimeEnd}`}
                      </span>
                      <span className="dentist-waiting-patients__muted-info">{formatDate(patient.latestDate)}</span>
                    </td>
                    <td><Badge status={patient.status} /></td>
                    <td>
                      <div className="dentist-waiting-patients__actions">
                        <button
                          aria-label={`Xem lịch sử điều trị của ${patient.patientName}`}
                          className="dentist-waiting-patients__action-button"
                          disabled={!patient.patientId}
                          onClick={() => navigate(
                            `/dentist/patients/${patient.patientId}/treatment-history`,
                            { state: { patient: patient.latestAppointment } },
                          )}
                          title="Xem lịch sử điều trị"
                          type="button"
                        >
                          <History aria-hidden="true" size={15} />
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
                Hiển thị {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredPatients.length)} trong tổng số {filteredPatients.length} bệnh nhân
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
      </section>
    </DentistPageShell>
  );
}

DentistWaitingPatientsPage.propTypes = {};

export default DentistWaitingPatientsPage;
