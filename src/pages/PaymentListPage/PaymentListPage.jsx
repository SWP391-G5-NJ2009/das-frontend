import Badge from "../../components/Badge/Badge";
import Spinner from "../../components/Spinner/Spinner";
import { usePayments } from "../../hooks/usePayments";
import "./PaymentListPage.css";

const EMPTY_VALUE = "-";

function formatCurrencyVnd(amount) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return EMPTY_VALUE;
  }

  return `${new Intl.NumberFormat("vi-VN").format(numericAmount)} đ`;
}

function formatPaymentDate(paymentDate) {
  if (!paymentDate) {
    return EMPTY_VALUE;
  }

  const date = new Date(paymentDate);

  if (Number.isNaN(date.getTime())) {
    return EMPTY_VALUE;
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hour}:${minute}`;
}

function PaymentListPage() {
  const { payments, isLoading, error } = usePayments();

  return (
    <section className="payment-list" aria-labelledby="payment-list-title">
      <div className="payment-list__header">
        <div className="payment-list__heading">
          <h1 id="payment-list-title">Payment List</h1>
          <p>Theo dõi các giao dịch thanh toán đã ghi nhận trong hệ thống.</p>
        </div>
      </div>

      {isLoading && (
        <div className="payment-list__state" aria-live="polite">
          <Spinner />
          <p>Đang tải danh sách thanh toán...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="payment-list__state payment-list__state--error" role="alert">
          <h2>Không thể tải danh sách thanh toán</h2>
          <p>{error.message || "Vui lòng thử lại sau."}</p>
        </div>
      )}

      {!isLoading && !error && payments.length === 0 && (
        <div className="payment-list__state">
          <h2>Chưa có thanh toán nào</h2>
          <p>Không tìm thấy bản ghi thanh toán phù hợp.</p>
        </div>
      )}

      {!isLoading && !error && payments.length > 0 && (
        <div className="payment-list__table-wrap">
          <table className="payment-list__table">
            <thead>
              <tr>
                <th scope="col">Mã thanh toán</th>
                <th scope="col">Mã hóa đơn</th>
                <th scope="col">Số tiền</th>
                <th scope="col">Phương thức</th>
                <th scope="col">Thời gian</th>
                <th scope="col">Mã giao dịch</th>
                <th scope="col">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={
                    payment.payment_id ||
                    payment.transaction_code ||
                    `${payment.invoice_id}-${payment.payment_date}`
                  }
                >
                  <td>{payment.payment_id ?? EMPTY_VALUE}</td>
                  <td>{payment.invoice_id ?? EMPTY_VALUE}</td>
                  <td className="payment-list__amount">
                    {formatCurrencyVnd(payment.amount)}
                  </td>
                  <td>{payment.payment_method ?? EMPTY_VALUE}</td>
                  <td>{formatPaymentDate(payment.payment_date)}</td>
                  <td>{payment.transaction_code ?? EMPTY_VALUE}</td>
                  <td>
                    <Badge status={payment.status || "Pending"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

PaymentListPage.propTypes = {};

export default PaymentListPage;
