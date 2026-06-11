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

function Badge({ status }) {
  const statusClass = STATUS_CLASS[status] || "neutral";

  return (
    <span className={`badge badge--${statusClass} status-badge`}>
      {status}
    </span>
  );
}

Badge.propTypes = {
  status: PropTypes.string.isRequired,
};

export default Badge;
