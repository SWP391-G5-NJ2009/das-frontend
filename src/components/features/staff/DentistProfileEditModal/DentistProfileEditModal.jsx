import { Pencil, X } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { staffService } from "../../../../services/staff.service";
import DentistServiceSelector from "../DentistServiceSelector/DentistServiceSelector";
import "./DentistProfileEditModal.css";

function createForm(staff) {
  return {
    fullName: staff.fullName || "",
    email: staff.email || "",
    phone: staff.phone || "",
    birthDate: staff.birthDate?.split("T")[0] || "",
    gender: staff.gender || "",
    address: staff.address || "",
    speciality: staff.speciality || "",
    experience: String(staff.experience || ""),
    serviceIds: (staff.services || []).map((service) => String(service.id)),
  };
}

function DentistProfileEditModal({ dentist, onCancel, onClose, onSaved }) {
  const [form, setForm] = useState(() => createForm(dentist));
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const isReceptionist = dentist.role?.toLowerCase() === "receptionist";
  const isCreateMode = !dentist.profileId;
  const title = isReceptionist
    ? "Chỉnh sửa hồ sơ lễ tân"
    : "Chỉnh sửa hồ sơ nha sĩ";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSubmitError("");
  };

  const handleServicesChange = (serviceIds) => {
    setForm((current) => ({ ...current, serviceIds }));
    setSubmitError("");
  };

  const buildPayload = () => ({
    fullName: form.fullName,
    email: form.email,
    phone: form.phone,
    birthDate: form.birthDate,
    gender: form.gender,
    address: form.address,
    ...(!isReceptionist
      ? {
          speciality: form.speciality,
          experience: form.experience,
          serviceIds: form.serviceIds,
        }
      : {}),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isReceptionist && form.serviceIds.length === 0) {
      setSubmitError("Vui lòng chọn ít nhất một dịch vụ phụ trách.");
      return;
    }

    setIsSaving(true);
    setSubmitError("");

    try {
      const payload = buildPayload();
      const saved = isCreateMode
        ? await staffService.createStaffProfile({
            ...payload,
            role: isReceptionist ? "receptionist" : "dentist",
            accountId: dentist.accountId,
          })
        : isReceptionist
          ? await staffService.updateReceptionistProfile(
              dentist.profileId,
              payload,
            )
          : await staffService.updateDentistProfile(dentist.profileId, payload);
      onSaved(isCreateMode, saved);
    } catch (err) {
      setSubmitError(err.message || "Không thể cập nhật hồ sơ nhân viên.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="dentist-profile-edit__overlay"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="dentist-profile-edit"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-staff-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="dentist-profile-edit__header">
          <div>
            <Pencil size={20} aria-hidden="true" />
            <h2 id="edit-staff-title">{title}</h2>
          </div>
          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            disabled={isSaving}
          >
            <X size={18} />
          </button>
        </header>

        <form className="dentist-profile-edit__form" onSubmit={handleSubmit}>
          {submitError ? (
            <p className="dentist-profile-edit__alert" role="alert">
              {submitError}
            </p>
          ) : null}

          <fieldset className="dentist-profile-edit__section">
            <legend>Thông tin cá nhân</legend>
            <div className="dentist-profile-edit__grid">
              <label>
                <span>Họ và tên</span>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                <span>Ngày sinh</span>
                <input
                  name="birthDate"
                  type="date"
                  value={form.birthDate}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                <span>Giới tính</span>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                </select>
              </label>
              <label>
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  maxLength={254}
                />
              </label>
              <label>
                <span>Số điện thoại</span>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  pattern="[0-9]{10,11}"
                  maxLength={11}
                />
              </label>
              <label className="dentist-profile-edit__wide">
                <span>Địa chỉ</span>
                <textarea
                  name="address"
                  rows="3"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          </fieldset>

          {!isReceptionist && (
            <>
              <fieldset className="dentist-profile-edit__section">
                <legend>Thông tin chuyên môn</legend>
                <div className="dentist-profile-edit__grid">
                  <label>
                    <span>Chuyên môn</span>
                    <input
                      name="speciality"
                      value={form.speciality}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <label>
                    <span>Kinh nghiệm</span>
                    <input
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>
              </fieldset>

              <DentistServiceSelector
                selectedIds={form.serviceIds}
                onChange={handleServicesChange}
                disabled={isSaving}
                required
              />
            </>
          )}

          <footer className="dentist-profile-edit__footer">
            <button type="button" onClick={onCancel || onClose} disabled={isSaving}>
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

DentistProfileEditModal.propTypes = {
  dentist: PropTypes.shape({
    address: PropTypes.string,
    accountId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    birthDate: PropTypes.string,
    email: PropTypes.string,
    experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fullName: PropTypes.string,
    gender: PropTypes.string,
    phone: PropTypes.string,
    profileId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    role: PropTypes.string,
    services: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
      }),
    ),
    speciality: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  onSaved: PropTypes.func.isRequired,
};

DentistProfileEditModal.defaultProps = {
  onCancel: null,
};

export default DentistProfileEditModal;
