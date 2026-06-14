import PropTypes from "prop-types";
import "./BookingStepHeader.css";

function BookingStepHeader({ step, title, icon: Icon }) {
  return (
    <div className="booking-step-header">
      <div className="booking-step-header__badge">{step}</div>
      {Icon && <Icon size={18} className="booking-step-header__icon" aria-hidden="true" />}
      <h2 className="booking-step-header__title">{title}</h2>
    </div>
  );
}

BookingStepHeader.propTypes = {
  step: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
};

BookingStepHeader.defaultProps = {
  icon: null,
};

export default BookingStepHeader;
