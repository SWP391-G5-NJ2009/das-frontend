import { useMemo, useState } from "react";
import PaymentDetailModal from "../../../components/features/payment/PaymentDetailModal/PaymentDetailModal";
import PaymentConfirmModal from "../../../components/features/payment/PaymentConfirmModal/PaymentConfirmModal";
import PaymentFilters from "../../../components/features/payment/PaymentFilters/PaymentFilters";
import PaymentState from "../../../components/features/payment/PaymentState/PaymentState";
import PaymentTable from "../../../components/features/payment/PaymentTable/PaymentTable";
import { usePayments } from "../../../hooks/usePayments";
import { paymentService } from "../../../services/payment.service";
import ReceptionistPageShell from "../ReceptionistPageShell";
import "./PaymentListPage.css";

const EMPTY_FILTERS = {
  keyword: "",
  method: "all",
  status: "all",
  fromDate: "",
  toDate: "",
};

function PaymentListPage() {
  const { payments, unpaidInvoices, isLoading, error, refetch } = usePayments();
  const [activeTab, setActiveTab] = useState("unpaid");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [invoiceToPay, setInvoiceToPay] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const source = activeTab === "history" ? payments : unpaidInvoices;

  const methods = useMemo(
    () => [
      ...new Set(payments.map((item) => item.payment_method).filter(Boolean)),
    ],
    [payments],
  );
  const filteredInvoices = useMemo(
    () =>
      source.filter((invoice) => {
        const keyword = filters.keyword.trim().toLowerCase();
        const searchable = [
          invoice.invoice_id,
          invoice.transaction_code,
          invoice.patient?.full_name,
          invoice.dentist?.full_name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        const relevantDate =
          (activeTab === "history"
            ? invoice.payment_date
            : invoice.appointmentDate) || "";
        const date = relevantDate.slice(0, 10);
        return (
          (!keyword || searchable.includes(keyword)) &&
          (filters.method === "all" ||
            invoice.payment_method === filters.method) &&
          (filters.status === "all" ||
            (invoice.status || "").toLowerCase() === filters.status) &&
          (!filters.fromDate || date >= filters.fromDate) &&
          (!filters.toDate || date <= filters.toDate)
        );
      }),
    [activeTab, filters, source],
  );

  const changeTab = (tab) => {
    setActiveTab(tab);
    setFilters(EMPTY_FILTERS);
  };

  const viewDetail = async (payment) => {
    setSelectedPayment(payment);
    setDetail(null);
    setDetailError(null);
    setIsDetailLoading(true);
    try {
      setDetail(
        payment.payment_id
          ? await paymentService.getPaymentDetail(payment.payment_id)
          : await paymentService.getInvoiceDetail(payment.invoice_id),
      );
    } catch (requestError) {
      setDetailError(requestError);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const payInvoice = async (paymentMethod) => {
    setIsPaying(true);
    setPaymentError(null);
    try {
      await paymentService.payInvoice(invoiceToPay.invoice_id, paymentMethod);
      setInvoiceToPay(null);
      await refetch();
    } catch (requestError) {
      setPaymentError(requestError);
    } finally {
      setIsPaying(false);
    }
  };

  const emptyTitle =
    activeTab === "history"
      ? "Chưa có lịch sử thanh toán"
      : "Không có hóa đơn chưa thanh toán";

  return (
    <ReceptionistPageShell
      contentClassName="payment-list"
      contentLabelledBy="payment-list-title"
    >
      <div className="payment-list__header">
        <div className="payment-list__heading">
          <h1 id="payment-list-title">Thanh toán</h1>
          <p>Quản lý hóa đơn chưa thanh toán và tra cứu lịch sử thanh toán.</p>
        </div>
      </div>

      <div
        aria-label="Loại hóa đơn"
        className="payment-list__tabs"
        role="tablist"
      >
        <button
          aria-selected={activeTab === "unpaid"}
          className={`payment-list__tab${activeTab === "unpaid" ? " payment-list__tab--active" : ""}`}
          onClick={() => changeTab("unpaid")}
          role="tab"
          type="button"
        >
          Hóa đơn chưa thanh toán <span>{unpaidInvoices.length}</span>
        </button>
        <button
          aria-selected={activeTab === "history"}
          className={`payment-list__tab${activeTab === "history" ? " payment-list__tab--active" : ""}`}
          onClick={() => changeTab("history")}
          role="tab"
          type="button"
        >
          Lịch sử thanh toán <span>{payments.length}</span>
        </button>
      </div>

      <PaymentFilters
        filters={filters}
        methods={activeTab === "history" ? methods : []}
        onChange={setFilters}
        onReset={() => setFilters(EMPTY_FILTERS)}
      />

      {isLoading && (
        <PaymentState isLoading message="Đang tải danh sách hóa đơn..." />
      )}
      {!isLoading && error && (
        <PaymentState
          title="Không thể tải hóa đơn"
          message={error.message || "Vui lòng thử lại sau."}
          variant="error"
        />
      )}
      {!isLoading && !error && filteredInvoices.length === 0 && (
        <PaymentState
          title={emptyTitle}
          message="Không có hóa đơn phù hợp với bộ lọc."
        />
      )}
      {!isLoading && !error && filteredInvoices.length > 0 && (
        <PaymentTable
          dateColumn={activeTab === "history" ? "payment" : "appointment"}
          onPay={setInvoiceToPay}
          onViewDetail={viewDetail}
          payments={filteredInvoices}
          showPayAction={activeTab === "unpaid"}
        />
      )}

      {selectedPayment && (
        <PaymentDetailModal
          detail={detail}
          error={detailError}
          isLoading={isDetailLoading}
          onClose={() => setSelectedPayment(null)}
          showPaymentInfo={Boolean(selectedPayment.payment_id)}
        />
      )}
      {invoiceToPay && (
        <PaymentConfirmModal
          error={paymentError}
          invoice={invoiceToPay}
          isSubmitting={isPaying}
          onClose={() => {
            setInvoiceToPay(null);
            setPaymentError(null);
          }}
          onConfirm={payInvoice}
        />
      )}
    </ReceptionistPageShell>
  );
}

PaymentListPage.propTypes = {};
export default PaymentListPage;
