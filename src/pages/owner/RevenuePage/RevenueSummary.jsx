import PropTypes from "prop-types";
import { useRevenue } from "../../../hooks/useRevenue";
import "./RevenueSummary.css";

function formatVND(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function getCurrentMonthLabel() {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function RevenueSummary() {
  const { data, isLoading, error } = useRevenue();

  if (isLoading) {
    return (
      <section className="revenue-summary">
        <div className="revenue-summary__skeleton">
          <div className="revenue-summary__skeleton-line revenue-summary__skeleton-line--short" />
          <div className="revenue-summary__skeleton-line revenue-summary__skeleton-line--long" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="revenue-summary revenue-summary--error">
        <div className="revenue-summary__header">
          <h2 className="revenue-summary__title">Current Month Revenue</h2>
        </div>
        <p className="revenue-summary__error-text">
          Unable to load revenue data.
        </p>
      </section>
    );
  }

  return (
    <section className="revenue-summary">
      <div className="revenue-summary__header">
        <h2 className="revenue-summary__title">Current Month Revenue</h2>
        <span className="revenue-summary__period">{getCurrentMonthLabel()}</span>
      </div>
      <p className="revenue-summary__amount">{formatVND(data ?? 0)}</p>
    </section>
  );
}

RevenueSummary.propTypes = {};

export default RevenueSummary;
