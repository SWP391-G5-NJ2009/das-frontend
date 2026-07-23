import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CalendarDays, ReceiptText, X } from "lucide-react";
import PaymentState from "../PaymentState/PaymentState";
import "./PaymentDetailModal.css";

const EMPTY_VALUE = "-";
const formatMoney = (value) => `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)}đ`;

const formatDateTime = (value) => {
  if (!value) return EMPTY_VALUE;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return EMPTY_VALUE;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hour}:${minute}`;
};

const formatAppointment = (date, time) => {
  if (!date) return EMPTY_VALUE;
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}${time ? ` ${time.slice(0, 5)}` : ""}`;
};

const PAYMENT_METHOD_LABELS = {
  "bank transfer": "Chuyển khoản ngân hàng",
  bank_transfer: "Chuyển khoản ngân hàng",
  cash: "Tiền mặt",
  card: "Thẻ",
};

const PAYMENT_STATUS_LABELS = {
  completed: "Hoàn tất",
  paid: "Đã thanh toán",
  pending: "Đang chờ",
  failed: "Thất bại",
};

const getDisplayLabel = (value, labels) => value
  ? labels[String(value).toLowerCase()] || value
  : EMPTY_VALUE;

function InfoField({ children, label, muted, value, valueClassName }) {
  return (
    <div className="payment-detail__field">
      <dt>{label}</dt>
      <dd
        className={[
          "payment-detail__field-value",
          muted ? "payment-detail__field-value--muted" : "",
          valueClassName,
        ].filter(Boolean).join(" ")}
      >
        {children || value || EMPTY_VALUE}
      </dd>
    </div>
  );
}

InfoField.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string.isRequired,
  muted: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueClassName: PropTypes.string,
};

InfoField.defaultProps = {
  children: null,
  muted: false,
  value: EMPTY_VALUE,
  valueClassName: "",
};

function PaymentDetailModal({
  detail,
  error,
  isLoading,
  isPaying,
  onClose,
  onPay,
  paymentError,
  showPaymentActions,
  showPaymentInfo,
}) {
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");

  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div
      className="payment-detail__overlay"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
      role="presentation"
    >
      <section aria-labelledby="payment-detail-title" aria-modal="true" className="payment-detail" role="dialog">
        <header className="payment-detail__header">
          <h2 id="payment-detail-title">
            <ReceiptText aria-hidden="true" />
            Chi tiết hóa đơn
          </h2>
          <button aria-label="Đóng" className="payment-detail__close" onClick={onClose} type="button">
            <X aria-hidden="true" />
          </button>
        </header>

        {isLoading && <PaymentState isLoading message="Đang tải chi tiết hóa đơn..." />}
        {!isLoading && error && <PaymentState message={error.message} title="Không thể tải hóa đơn" variant="error" />}
        {!isLoading && detail && (
          <div className="payment-detail__body">
            <dl className="payment-detail__info">
              <InfoField label="Mã hóa đơn" value={`#${detail.invoiceId}`} valueClassName="payment-detail__field-value--strong" />
              <InfoField label="Tên khách hàng" value={detail.patient?.full_name} />
              <InfoField label="Số điện thoại" value={detail.patient?.phone} />
              <InfoField label="Bác sĩ phụ trách" value={detail.dentist?.full_name ? `BS. ${detail.dentist.full_name}` : EMPTY_VALUE} />
              <InfoField label="Ngày hẹn">
                <CalendarDays aria-hidden="true" />
                {formatAppointment(detail.appointmentDate, detail.appointmentTime)}
              </InfoField>
            </dl>

            <section className="payment-detail__section">
              <h3>Chi tiết dịch vụ</h3>
              <div className="payment-detail__items">
                {detail.items?.length ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Nội dung</th>
                        <th>Loại</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.items.map((item) => (
                        <tr key={item.id || item.name}>
                          <td>{item.name}</td>
                          <td>{item.type}</td>
                          <td>{formatMoney(item.unitPrice)}</td>
                          <td>{item.quantity}</td>
                          <td>{formatMoney(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p className="payment-detail__empty">Chưa có chi tiết dịch vụ.</p>}
              </div>
            </section>

            {showPaymentActions && (
              <section className="payment-detail__checkout">
                <label className="payment-detail__payment-method">
                  <span>Phương thức thanh toán</span>
                  <select
                    disabled={isPaying}
                    onChange={(event) => setPaymentMethod(event.target.value)}
                    value={paymentMethod}
                  >
                    <option value="Tiền mặt">Tiền mặt</option>
                    <option value="Chuyển khoản">Chuyển khoản</option>
                  </select>
                </label>
                <div className="payment-detail__checkout-actions">
                  <div className="payment-detail__checkout-total">
                    <span>Tổng cộng</span>
                    <strong>{formatMoney(detail.amount)}</strong>
                  </div>
                  <button
                    className="payment-detail__pay"
                    disabled={isPaying}
                    onClick={() => onPay(paymentMethod)}
                    type="button"
                  >
                    {isPaying ? "Đang xử lý..." : "Thanh toán"}
                  </button>
                </div>
                {paymentError && (
                  <p className="payment-detail__payment-error" role="alert">
                    {paymentError.message}
                  </p>
                )}
              </section>
            )}

            {showPaymentInfo && (
              <section className="payment-detail__section">
                <dl className="payment-detail__info">
                  <InfoField label="Mã giao dịch" muted value={detail.transactionCode} />
                  <InfoField label="Phương thức" value={getDisplayLabel(detail.paymentMethod, PAYMENT_METHOD_LABELS)} />
                <InfoField label="Ngày thanh toán" value={formatDateTime(detail.paymentDate)} />
                  <InfoField
                    label="Trạng thái"
                    value={getDisplayLabel(detail.status, PAYMENT_STATUS_LABELS)}
                  />
                </dl>
              </section>
            )}

            {!showPaymentActions && (
              <footer className="payment-detail__total">
                <span>Tổng cộng</span>
                <strong>{formatMoney(detail.amount)}</strong>
              </footer>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

PaymentDetailModal.propTypes = {
  detail: PropTypes.shape({
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    appointmentDate: PropTypes.string,
    appointmentTime: PropTypes.string,
    dentist: PropTypes.shape({ full_name: PropTypes.string }),
    invoiceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    items: PropTypes.arrayOf(PropTypes.object),
    patient: PropTypes.shape({ full_name: PropTypes.string, phone: PropTypes.string }),
    paymentDate: PropTypes.string,
    paymentMethod: PropTypes.string,
    status: PropTypes.string,
    transactionCode: PropTypes.string,
  }),
  error: PropTypes.instanceOf(Error),
  isLoading: PropTypes.bool.isRequired,
  isPaying: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onPay: PropTypes.func,
  paymentError: PropTypes.instanceOf(Error),
  showPaymentActions: PropTypes.bool,
  showPaymentInfo: PropTypes.bool,
};

PaymentDetailModal.defaultProps = {
  detail: null,
  error: null,
  isPaying: false,
  onPay: null,
  paymentError: null,
  showPaymentActions: false,
  showPaymentInfo: true,
};

export default PaymentDetailModal;
