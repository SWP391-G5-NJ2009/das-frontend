import PaymentState from "../../../components/features/payment/PaymentState/PaymentState";
import PaymentTable from "../../../components/features/payment/PaymentTable/PaymentTable";
import { usePayments } from "../../../hooks/usePayments";
import ReceptionistPageShell from "../ReceptionistPageShell";
import "./PaymentListPage.css";

function PaymentListPage() {
  const { payments, isLoading, error } = usePayments();

  return (
    <ReceptionistPageShell
      contentClassName="payment-list"
      contentLabelledBy="payment-list-title"
    >
      <div className="payment-list__header">
        <div className="payment-list__heading">
          <h1 id="payment-list-title">Danh sách thanh toán</h1>
          <p>
            Theo dõi các giao dịch thanh toán đã ghi nhận trong hệ thống.
          </p>
        </div>
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
    </ReceptionistPageShell>
  );
}

PaymentListPage.propTypes = {};

export default PaymentListPage;
