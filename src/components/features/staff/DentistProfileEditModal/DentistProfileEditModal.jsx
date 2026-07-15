import { Pencil, X } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { usePublicServices } from "../../../../hooks/useDentalServices";
import { staffService } from "../../../../services/staff.service";
import Spinner from "../../../common/Spinner/Spinner";
import "./DentistProfileEditModal.css";

function createForm(staff) {
  return {
    fullName: staff.fullName || "",
    birthDate: staff.birthDate?.split("T")[0] || "",
    gender: staff.gender || "",
    address: staff.address || "",
    speciality: staff.speciality || "",
    experience: String(staff.experience || ""),
    serviceIds: (staff.services || []).map((service) => String(service.id)),
  };
}

function DentistProfileEditModal({ dentist, onClose, onUpdated }) {
  const [form, setForm] = useState(() => createForm(dentist));
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { services, isLoading, error } = usePublicServices();
  const isReceptionist = dentist.role?.toLowerCase() === "receptionist";
  const title = isReceptionist
    ? "Chỉnh sửa hồ sơ lễ tân"
    : "Chỉnh sửa hồ sơ nha sĩ";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSubmitError("");
  };

  const toggleService = (serviceId) => {
    setForm((current) => ({
      ...current,
      serviceIds: current.serviceIds.includes(serviceId)
        ? current.serviceIds.filter((id) => id !== serviceId)
        : [...current.serviceIds, serviceId],
    }));
  };

  const buildPayload = () => ({
    fullName: form.fullName,
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
    setIsSaving(true);
    setSubmitError("");

    try {
      const payload = buildPayload();
      const updated = isReceptionist
        ? await staffService.updateReceptionistProfile(dentist.profileId, payload)
        : await staffService.updateDentistProfile(dentist.profileId, payload);
      onUpdated(updated);
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
                <span>Email (không thể chỉnh sửa)</span>
                <input value={dentist.email || "Chưa cập nhật"} disabled />
              </label>
              <label>
                <span>Số điện thoại (không thể chỉnh sửa)</span>
                <input value={dentist.phone || "Chưa cập nhật"} disabled />
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

              <fieldset className="dentist-profile-edit__section">
                <legend>Dịch vụ phụ trách</legend>
                {isLoading && <Spinner />}
                {error && (
                  <p className="dentist-profile-edit__alert">
                    Không thể tải danh sách dịch vụ.
                  </p>
                )}
                {!isLoading && !error && !services.length && (
                  <p>Không có dịch vụ đang hoạt động.</p>
                )}
                <div className="dentist-profile-edit__services">
                  {services.map((service) => {
                    const id = String(service.id);
                    return (
                      <label key={id}>
                        <input
                          type="checkbox"
                          checked={form.serviceIds.includes(id)}
                          onChange={() => toggleService(id)}
                        />
                        <span>{service.name}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </>
          )}

          <footer className="dentist-profile-edit__footer">
            <button type="button" onClick={onClose} disabled={isSaving}>
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving || (!isReceptionist && isLoading)}
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
    birthDate: PropTypes.string,
    email: PropTypes.string,
    experience: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fullName: PropTypes.string,
    gender: PropTypes.string,
    phone: PropTypes.string,
    profileId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
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
  onUpdated: PropTypes.func.isRequired,
};

export default DentistProfileEditModal;
