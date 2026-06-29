import { useState } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import Badge from "../../../components/common/Badge/Badge";
import EmptyState from "../../../components/common/EmptyState/EmptyState";
import Spinner from "../../../components/common/Spinner/Spinner";
import { usePatientTreatments } from "../../../hooks/usePatientTreatments";
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
            <FieldRow label="Diagnosis" value={record.diagnosis} />
            <FieldRow label="Treatment note" value={record.treatmentNote} />
            <FieldRow label="Appointment note" value={record.appointmentNote} />
            <FieldRow label="Appointment" value={record.appointmentId} />
          </dl>
          {!hasValue(record.diagnosis) &&
            !hasValue(record.treatmentNote) &&
            !hasValue(record.appointmentNote) && (
              <p className="patient-treatment-history__record-empty">
                No clinical notes recorded.
              </p>
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

function PatientTreatmentHistoryPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const patient = location.state?.patient || {};
  const { error, isLoading, treatments } = usePatientTreatments(patientId);
  const patientName = patient.patientName || `Patient #${patientId}`;
  const headerMeta = getHeaderMeta({ patient, treatments });

  return (
    <DentistPageShell>
      <section
        className="patient-treatment-history"
        aria-labelledby="patient-treatment-history-title"
      >
        <button
          className="patient-treatment-history__back-button"
          onClick={() => navigate("/dentist/patients")}
          type="button"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          <span>Back to patients</span>
        </button>

        <header className="patient-treatment-history__header">
          <div>
            <p className="patient-treatment-history__eyebrow">
              Treatment history
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
          <EmptyState message="Unable to load treatment history. Please try again." />
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
    </DentistPageShell>
  );
}

PatientTreatmentHistoryPage.propTypes = {};

export default PatientTreatmentHistoryPage;
