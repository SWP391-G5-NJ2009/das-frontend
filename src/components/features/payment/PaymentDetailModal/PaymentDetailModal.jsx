import { useEffect } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
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
  "bank transfer": "Chuyển khoản",
  bank_transfer: "Chuyển khoản",
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

function InfoRow({ label, value }) {
  return (
    <div className="payment-detail__info-row">
      <dt>{label}</dt>
      <dd>{value || EMPTY_VALUE}</dd>
    </div>
  );
}

InfoRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
InfoRow.defaultProps = { value: EMPTY_VALUE };

function PaymentDetailModal({ detail, error, isLoading, onClose, showPaymentInfo }) {
  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="payment-detail__overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()} role="presentation">
      <section aria-labelledby="payment-detail-title" aria-modal="true" className="payment-detail" role="dialog">
        <header className="payment-detail__header">
          <h2 id="payment-detail-title">Chi tiết hóa đơn</h2>
          <button aria-label="Đóng" className="payment-detail__close" onClick={onClose} type="button"><X /></button>
        </header>

        {isLoading && <PaymentState isLoading message="Đang tải chi tiết hóa đơn..." />}
        {!isLoading && error && <PaymentState message={error.message} title="Không thể tải hóa đơn" variant="error" />}
        {!isLoading && detail && (
          <div className="payment-detail__body">
            <section className="payment-detail__section">
              <h3>Thông tin hóa đơn</h3>
              <dl className="payment-detail__info">
                <InfoRow label="Mã hóa đơn" value={`INV-${detail.invoiceId}`} />
                <InfoRow label="Bệnh nhân" value={detail.patient?.full_name} />
                <InfoRow label="SĐT" value={detail.patient?.phone} />
                <InfoRow label="Bác sĩ phụ trách" value={detail.dentist?.full_name ? `BS. ${detail.dentist.full_name}` : EMPTY_VALUE} />
                <InfoRow label="Ngày hẹn" value={formatAppointment(detail.appointmentDate, detail.appointmentTime)} />
              </dl>
            </section>

            <section className="payment-detail__section">
              <h3>Chi tiết dịch vụ</h3>
              <div className="payment-detail__items">
                {detail.items?.length ? (
                  <table>
                    <thead><tr><th>Nội dung</th><th>Loại</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th></tr></thead>
                    <tbody>{detail.items.map((item) => (
                      <tr key={item.id || item.name}>
                        <td>{item.name}</td><td><span className={`payment-detail__type payment-detail__type--${item.type === "Thuốc" ? "medicine" : "service"}`}>{item.type}</span></td>
                        <td>{formatMoney(item.unitPrice)}</td><td>{item.quantity}</td><td>{formatMoney(item.total)}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                ) : <p className="payment-detail__empty">Chưa có chi tiết dịch vụ hoặc thuốc.</p>}
              </div>
            </section>

            {showPaymentInfo && <section className="payment-detail__section">
              <h3>Thông tin thanh toán</h3>
              <dl className="payment-detail__info">
                <InfoRow label="Mã giao dịch" value={detail.transactionCode} />
                <InfoRow label="Phương thức" value={getDisplayLabel(detail.paymentMethod, PAYMENT_METHOD_LABELS)} />
                <InfoRow label="Ngày thanh toán" value={formatDateTime(detail.paymentDate)} />
                <InfoRow label="Trạng thái" value={getDisplayLabel(detail.status, PAYMENT_STATUS_LABELS)} />
              </dl>
            </section>}

            <footer className="payment-detail__total"><span>Tổng cộng</span><strong>{formatMoney(detail.amount)}</strong></footer>
          </div>
        )}
      </section>
    </div>
  );
}

PaymentDetailModal.propTypes = {
  detail: PropTypes.shape({
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), appointmentDate: PropTypes.string,
    appointmentTime: PropTypes.string, dentist: PropTypes.shape({ full_name: PropTypes.string }),
    invoiceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), items: PropTypes.arrayOf(PropTypes.object),
    patient: PropTypes.shape({ full_name: PropTypes.string, phone: PropTypes.string }), paymentDate: PropTypes.string,
    paymentMethod: PropTypes.string, status: PropTypes.string, transactionCode: PropTypes.string,
  }),
  error: PropTypes.instanceOf(Error), isLoading: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired,
  showPaymentInfo: PropTypes.bool,
};
PaymentDetailModal.defaultProps = { detail: null, error: null, showPaymentInfo: true };

export default PaymentDetailModal;
