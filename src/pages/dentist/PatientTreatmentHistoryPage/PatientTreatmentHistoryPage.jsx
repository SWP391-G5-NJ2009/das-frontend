import { useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import Badge from "../../../components/common/Badge/Badge";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import Spinner from "../../../components/common/Spinner/Spinner";
import { usePatientTreatments } from "../../../hooks/usePatientTreatments";
import { useAuth } from "../../../context/AuthContext";
import PatientPageShell from "../../patient/PatientPageShell";
import DentistPageShell from "../DentistPageShell";
import "./PatientTreatmentHistoryPage.css";

function formatDate(value) {
  if (!value) return "Not updated";
  return new Intl.DateTimeFormat("en-US").format(new Date(value));
}

function formatTime(record) {
  if (!record.startTime) return "Not updated";
  return record.endTime ? `${record.startTime} - ${record.endTime}` : record.startTime;
}

function hasValue(value) {
  return Boolean(String(value || "").trim());
}

function FieldRow({ label, value }) {
  if (!hasValue(value)) return null;

  return (
    <div className="patient-treatment-history__field-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

FieldRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

FieldRow.defaultProps = {
  value: "",
};

function TreatmentRecordRow({ record }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const treatment = record.treatment || "Dental treatment";

  return (
    <article className="patient-treatment-history__record">
      <button
        aria-expanded={isExpanded}
        className="patient-treatment-history__record-toggle"
        onClick={() => setIsExpanded((current) => !current)}
        type="button"
      >
        <span className="patient-treatment-history__record-date">
          {formatDate(record.date)}
          <span>{formatTime(record)}</span>
        </span>
        <span className="patient-treatment-history__record-main">
          <span className="patient-treatment-history__record-title">
            {treatment}
          </span>
          <span className="patient-treatment-history__record-dentist">
            {record.dentist || "Dentist not updated"}
          </span>
        </span>
        <span className="patient-treatment-history__record-status">
          <Badge status={record.status || "Completed"} />
        </span>
        <ChevronDown
          aria-hidden="true"
          className="patient-treatment-history__record-chevron"
          size={18}
        />
      </button>

      {isExpanded && (
        <div className="patient-treatment-history__record-details">
          <dl className="patient-treatment-history__field-list">
            <FieldRow label="Chấn đoán" value={record.diagnosis} />
            <FieldRow label="Ghi chú điều trị" value={record.treatmentNote} />
            <FieldRow label="Ghi chú lịch hẹn" value={record.appointmentNote} />
          </dl>
          {!hasValue(record.diagnosis) &&
            !hasValue(record.treatmentNote) &&
            !hasValue(record.appointmentNote) && (
              <p className="patient-treatment-history__record-empty">
                Chưa có ghi chú lâm sàng.
              </p>
            )}
          {((record.medicines || []).length > 0 || hasValue(record.prescriptionNote)) && (
            <section className="patient-treatment-history__prescription" aria-label="Đơn thuốc">
              <div className="patient-treatment-history__prescription-header">
                <h4>Đơn thuốc</h4>
                <span>{(record.medicines || []).length} loại thuốc</span>
              </div>
              {(record.medicines || []).map((medicine, index) => (
                <div className="patient-treatment-history__medicine" key={medicine.id || `${medicine.name}-${index}`}>
                  <div className="patient-treatment-history__medicine-field">
                    <span className="patient-treatment-history__medicine-label">Tên thuốc</span>
                    <strong>{medicine.name}</strong>
                  </div>
                  <div className="patient-treatment-history__medicine-field">
                    <span className="patient-treatment-history__medicine-label">Liều dùng</span>
                    <span>{medicine.dosage || "Chưa có liều dùng"}</span>
                  </div>
                </div>
              ))}
              {hasValue(record.prescriptionNote) && (
                <p className="patient-treatment-history__prescription-note">
                  <strong>Ghi chú:</strong> {record.prescriptionNote}
                </p>
              )}
            </section>
          )}
        </div>
      )}
    </article>
  );
}

TreatmentRecordRow.propTypes = {
  record: PropTypes.shape({
    appointmentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    appointmentNote: PropTypes.string,
    date: PropTypes.string,
    dentist: PropTypes.string,
    diagnosis: PropTypes.string,
    endTime: PropTypes.string,
    startTime: PropTypes.string,
    status: PropTypes.string,
    treatment: PropTypes.string,
    treatmentNote: PropTypes.string,
    prescriptionNote: PropTypes.string,
    medicines: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        name: PropTypes.string.isRequired,
        dosage: PropTypes.string,
      }),
    ),
  }).isRequired,
};

function getHeaderMeta({ patient, treatments }) {
  const meta = [`${treatments.length} records`];

  if (patient.patientPhone) {
    meta.push(patient.patientPhone);
  }

  if (patient.patientGender) {
    meta.push(patient.patientGender);
  }

  return meta;
}

function PatientTreatmentHistoryPage({ viewer }) {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isPatientView = viewer === "patient";
  const patient = location.state?.patient || {};
  const { error, isLoading, treatments } = usePatientTreatments(
    isPatientView ? null : patientId,
  );
  const patientName = isPatientView
    ? user?.fullName || "Hồ sơ của tôi"
    : patient.patientName || `Bệnh nhân #${patientId}`;
  const headerMeta = isPatientView
    ? [`${treatments.length} lần điều trị`, user?.phone].filter(Boolean)
    : getHeaderMeta({ patient, treatments });
  const PageShell = isPatientView ? PatientPageShell : DentistPageShell;

  return (
    <PageShell>
      <section
        className="patient-treatment-history"
        aria-labelledby="patient-treatment-history-title"
      >
        {!isPatientView && (
          <button
            className="patient-treatment-history__back-button"
            onClick={() => navigate("/dentist/patients")}
            type="button"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            <span>Quay lại danh sách bệnh nhân</span>
          </button>
        )}

        <header className="patient-treatment-history__header">
          <div>
            <p className="patient-treatment-history__eyebrow">
              Lịch sử điều trị
            </p>
            <h1
              className="patient-treatment-history__title"
              id="patient-treatment-history-title"
            >
              {patientName}
            </h1>
            <div className="patient-treatment-history__patient-meta">
              {headerMeta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </header>

        {isLoading && <Spinner />}

        {!isLoading && error && (
          <EmptyState message="Không thể tải lịch sử điều trị. Vui lòng thử lại." />
        )}

        {!isLoading && !error && treatments.length === 0 && (
          <EmptyState message="No treatment history found for this patient." />
        )}

        {!isLoading && !error && treatments.length > 0 && (
          <div className="patient-treatment-history__records">
            {treatments.map((record) => (
              <TreatmentRecordRow
                key={record.id}
                record={record}
              />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}

PatientTreatmentHistoryPage.propTypes = {
  viewer: PropTypes.oneOf(["dentist", "patient"]),
};

PatientTreatmentHistoryPage.defaultProps = {
  viewer: "dentist",
};

export default PatientTreatmentHistoryPage;
