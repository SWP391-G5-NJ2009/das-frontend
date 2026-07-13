import { FileText, UserRound, X } from "lucide-react";
import PropTypes from "prop-types";
import "./DentistProfileModal.css";

const EMPTY_VALUE = "Not updated";

function getDoctorTitle(name) {
  if (!name || name === EMPTY_VALUE) return "Dr. Not updated";
  if (name.startsWith("Dr.")) return name;

  return name.startsWith("BS.") ? `Dr.${name.slice(3)}` : `Dr. ${name}`;
}

function formatBirthDate(birthDate) {
  if (!birthDate) return EMPTY_VALUE;

  const [year, month, day] = birthDate.split("T")[0].split("-");
  return year && month && day ? `${day}/${month}/${year}` : birthDate;
}

function getStatus(status) {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "active") {
    return { label: "Hoạt động", modifier: "active" };
  }

  if (normalizedStatus === "banned") {
    return { label: "Bị khóa", modifier: "banned" };
  }

  return { label: "Unknown", modifier: "inactive" };
}

function ProfileField({ label, value, wide }) {
  const className = `dentist-profile-modal__field${
    wide ? " dentist-profile-modal__field--wide" : ""
  }`;

  return (
    <label className={className}>
      <span>{label}</span>
      <input value={value || EMPTY_VALUE} readOnly />
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

function DentistProfileModal({ dentist, onClose }) {
  const status = getStatus(dentist.status);

  return (
    <div
      className="dentist-profile-modal__overlay"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="dentist-profile-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dentist-profile-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="dentist-profile-modal__header">
          <div className="dentist-profile-modal__title">
            <UserRound size={20} aria-hidden="true" />
            <h2 id="dentist-profile-title">Hồ sơ nha sĩ</h2>
          </div>
          <button
            className="dentist-profile-modal__close"
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="dentist-profile-modal__body">
          <section className="dentist-profile-modal__summary">
            <div className="dentist-profile-modal__heading">
              <h3>{getDoctorTitle(dentist.fullName)}</h3>
              <span
                className={`dentist-profile-modal__status dentist-profile-modal__status--${status.modifier}`}
              >
                {status.label}
              </span>
            </div>
          </section>

          <section className="dentist-profile-modal__panel">
            <h3>
              <FileText size={20} aria-hidden="true" />
              Thông tin cá nhân
            </h3>
            <div className="dentist-profile-modal__grid">
              <ProfileField label="Họ và tên" value={dentist.fullName} />
              <ProfileField label="Position" value="Specialist Dentist" />
              <ProfileField label="Số điện thoại" value={dentist.phone} />
              <ProfileField label="Email" value={dentist.email} />
              <ProfileField
                label="Birthdate"
                value={formatBirthDate(dentist.birthDate)}
              />
              <ProfileField label="Gender" value={dentist.gender} />
              <ProfileField
                label="Speciality"
                value={dentist.speciality || dentist.position}
                wide
              />
              <ProfileField label="Experience" value={dentist.experience} wide />
              <ProfileField label="Address" value={dentist.address} wide />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

DentistProfileModal.propTypes = {
  dentist: PropTypes.shape({
    address: PropTypes.string,
    birthDate: PropTypes.string,
    email: PropTypes.string,
    experience: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    fullName: PropTypes.string,
    gender: PropTypes.string,
    phone: PropTypes.string,
    position: PropTypes.string,
    speciality: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DentistProfileModal;
