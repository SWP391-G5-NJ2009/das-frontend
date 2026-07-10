import PropTypes from "prop-types";
import { useNoShowRate } from "../../../hooks/usePatientAnalytics";
import "./NewPatient.css";

function getCurrentMonthLabel() {
    return new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
}

function NoShowRate() {
    const { data, isLoading, error } = useNoShowRate();

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
                    <h2 className="patient-summary__title">No-show Rate</h2>
                </div>
                <p className="patient-summary__error-text">
                    Unable to load data.
                </p>
            </section>
        );
    }

    return (
        <section className="patient-summary">
            <div className="patient-summary__header">
                <h2 className="patient-summary__title">No-show Rate</h2>
                <span className="patient-summary__period">{getCurrentMonthLabel()}</span>
            </div>
            <p className="patient-summary__amount">{(data.toLocaleString('en-US', {
                style: 'percent',
                maximumFractionDigits: 2
            }) ?? 0)}</p>
        </section>
    );
}

NoShowRate.propTypes = {};

export default NoShowRate;
