import { usePayments } from "../../../hooks/usePayments";
import ManagerPageShell from "../ManagerPageShell";
import RevenueSummary from "./RevenueSummary";
import MonthlyRevenueSummary from "./MonthlyRevenue";
import "./RevenuePage.css";

function RevenuePage() {
  const { payments, isLoading, error } = usePayments();

  return (
    <ManagerPageShell>
      <div className="revenue-page__header">
        <div className="revenue-page__heading">
          <h1 className="revenue-page__title">Phân tích doanh thu</h1>
          <p className="revenue-page__subtitle">
            Tổng quan doanh thu phòng khám.
          </p>
        </div>
      </div>

      <div className="revenue-page__summary">
        <RevenueSummary />
      </div>

      <div className="revenue-page__summary">
        <MonthlyRevenueSummary />
      </div>
    </ManagerPageShell>
  );
}

RevenuePage.propTypes = {};

export default RevenuePage;
