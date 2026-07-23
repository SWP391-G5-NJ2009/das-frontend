import { useState } from "react";
import PropTypes from "prop-types";
import { Banknote, Eye } from "lucide-react";
import Badge from "../../../common/Badge/Badge";
import "./PaymentTable.css";

const EMPTY_VALUE = "-";
const DEFAULT_PAYMENT_METHOD = "Tiền mặt";

const formatMoney = (amount) => Number.isFinite(Number(amount))
  ? `${new Intl.NumberFormat("vi-VN").format(Number(amount))}đ`
  : EMPTY_VALUE;

function formatAppointmentDate(date, time) {
  if (!date) return EMPTY_VALUE;
  const datePart = date.slice(0, 10);
  const parts = datePart.split("-");
  const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : datePart;
  const formattedTime = time?.slice(0, 5) || (date.includes("T") ? date.slice(11, 16) : "");
  return `${formattedDate}${formattedTime ? ` ${formattedTime}` : ""}`;
}

function PaymentTable({
  dateColumn = "appointment",
  onPay = null,
  onViewDetail = null,
  payingInvoiceId = null,
  payments,
  showActions = true,
  showPatientInfo = true,
  showPaymentMethod = false,
  showPayAction = false,
}) {
  const [paymentMethods, setPaymentMethods] = useState({});
  const isPaymentDate = dateColumn === "payment";

  const getPaymentMethod = (invoiceId) =>
    paymentMethods[invoiceId] || DEFAULT_PAYMENT_METHOD;

  const changePaymentMethod = (invoiceId, method) => {
    setPaymentMethods((current) => ({ ...current, [invoiceId]: method }));
  };

  return (
    <div className="payment-table">
      <table className="payment-table__table">
        <thead>
          <tr>
            <th scope="col">Mã hóa đơn</th>
            {showPatientInfo && <th scope="col">Bệnh nhân</th>}
            {showPatientInfo && <th scope="col">SĐT</th>}
            <th scope="col">{isPaymentDate ? "Ngày thanh toán" : "Ngày hẹn"}</th>
            {showPaymentMethod && <th scope="col">Phương thức</th>}
            <th scope="col">Tổng</th>
            <th scope="col">Trạng thái</th>
            {showActions && <th scope="col">Hành động</th>}
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => {
            const isPaying = String(payingInvoiceId) === String(payment.invoice_id);
            const isUnpaid = String(payment.status).toLowerCase() === "unpaid";

            return (
              <tr key={payment.payment_id || payment.invoice_id}>
                <td className="payment-table__invoice">{payment.invoice_id}</td>
                {showPatientInfo && <td>{payment.patient?.full_name || EMPTY_VALUE}</td>}
                {showPatientInfo && <td>{payment.patient?.phone || EMPTY_VALUE}</td>}
                <td>
                  {isPaymentDate
                    ? (payment.payment_date ? formatAppointmentDate(payment.payment_date) : "")
                    : formatAppointmentDate(payment.appointmentDate, payment.appointmentTime)}
                </td>
                {showPaymentMethod && <td>{payment.payment_method || EMPTY_VALUE}</td>}
                <td className="payment-table__amount">{formatMoney(payment.amount)}</td>
                <td><Badge status={payment.status || "Chưa thanh toán"} /></td>
                {showActions && (
                  <td>
                    <div className="payment-table__actions">
                      {onViewDetail && (
                        <button
                          aria-label={isUnpaid
                            ? `Thanh toán hóa đơn INV-${payment.invoice_id}`
                            : `Xem chi tiết hóa đơn INV-${payment.invoice_id}`}
                          className={`payment-table__view${isUnpaid ? " payment-table__view--payment" : ""}`}
                          onClick={() => onViewDetail(payment)}
                          title={isUnpaid ? "Thanh toán" : "Xem chi tiết"}
                          type="button"
                        >
                          {isUnpaid
                            ? <Banknote aria-hidden="true" size={18} />
                            : <Eye aria-hidden="true" size={18} />}
                        </button>
                      )}
                      {showPayAction && (
                        <div className="payment-table__checkout">
                          <label className="payment-table__method">
                            <span className="payment-table__method-label">Phương thức thanh toán</span>
                            <select
                              aria-label={`Phương thức thanh toán hóa đơn ${payment.invoice_id}`}
                              disabled={isPaying}
                              onChange={(event) => changePaymentMethod(payment.invoice_id, event.target.value)}
                              value={getPaymentMethod(payment.invoice_id)}
                            >
                              <option value="Tiền mặt">Tiền mặt</option>
                              <option value="Chuyển khoản">Chuyển khoản</option>
                            </select>
                          </label>
                          <button
                            className="payment-table__pay"
                            disabled={isPaying}
                            onClick={() => onPay(payment, getPaymentMethod(payment.invoice_id))}
                            type="button"
                          >
                            {isPaying ? "Đang xử lý..." : "Thanh toán"}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

PaymentTable.propTypes = {
  dateColumn: PropTypes.oneOf(["appointment", "payment"]),
  onPay: PropTypes.func,
  onViewDetail: PropTypes.func,
  payingInvoiceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  payments: PropTypes.arrayOf(PropTypes.shape({
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    appointmentDate: PropTypes.string,
    appointmentTime: PropTypes.string,
    invoice_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    patient: PropTypes.shape({ full_name: PropTypes.string, phone: PropTypes.string }),
    payment_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    payment_date: PropTypes.string,
    payment_method: PropTypes.string,
    status: PropTypes.string,
  })).isRequired,
  showActions: PropTypes.bool,
  showPatientInfo: PropTypes.bool,
  showPaymentMethod: PropTypes.bool,
  showPayAction: PropTypes.bool,
};

PaymentTable.defaultProps = {
  dateColumn: "appointment",
  onPay: null,
  onViewDetail: null,
  payingInvoiceId: null,
  showActions: true,
  showPatientInfo: true,
  showPaymentMethod: false,
  showPayAction: false,
};

export default PaymentTable;
