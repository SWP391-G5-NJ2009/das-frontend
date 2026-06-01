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
};

function Badge({ status }) {
  return (
    <span className={`badge badge--${STATUS_CLASS[status]} status-badge`}>
      {status}
    </span>
  );
}

Badge.propTypes = {
  status: PropTypes.oneOf([
    "Confirmed",
    "Waiting",
    "Checked-in",
    "Cancelled",
    "No-Show",
    "Conflict",
    "In-Treatment",
  ]).isRequired,
};

export default Badge;
