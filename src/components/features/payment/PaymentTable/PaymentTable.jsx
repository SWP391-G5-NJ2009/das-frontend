import PropTypes from "prop-types";
import { Banknote, Eye } from "lucide-react";
import Badge from "../../../common/Badge/Badge";
import "./PaymentTable.css";

const EMPTY_VALUE = "-";
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

function PaymentTable({ dateColumn, onPay, onViewDetail, payments, showPayAction }) {
  const isPaymentDate = dateColumn === "payment";

  return (
    <div className="payment-table">
      <table className="payment-table__table">
        <thead>
          <tr>
            <th scope="col">Mã hóa đơn</th>
            <th scope="col">Bệnh nhân</th>
            <th scope="col">SĐT</th>
            {/* <th scope="col">Bác sĩ phụ trách</th> */}
            <th scope="col">{isPaymentDate ? "Ngày thanh toán" : "Ngày hẹn"}</th>
            <th scope="col">Tổng</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.payment_id || payment.invoice_id}>
              <td className="payment-table__invoice">{payment.invoice_id}</td>
              <td>{payment.patient?.full_name || EMPTY_VALUE}</td>
              <td>{payment.patient?.phone || EMPTY_VALUE}</td>
              {/* <td>{payment.dentist?.full_name ? `BS. ${payment.dentist.full_name}` : EMPTY_VALUE}</td> */}
              <td>{isPaymentDate
                ? formatAppointmentDate(payment.payment_date)
                : formatAppointmentDate(payment.appointmentDate, payment.appointmentTime)}</td>
              <td className="payment-table__amount">{formatMoney(payment.amount)}</td>
              <td><Badge status={payment.status || "Chưa thanh toán"} /></td>
              <td>
                <div className="payment-table__actions">
                  {onViewDetail && (
                  <button
                    aria-label={`Xem chi tiết hóa đơn INV-${payment.invoice_id}`}
                    className="payment-table__view"
                    onClick={() => onViewDetail(payment)}
                    title="Xem chi tiết"
                    type="button"
                  ><Eye aria-hidden="true" size={18} /></button>
                  )}
                  {showPayAction && (
                    <button
                      aria-label={`Thanh toán hóa đơn INV-${payment.invoice_id}`}
                      className="payment-table__pay"
                      onClick={() => onPay(payment)}
                      title="Thanh toán"
                      type="button"
                    ><Banknote aria-hidden="true" size={18} /></button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

PaymentTable.propTypes = {
  dateColumn: PropTypes.oneOf(["appointment", "payment"]),
  onPay: PropTypes.func,
  onViewDetail: PropTypes.func,
  payments: PropTypes.arrayOf(PropTypes.shape({
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    appointmentDate: PropTypes.string,
    appointmentTime: PropTypes.string,
    dentist: PropTypes.shape({ full_name: PropTypes.string }),
    invoice_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    patient: PropTypes.shape({ full_name: PropTypes.string, phone: PropTypes.string }),
    payment_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    payment_date: PropTypes.string,
    status: PropTypes.string,
  })).isRequired,
  showPayAction: PropTypes.bool,
};
PaymentTable.defaultProps = { dateColumn: "appointment", onPay: null, onViewDetail: null, showPayAction: false };

export default PaymentTable;
