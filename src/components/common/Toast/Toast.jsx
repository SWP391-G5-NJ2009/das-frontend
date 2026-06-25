import { useEffect } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import "./Toast.css";


/**
 * Toast — fixed-position notification that auto-dismisses after `duration` ms.
 * Pass `onClose` to receive the dismiss callback (required for auto-dismiss).
 */
function Toast({ type, message, onClose, duration }) {
  useEffect(() => {
    if (!onClose || !duration) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast toast--${type}`} role="alert" aria-live="assertive">
      <p className="toast__message">{message}</p>
      {onClose && (
        <button
          type="button"
          className="toast__close"
          onClick={onClose}
          aria-label="Dismiss notification"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

Toast.propTypes = {
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  duration: PropTypes.number,
};

Toast.defaultProps = {
  type: "info",
  onClose: null,
  duration: 4000,
};

export default Toast;
