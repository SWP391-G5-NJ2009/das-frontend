import PropTypes from "prop-types";
import Badge from "../../../common/Badge/Badge";
import "./PaymentTable.css";

const EMPTY_VALUE = "-";

function formatCurrencyVnd(amount) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return EMPTY_VALUE;
  }

  return `${new Intl.NumberFormat("en-US").format(numericAmount)} VND`;
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

function getPaymentKey(payment) {
  return (
    payment.payment_id ||
    payment.transaction_code ||
    `${payment.invoice_id}-${payment.payment_date}`
  );
}

function PaymentTable({ payments }) {
  return (
    <div className="payment-table">
      <table className="payment-table__table">
        <thead>
          <tr>
            <th scope="col">Payment ID</th>
            <th scope="col">Invoice ID</th>
            <th scope="col">Amount</th>
            <th scope="col">Method</th>
            <th scope="col">Time</th>
            <th scope="col">Transaction ID</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={getPaymentKey(payment)}>
              <td>{payment.payment_id ?? EMPTY_VALUE}</td>
              <td>{payment.invoice_id ?? EMPTY_VALUE}</td>
              <td className="payment-table__amount">
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
  );
}

PaymentTable.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      invoice_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      payment_date: PropTypes.string,
      payment_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      payment_method: PropTypes.string,
      status: PropTypes.string,
      transaction_code: PropTypes.string,
    }),
  ).isRequired,
};

export default PaymentTable;
