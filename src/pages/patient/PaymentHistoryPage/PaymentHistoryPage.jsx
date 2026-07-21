import { useState } from "react";
import PaymentDetailModal from "../../../components/features/payment/PaymentDetailModal/PaymentDetailModal";
import PaymentState from "../../../components/features/payment/PaymentState/PaymentState";
import PaymentTable from "../../../components/features/payment/PaymentTable/PaymentTable";
import { useAuth } from "../../../context/AuthContext";
import { usePatientPayments } from "../../../hooks/usePatientPayments";
import { paymentService } from "../../../services/payment.service";
import PatientPageShell from "../PatientPageShell";
import "./PaymentHistoryPage.css";

function PaymentHistoryPage() {
  const { user } = useAuth();
  const { payments, isLoading, error } = usePatientPayments();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const viewDetail = async (payment) => {
    setSelectedPayment(payment);
    setDetail(null);
    setDetailError(null);
    setIsDetailLoading(true);
    try {
      setDetail(await paymentService.getMyPaymentDetail(payment.payment_id));
    } catch (requestError) {
      setDetailError(requestError);
    } finally {
      setIsDetailLoading(false);
    }
  };

  return (
    <PatientPageShell>
      <section
        className="patient-payment-history"
        aria-labelledby="patient-payment-history-title"
      >
        <header className="patient-payment-history__header">
          <p>Lịch sử thanh toán</p>
          <h1 id="patient-payment-history-title">
            {user?.fullName || "Bệnh nhân"}
          </h1>
          <span>{payments.length} giao dịch đã hoàn tất</span>
        </header>

        {isLoading && (
          <PaymentState isLoading message="Đang tải lịch sử thanh toán..." />
        )}
        {!isLoading && error && (
          <PaymentState
            title="Không thể tải lịch sử thanh toán"
            message={error.message || "Vui lòng thử lại sau."}
            variant="error"
          />
        )}
        {!isLoading && !error && payments.length === 0 && (
          <PaymentState
            title="Chưa có lịch sử thanh toán"
            message="Bạn chưa có giao dịch thanh toán nào."
          />
        )}
        {!isLoading && !error && payments.length > 0 && (
          <PaymentTable
            dateColumn="payment"
            onViewDetail={viewDetail}
            payments={payments}
            showActions
            showPatientInfo={false}
            showPaymentMethod
          />
        )}

        {selectedPayment && (
          <PaymentDetailModal
            detail={detail}
            error={detailError}
            isLoading={isDetailLoading}
            onClose={() => setSelectedPayment(null)}
            showPaymentInfo
          />
        )}
      </section>
    </PatientPageShell>
  );
}

PaymentHistoryPage.propTypes = {};

export default PaymentHistoryPage;
