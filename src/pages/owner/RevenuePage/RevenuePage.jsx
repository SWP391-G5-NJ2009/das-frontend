import PaymentState from "../../../components/features/payment/PaymentState/PaymentState";
import PaymentTable from "../../../components/features/payment/PaymentTable/PaymentTable";
import { usePayments } from "../../../hooks/usePayments";
import OwnerPageShell from "../OwnerPageShell";
import RevenueSummary from "./RevenueSummary";
import MonthlyRevenueSummary from "./MonthlyRevenue";
import "./RevenuePage.css";

function RevenuePage() {
  const { payments, isLoading, error } = usePayments();

  return (
    <OwnerPageShell>
      <div className="revenue-page__header">
        <div className="revenue-page__heading">
          <h1 className="revenue-page__title">Phân tích doanh thu</h1>
          <p className="revenue-page__subtitle">
            Tổng quan doanh thu của phòng khám.
          </p>
        </div>
      </div>

      <div className="revenue-page__summary">
        <RevenueSummary />
      </div>

      <div className="revenue-page__summary">
        <MonthlyRevenueSummary />
      </div>

      {isLoading && (
        <PaymentState isLoading message="Loading payments..." />
      )}

      {!isLoading && error && (
        <PaymentState
          title="Không thể tải thanh toán"
          message={error.message || "Vui lòng thử lại sau."}
          variant="error"
        />
      )}

      {!isLoading && !error && payments.length === 0 && (
        <PaymentState
          title="Chưa có thanh toán"
          message="No matching payment records found."
        />
      )}

      {!isLoading && !error && payments.length > 0 && (
        <PaymentTable payments={payments} />
      )}
    </OwnerPageShell>
  );
}

RevenuePage.propTypes = {};

export default RevenuePage;
