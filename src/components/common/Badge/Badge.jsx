import PropTypes from "prop-types";
import "./Badge.css";

const STATUS_CLASS = {
  Confirmed: "confirmed",
  "Checked-in": "checked-in",
  Cancelled: "cancelled",
  "No-Show": "no-show",
  Conflict: "conflict",
  "In-Treatment": "in-treatment",
  Completed: "completed",
  Paid: "paid",
  Unpaid: "unpaid",
  "Resolved No-Show": "resolved-no-show",
};

const STATUS_LABEL = {
  Confirmed: "Đã xác nhận",
  "Checked-in": "Đã check-in",
  Cancelled: "Đã hủy",
  "No-Show": "Vắng mặt",
  Conflict: "Xung đột",
  "In-Treatment": "Đang điều trị",
  Completed: "Hoàn tất",
  Paid: "Đã thanh toán",
  Unpaid: "Chưa thanh toán",
  "Resolved No-Show": "Đã xử lý vắng mặt",
};

function Badge({ status }) {
  const statusClass = STATUS_CLASS[status] || "neutral";

  return (
    <span className={`badge badge--${statusClass} status-badge`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

Badge.propTypes = {
  status: PropTypes.string.isRequired,
};

export default Badge;
