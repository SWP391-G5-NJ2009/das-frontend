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
          <h1 id="payment-list-title">Payment list</h1>
          <p>
            Track recorded payment transactions in the system.
          </p>
        </div>
      </div>

      {isLoading && (
        <PaymentState isLoading message="Loading payments..." />
      )}

      {!isLoading && error && (
        <PaymentState
          title="Unable to load payments"
          message={error.message || "Please try again later."}
          variant="error"
        />
      )}

      {!isLoading && !error && payments.length === 0 && (
        <PaymentState
          title="No payments yet"
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
