import PropTypes from "prop-types";
import { useReturningPatient } from "../../../hooks/usePatientAnalytics";
import "./ReturningPatient.css";

function getCurrentMonthLabel() {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function ReturningPatientCount() {
  const { data, isLoading, error } = useReturningPatient();

  if (isLoading) {
    return (
      <section className="returning-patient">
        <div className="returning-patient__skeleton">
          <div className="returning-patient__skeleton-line returning-patient__skeleton-line--short" />
          <div className="returning-patient__skeleton-line returning-patient__skeleton-line--long" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="returning-patient returning-patient--error">
        <div className="returning-patient__header">
          <h2 className="returning-patient__title">Returning Patients</h2>
        </div>
        <p className="returning-patient__error-text">
          Unable to load data.
        </p>
      </section>
    );
  }

  return (
    <section className="returning-patient">
      <div className="returning-patient__header">
        <h2 className="returning-patient__title">Returning Patients</h2>
        <span className="returning-patient__period">{getCurrentMonthLabel()}</span>
      </div>
      <p className="returning-patient__amount">{(data ?? 0)}</p>
    </section>
  );
}

ReturningPatientCount.propTypes = {};

export default ReturningPatientCount;
