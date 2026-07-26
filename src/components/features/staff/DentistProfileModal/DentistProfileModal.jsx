import { FileText, Pencil, UserRound, X } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import ProfileField from "../ProfileField/ProfileField";
import DentistProfileEditModal from "../DentistProfileEditModal/DentistProfileEditModal";
import "./DentistProfileModal.css";

const EMPTY_VALUE = "Chưa cập nhật";

function getDoctorTitle(name) {
  if (!name || name === EMPTY_VALUE) return EMPTY_VALUE;
  return `BS. ${name}`;
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

  if (normalizedStatus === "deactivated") {
    return { label: "Không hoạt động", modifier: "inactive" };
  }

  return { label: "Không xác định", modifier: "inactive" };
}

function getGenderLabel(gender) {
  const normalizedGender = gender?.toLowerCase();

  if (normalizedGender === "male") return "Nam";
  if (normalizedGender === "female") return "Nữ";

  return gender || EMPTY_VALUE;
}

function DentistProfileModal({ dentist, onClose, onSaved }) {
  const [isEditing, setIsEditing] = useState(false);
  const status = getStatus(dentist.status);
  const isReceptionist = dentist.role?.toLowerCase() === "receptionist";
  const profileTitle = isReceptionist ? "Hồ sơ lễ tân" : "Hồ sơ nha sĩ";

  if (isEditing) {
    return (
      <DentistProfileEditModal
        dentist={dentist}
        onCancel={() => setIsEditing(false)}
        onClose={onClose}
        onSaved={(wasCreated, saved) => {
          setIsEditing(false);
          onSaved(wasCreated, saved);
        }}
      />
    );
  }

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
          <div className="dentist-profile-modal__header-actions">
            <button
              className="dentist-profile-modal__edit"
              type="button"
              onClick={() => setIsEditing(true)}
            >
              <Pencil size={16} aria-hidden="true" />
              Chỉnh sửa
            </button>
            <button className="dentist-profile-modal__close" type="button" aria-label="Close" onClick={onClose}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>
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
              <ProfileField label="Họ và tên" value={dentist.fullName} />
              <ProfileField label="Số điện thoại" value={dentist.phone} />
              <ProfileField label="Email" value={dentist.email} />
              <ProfileField
                label="Ngày sinh"
                value={formatBirthDate(dentist.birthDate)}
              />
              <ProfileField
                label="Giới tính"
                value={getGenderLabel(dentist.gender)}
              />
              <ProfileField label="Địa chỉ" value={dentist.address} wide />
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
                  label="Chuyên môn"
                  value={dentist.speciality}
                />
                <ProfileField
                  label="Kinh nghiệm"
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
  onSaved: PropTypes.func.isRequired,
};

export default DentistProfileModal;
