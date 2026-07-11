import PropTypes from "prop-types";
import { useNoShowRate } from "../../../hooks/usePatientAnalytics";
import "./NoShowRate.css";

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
            <section className="no-show-rate">
                <div className="no-show-rate__skeleton">
                    <div className="no-show-rate__skeleton-line no-show-rate__skeleton-line--short" />
                    <div className="no-show-rate__skeleton-line no-show-rate__skeleton-line--long" />
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="no-show-rate no-show-rate--error">
                <div className="no-show-rate__header">
                    <h2 className="no-show-rate__title">No-show Rate</h2>
                </div>
                <p className="no-show-rate__error-text">
                    Unable to load data.
                </p>
            </section>
        );
    }

    return (
        <section className="no-show-rate">
            <div className="no-show-rate__header">
                <h2 className="no-show-rate__title">No-show Rate</h2>
                <span className="no-show-rate__period">{getCurrentMonthLabel()}</span>
            </div>
            <p className="no-show-rate__amount">{(data.toLocaleString('en-US', {
                style: 'percent',
                maximumFractionDigits: 2
            }) ?? 0)}</p>
        </section>
    );
}

NoShowRate.propTypes = {};

export default NoShowRate;
