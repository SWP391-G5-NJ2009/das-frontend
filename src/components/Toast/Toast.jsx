import PropTypes from "prop-types";
import "./Toast.css";

function Toast({ type, message }) {
  return (
    <div className={`toast toast--${type}`} role="status">
      <p className="toast__message">{message}</p>
    </div>
  );
}

Toast.propTypes = {
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  message: PropTypes.string.isRequired,
};

Toast.defaultProps = {
  type: "info",
};

export default Toast;
