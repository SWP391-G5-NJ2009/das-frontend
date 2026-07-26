import { useMemo, useState } from "react";
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
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not updated";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
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
  const treatment = record.visitNumber
    ? `Lần ${record.visitNumber}`
    : record.treatment || "Dental treatment";

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
            <FieldRow
              label="Khám lâm sàng"
              value={record.clinicalExamination}
            />
            <FieldRow label="Chấn đoán" value={record.diagnosis} />
            <FieldRow label="Ghi chú điều trị" value={record.treatmentNote} />
            <FieldRow
              label="Hướng dẫn sau điều trị"
              value={record.postTreatmentInstructions}
            />
            <FieldRow label="Ghi chú lịch hẹn" value={record.appointmentNote} />
          </dl>
          {!hasValue(record.clinicalExamination) &&
            !hasValue(record.diagnosis) &&
            !hasValue(record.treatmentNote) &&
            !hasValue(record.postTreatmentInstructions) &&
            !hasValue(record.appointmentNote) && (
              <p className="patient-treatment-history__record-empty">
                Chưa có ghi chú lâm sàng.
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
    clinicalExamination: PropTypes.string,
    endTime: PropTypes.string,
    startTime: PropTypes.string,
    status: PropTypes.string,
    treatment: PropTypes.string,
    treatmentNote: PropTypes.string,
    postTreatmentInstructions: PropTypes.string,
    treatmentPlanId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    visitNumber: PropTypes.number,
  }).isRequired,
};

function groupTreatmentsByPlan(treatments) {
  const groups = new Map();

  treatments.forEach((record) => {
    const key = record.treatmentPlanId
      ? `plan-${record.treatmentPlanId}`
      : "standalone";
    const currentGroup = groups.get(key) || {
      key,
      planId: record.treatmentPlanId || null,
      title: record.treatmentPlanId
        ? record.treatment || "Kế hoạch điều trị"
        : "Điều trị độc lập",
      status: record.treatmentPlanStatus || null,
      createdAt: record.treatmentPlanCreatedAt || null,
      records: [],
    };
    currentGroup.records.push(record);
    groups.set(key, currentGroup);
  });

  return Array.from(groups.values()).map((group) => ({
    ...group,
    records: group.records.slice().sort((first, second) => {
      if (group.planId) {
        return Number(second.visitNumber || 0) - Number(first.visitNumber || 0);
      }
      return `${second.date || ""} ${second.startTime || ""}`.localeCompare(
        `${first.date || ""} ${first.startTime || ""}`,
      );
    }),
  }));
}

function TreatmentPlanGroup({ group }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section className="patient-treatment-history__plan">
      <button
        aria-expanded={isExpanded}
        className="patient-treatment-history__plan-toggle"
        onClick={() => setIsExpanded((current) => !current)}
        type="button"
      >
        <span className="patient-treatment-history__plan-main">
          <strong>{group.title}</strong>
          <small>
            {group.records.length} lần điều trị
            {group.createdAt
              ? ` · Bắt đầu ${formatDate(group.createdAt)}`
              : ""}
          </small>
        </span>
        {group.status && (
          <span className="patient-treatment-history__plan-status">
            <Badge status={group.status} />
          </span>
        )}
        <ChevronDown
          aria-hidden="true"
          className="patient-treatment-history__plan-chevron"
          size={20}
        />
      </button>

      {isExpanded && (
        <div className="patient-treatment-history__plan-records">
          {group.records.map((record) => (
            <TreatmentRecordRow key={record.id} record={record} />
          ))}
        </div>
      )}
    </section>
  );
}

TreatmentPlanGroup.propTypes = {
  group: PropTypes.shape({
    key: PropTypes.string.isRequired,
    planId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string.isRequired,
    status: PropTypes.string,
    createdAt: PropTypes.string,
    records: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

function getHeaderMeta({ patient, treatments }) {
  const groupCount = new Set(
    treatments
      .map((record) => record.treatmentPlanId)
      .filter(Boolean),
  ).size;
  const meta = [
    `${groupCount} lộ trình · ${treatments.length} lần điều trị`,
  ];

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
  const treatmentGroups = useMemo(
    () => groupTreatmentsByPlan(treatments),
    [treatments],
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
          <EmptyState message="Không tìm thấy lịch sử điều trị của bệnh nhân." />
        )}

        {!isLoading && !error && treatments.length > 0 && (
          <div className="patient-treatment-history__records">
            {treatmentGroups.map((group) => (
              <TreatmentPlanGroup key={group.key} group={group} />
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
