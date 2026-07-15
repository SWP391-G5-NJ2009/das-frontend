import { FileText, UserRound, X } from "lucide-react";
import PropTypes from "prop-types";
import ProfileField from "../ProfileField/ProfileField";
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

function DentistProfileModal({ dentist, onClose }) {
  const status = getStatus(dentist.status);
  const isReceptionist = dentist.role?.toLowerCase() === "receptionist";
  const profileTitle = isReceptionist ? "Hồ sơ lễ tân" : "Hồ sơ nha sĩ";

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
            <h2 id="dentist-profile-title">{profileTitle}</h2>
          </div>
          <button className="dentist-profile-modal__close" type="button" aria-label="Close" onClick={onClose}>
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="dentist-profile-modal__body">
          <section className="dentist-profile-modal__summary">
            <div className="dentist-profile-modal__heading">
              <h3>
                {isReceptionist
                  ? dentist.fullName || EMPTY_VALUE
                  : getDoctorTitle(dentist.fullName)}
              </h3>
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
              {isReceptionist && (
                <>
                  <ProfileField
                    label="Mã lễ tân"
                    value={dentist.profileId}
                  />
                  <ProfileField
                    label="Mã tài khoản"
                    value={dentist.accountId}
                  />
                </>
              )}
              <ProfileField label="Họ và tên" value={dentist.fullName} />
              {isReceptionist && (
                <ProfileField label="Position" value="Receptionist" />
              )}
              <ProfileField label="Số điện thoại" value={dentist.phone} />
              <ProfileField label="Email" value={dentist.email} />
              <ProfileField
                label="Ngày sinh"
                value={formatBirthDate(dentist.birthDate)}
              />
              <ProfileField label="Giới tính" value={dentist.gender} />
              {isReceptionist ? (
                <>
                  <ProfileField
                    label="Tên đăng nhập"
                    value={dentist.username}
                    wide
                  />
                  <ProfileField
                    label="Địa chỉ"
                    value={dentist.address}
                    wide
                  />
                </>
              ) : (
                <ProfileField label="Address" value={dentist.address} wide />
              )}
            </div>
          </section>

          {!isReceptionist && (
            <section className="dentist-profile-modal__panel">
              <h3>
                <FileText size={20} aria-hidden="true" />
                Thông tin chuyên môn
              </h3>
              <div className="dentist-profile-modal__grid">
                <ProfileField
                  label="Speciality"
                  value={dentist.speciality}
                />
                <ProfileField
                  label="Experience"
                  value={dentist.experience}
                />
              </div>
            </section>
          )}

          {!isReceptionist && (
            <section className="dentist-profile-modal__panel">
              <h3>
                <FileText size={20} aria-hidden="true" />
                Dịch vụ phụ trách ({dentist.services?.length || 0})
              </h3>

              {dentist.services?.length ? (
                <ul className="dentist-profile-modal__service-list">
                  {dentist.services.map((service) => (
                    <li
                      className="dentist-profile-modal__service-item"
                      key={service.id}
                    >
                      {service.name || EMPTY_VALUE}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="dentist-profile-modal__service-empty">
                  Nha sĩ chưa được phân công dịch vụ.
                </p>
              )}
            </section>
          )}
        </div>
      </section>
    </div>
  );
}

DentistProfileModal.propTypes = {
  dentist: PropTypes.shape({
    accountId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    address: PropTypes.string,
    birthDate: PropTypes.string,
    email: PropTypes.string,
    experience: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    fullName: PropTypes.string,
    gender: PropTypes.string,
    phone: PropTypes.string,
    profileId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    role: PropTypes.string,
    services: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        name: PropTypes.string,
      }),
    ),
    speciality: PropTypes.string,
    status: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DentistProfileModal;
