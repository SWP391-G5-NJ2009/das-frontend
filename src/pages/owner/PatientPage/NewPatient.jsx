import PropTypes from "prop-types";
import { usePatientAnalytics } from "../../../hooks/usePatientAnalytics";
import "./NewPatient.css";

function getCurrentMonthLabel() {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function NewPatientCount() {
  const { data, isLoading, error } = usePatientAnalytics();

  if (isLoading) {
    return (
      <section className="patient-summary">
        <div className="patient-summary__skeleton">
          <div className="patient-summary__skeleton-line patient-summary__skeleton-line--short" />
          <div className="patient-summary__skeleton-line patient-summary__skeleton-line--long" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="patient-summary patient-summary--error">
        <div className="patient-summary__header">
          <h2 className="patient-summary__title">Bệnh nhân mới</h2>
        </div>
        <p className="patient-summary__error-text">
          Không thể tải dữ liệu.
        </p>
      </section>
    );
  }

  return (
    <section className="patient-summary">
      <div className="patient-summary__header">
        <h2 className="patient-summary__title">Bệnh nhân mới</h2>
        <span className="patient-summary__period">{getCurrentMonthLabel()}</span>
      </div>
      <p className="patient-summary__amount">{(data ?? 0)}</p>
    </section>
  );
}

NewPatientCount.propTypes = {};

export default NewPatientCount;
