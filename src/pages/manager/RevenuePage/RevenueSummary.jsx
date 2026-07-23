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
  return new Date().toLocaleDateString("vi-VN", {
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
          <h2 className="revenue-summary__title">Doanh thu tháng hiện tại</h2>
        </div>
        <p className="revenue-summary__error-text">
          Đã xảy ra lỗi. Vui lòng thử lại sau.
        </p>
      </section>
    );
  }

  const revenue = data?.current_revenue ?? 0;
  const pct = data?.percentage_change;

  let changeClass = "revenue-summary__change--neutral";
  let arrow = "";
  if (pct !== null && pct !== undefined) {
    if (pct > 0) {
      changeClass = "revenue-summary__change--positive";
      arrow = "▲";
    } else if (pct < 0) {
      changeClass = "revenue-summary__change--negative";
      arrow = "▼";
    }
  }

  return (
    <section className="revenue-summary">
      <div className="revenue-summary__header">
        <h2 className="revenue-summary__title">Doanh thu tháng hiện tại</h2>
        <span className="revenue-summary__period">{getCurrentMonthLabel()}</span>
      </div>
      <p className="revenue-summary__amount">{formatVND(revenue)}</p>
      {pct !== null && pct !== undefined && (
        <div className={`revenue-summary__change ${changeClass}`}>
          {`${arrow} ${pct > 0 ? "+" : ""}${pct}% so với tháng trước`}
        </div>
      )}
    </section>
  );
}

RevenueSummary.propTypes = {};

export default RevenueSummary;
