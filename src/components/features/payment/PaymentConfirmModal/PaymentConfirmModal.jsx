import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import "./PaymentConfirmModal.css";

const formatMoney = (value) => `${new Intl.NumberFormat("vi-VN").format(Number(value) || 0)}đ`;

function PaymentConfirmModal({ invoice, isSubmitting, error, onClose, onConfirm }) {
  const [paymentMethod, setPaymentMethod] = useState("cash");

  useEffect(() => {
    const closeOnEscape = (event) => event.key === "Escape" && !isSubmitting && onClose();
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isSubmitting, onClose]);

  const submit = (event) => {
    event.preventDefault();
    onConfirm(paymentMethod);
  };

  return (
    <div className="payment-confirm__overlay" onMouseDown={(event) => event.target === event.currentTarget && !isSubmitting && onClose()} role="presentation">
      <section aria-labelledby="payment-confirm-title" aria-modal="true" className="payment-confirm" role="dialog">
        <header className="payment-confirm__header">
          <h2 id="payment-confirm-title">Thanh toán hóa đơn</h2>
          <button aria-label="Đóng" className="payment-confirm__close" disabled={isSubmitting} onClick={onClose} type="button"><X /></button>
        </header>
        <form className="payment-confirm__body" onSubmit={submit}>
          <div className="payment-confirm__summary">
            <span>INV-{invoice.invoice_id}</span>
            <strong>{formatMoney(invoice.amount)}</strong>
          </div>
          <label className="payment-confirm__field">
            <span>Phương thức thanh toán</span>
            <select disabled={isSubmitting} onChange={(event) => setPaymentMethod(event.target.value)} value={paymentMethod}>
              <option value="cash">Tiền mặt</option>
              <option value="bank_transfer">Chuyển khoản</option>
              <option value="card">Thẻ</option>
            </select>
          </label>
          {error && <p className="payment-confirm__error" role="alert">{error.message}</p>}
          <footer className="payment-confirm__actions">
            <button className="payment-confirm__button payment-confirm__button--cancel" disabled={isSubmitting} onClick={onClose} type="button">Hủy</button>
            <button className="payment-confirm__button payment-confirm__button--submit" disabled={isSubmitting} type="submit">{isSubmitting ? "Đang xử lý..." : "Xác nhận thanh toán"}</button>
          </footer>
        </form>
      </section>
    </div>
  );
}

PaymentConfirmModal.propTypes = {
  error: PropTypes.instanceOf(Error),
  invoice: PropTypes.shape({
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    invoice_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }).isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

PaymentConfirmModal.defaultProps = { error: null };

export default PaymentConfirmModal;
