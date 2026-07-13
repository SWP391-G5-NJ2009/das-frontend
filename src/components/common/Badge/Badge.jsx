import PropTypes from "prop-types";
import "./Badge.css";

const STATUS_CLASS = {
  Confirmed: "confirmed",
  Waiting: "waiting",
  "Checked-in": "checked-in",
  Cancelled: "cancelled",
  "No-Show": "no-show",
  Conflict: "conflict",
  "In-Treatment": "in-treatment",
  Completed: "completed",
  Pending: "pending",
  Failed: "failed",
  Refunded: "refunded",
};

const STATUS_LABEL = {
  Confirmed: "Đã xác nhận",
  Waiting: "Đang chờ",
  "Checked-in": "Đã check-in",
  Cancelled: "Đã hủy",
  "No-Show": "Vắng mặt",
  Conflict: "Xung đột",
  "In-Treatment": "Đang điều trị",
  Completed: "Hoàn tất",
  Pending: "Đang chờ",
  Failed: "Thất bại",
  Refunded: "Đã hoàn tiền",
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
