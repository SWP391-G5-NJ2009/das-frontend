import PropTypes from "prop-types";
import "./Button.css";

function Button({ children, type, variant, disabled, onClick }) {
  return (
    <button
      className={`btn btn--${variant} button button--${variant}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf(["primary", "secondary", "inverted", "outlined"]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  type: "button",
  variant: "primary",
  disabled: false,
  onClick: null,
};

export default Button;
