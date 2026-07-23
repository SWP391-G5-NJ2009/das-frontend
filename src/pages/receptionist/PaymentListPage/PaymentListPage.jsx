import { useMemo, useState } from "react";
import PaymentDetailModal from "../../../components/features/payment/PaymentDetailModal/PaymentDetailModal";
import PaymentFilters from "../../../components/features/payment/PaymentFilters/PaymentFilters";
import PaymentState from "../../../components/features/payment/PaymentState/PaymentState";
import PaymentTable from "../../../components/features/payment/PaymentTable/PaymentTable";
import { usePayments } from "../../../hooks/usePayments";
import { paymentService } from "../../../services/payment.service";
import ReceptionistPageShell from "../ReceptionistPageShell";
import "./PaymentListPage.css";

const EMPTY_FILTERS = {
  keyword: "",
  status: "unpaid",
  fromDate: "",
  toDate: "",
};

function PaymentListPage() {
  const { invoices, isLoading, error, refetch } = usePayments();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [payingInvoiceId, setPayingInvoiceId] = useState(null);

  const filteredInvoices = useMemo(
    () => invoices.filter((invoice) => {
      const keyword = filters.keyword.trim().toLowerCase();
      const searchable = [
        invoice.invoice_id,
        invoice.patient?.full_name,
        invoice.patient?.phone,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const status = String(invoice.status || "").toLowerCase();
      const paymentDate = invoice.payment_date?.slice(0, 10) || "";

      return (
        (!keyword || searchable.includes(keyword))
        && (filters.status === "all" || status === filters.status)
        && (!filters.fromDate || (paymentDate && paymentDate >= filters.fromDate))
        && (!filters.toDate || (paymentDate && paymentDate <= filters.toDate))
      );
    }),
    [filters, invoices],
  );

  const viewDetail = async (invoice) => {
    setSelectedInvoice(invoice);
    setDetail(null);
    setDetailError(null);
    setPaymentError(null);
    setIsDetailLoading(true);
    try {
      const invoiceDetail = invoice.payment_id
        ? await paymentService.getPaymentDetail(invoice.payment_id)
        : await paymentService.getInvoiceDetail(invoice.invoice_id);
      setDetail(invoiceDetail);
    } catch (requestError) {
      setDetailError(requestError);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const payInvoice = async (paymentMethod) => {
    setPayingInvoiceId(selectedInvoice.invoice_id);
    setPaymentError(null);
    try {
      await paymentService.payInvoice(selectedInvoice.invoice_id, paymentMethod);
      await refetch();
      setSelectedInvoice(null);
    } catch (requestError) {
      setPaymentError(requestError);
    } finally {
      setPayingInvoiceId(null);
    }
  };

  const closeDetail = () => {
    setSelectedInvoice(null);
    setPaymentError(null);
  };

  const selectedStatus = String(selectedInvoice?.status || "").toLowerCase();

  return (
    <ReceptionistPageShell
      contentClassName="payment-list"
      contentLabelledBy="payment-list-title"
    >
      <div className="payment-list__header">
        <div className="payment-list__heading">
          <h1 id="payment-list-title">Thanh toán</h1>
          <p>Quản lý và tra cứu tất cả hóa đơn của phòng khám.</p>
        </div>
      </div>

      <PaymentFilters filters={filters} onChange={setFilters} />

      {isLoading && <PaymentState isLoading message="Đang tải danh sách hóa đơn..." />}
      {!isLoading && error && (
        <PaymentState
          title="Không thể tải hóa đơn"
          message={error.message || "Vui lòng thử lại sau."}
          variant="error"
        />
      )}
      {!isLoading && !error && filteredInvoices.length === 0 && (
        <PaymentState
          title="Không có hóa đơn"
          message="Không có hóa đơn phù hợp với bộ lọc."
        />
      )}
      {!isLoading && !error && filteredInvoices.length > 0 && (
        <PaymentTable
          dateColumn="payment"
          onViewDetail={viewDetail}
          payments={filteredInvoices}
          showActions
          showPatientInfo
        />
      )}

      {selectedInvoice && (
        <PaymentDetailModal
          detail={detail}
          error={detailError}
          isLoading={isDetailLoading}
          isPaying={String(payingInvoiceId) === String(selectedInvoice.invoice_id)}
          onClose={closeDetail}
          onPay={payInvoice}
          paymentError={paymentError}
          showPaymentActions={selectedStatus === "unpaid"}
          showPaymentInfo={selectedStatus === "paid"}
        />
      )}
    </ReceptionistPageShell>
  );
}

PaymentListPage.propTypes = {};

export default PaymentListPage;
