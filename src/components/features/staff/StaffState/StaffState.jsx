import PropTypes from "prop-types";
import Spinner from "../../../common/Spinner/Spinner";
import "./StaffState.css";

function StaffState({ title, message, isLoading, variant }) {
  const className =
    variant === "error" ? "staff-state staff-state--error" : "staff-state";

  return (
    <div
      className={className}
      role={variant === "error" ? "alert" : "status"}
      aria-live={isLoading ? "polite" : undefined}
    >
      {isLoading && <Spinner />}
      {title && <h2>{title}</h2>}
      {message && <p>{message}</p>}
    </div>
  );
}

StaffState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  isLoading: PropTypes.bool,
  variant: PropTypes.oneOf(["default", "error"]),
};

StaffState.defaultProps = {
  title: "",
  message: "",
  isLoading: false,
  variant: "default",
};

export default StaffState;
