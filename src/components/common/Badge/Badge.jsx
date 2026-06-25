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
  Confirmed: "Confirmed",
  Waiting: "Waiting",
  "Checked-in": "Checked-in",
  Cancelled: "Cancelled",
  "No-Show": "No-Show",
  Conflict: "Conflict",
  "In-Treatment": "In Treatment",
  Completed: "Completed",
  Pending: "Pending",
  Failed: "Failed",
  Refunded: "Refunded",
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
