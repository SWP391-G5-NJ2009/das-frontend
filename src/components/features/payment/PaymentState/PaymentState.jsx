import PropTypes from "prop-types";
import Spinner from "../../../common/Spinner/Spinner";
import "./PaymentState.css";

function PaymentState({ title, message, isLoading, variant }) {
  const stateClassName =
    variant === "error" ? "payment-state payment-state--error" : "payment-state";

  return (
    <div
      className={stateClassName}
      role={variant === "error" ? "alert" : undefined}
      aria-live={isLoading ? "polite" : undefined}
    >
      {isLoading && <Spinner />}
      {title && <h2>{title}</h2>}
      {message && <p>{message}</p>}
    </div>
  );
}

PaymentState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  isLoading: PropTypes.bool,
  variant: PropTypes.oneOf(["default", "error"]),
};

PaymentState.defaultProps = {
  title: "",
  message: "",
  isLoading: false,
  variant: "default",
};

export default PaymentState;
