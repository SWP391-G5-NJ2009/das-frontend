import PropTypes from "prop-types";
import "./ProfileField.css";

const EMPTY_VALUE = "Not updated";

function ProfileField({ label, value, wide }) {
  const className = `profile-field${wide ? " profile-field--wide" : ""}`;

  return (
    <label className={className}>
      <span className="profile-field__label">{label}</span>
      <input
        className="profile-field__input"
        value={value || EMPTY_VALUE}
        readOnly
      />
    </label>
  );
}

ProfileField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  wide: PropTypes.bool,
};

ProfileField.defaultProps = {
  value: "",
  wide: false,
};

export default ProfileField;
