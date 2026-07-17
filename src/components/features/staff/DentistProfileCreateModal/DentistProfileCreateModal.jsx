import { FilePlus2, X } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Spinner from "../../../common/Spinner/Spinner";
import { useCreateDentistProfile } from "../../../../hooks/useCreateDentistProfile";
import "./DentistProfileCreateModal.css";

const EMPTY_FORM = {
  role: "dentist",
  accountId: "",
  fullName: "",
  birthDate: "",
  gender: "",
  address: "",
  speciality: "",
  experience: "",
};

function validateForm(form, selectedAccount) {
  const errors = {};

  if (!form.accountId) errors.accountId = "Vui lòng chọn tài khoản nhân viên.";
  if (!form.fullName.trim()) errors.fullName = "Vui lòng nhập họ và tên.";
  if (!selectedAccount?.email) {
    errors.email = "The selected account has no email address.";
  }
  if (!selectedAccount?.phone) {
    errors.phone = "The selected account has no phone number.";
  }
  if (!form.birthDate) errors.birthDate = "Birthdate is required.";
  if (!form.gender) errors.gender = "Gender is required.";
  if (!form.address.trim()) errors.address = "Address is required.";
  if (form.role === "dentist" && !form.speciality.trim()) errors.speciality = "Vui lòng nhập chuyên môn.";
  if (form.role === "dentist" && !form.experience.trim()) errors.experience = "Vui lòng nhập kinh nghiệm.";

  return errors;
}

function DentistProfileCreateModal({ onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const {
    availableAccounts,
    isLoadingAccounts,
    isCreating,
    error,
    fetchAvailableAccounts,
    createProfile,
  } = useCreateDentistProfile();

  useEffect(() => {
    fetchAvailableAccounts();
  }, [fetchAvailableAccounts]);

  const roleAccounts = availableAccounts.filter((account) => account.role === form.role);
  const selectedAccount = roleAccounts.find(
    (account) => account.accountId === form.accountId,
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
      ...(name === "role" ? { accountId: "", speciality: "", experience: "" } : {}),
    }));
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
      ...(name === "accountId" ? { email: "", phone: "" } : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateForm(form, selectedAccount);
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      const payload = form.role === "dentist"
        ? form
        : {
            role: form.role,
            accountId: form.accountId,
            fullName: form.fullName,
            birthDate: form.birthDate,
            gender: form.gender,
            address: form.address,
          };
      const profile = await createProfile(payload);
      onCreated(profile);
    } catch {
      //
    }
  };

  return (
    <div
      className="dentist-profile-create__overlay"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="dentist-profile-create"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-dentist-profile-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="dentist-profile-create__header">
          <div className="dentist-profile-create__title">
            <FilePlus2 size={20} aria-hidden="true" />
            <div>
              <h2 id="create-dentist-profile-title">Thêm nhân viên mới</h2>
              <p>Tạo hồ sơ nha sĩ hoặc lễ tân từ tài khoản khả dụng.</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={isCreating}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        {isLoadingAccounts ? (
          <div className="dentist-profile-create__state">
            <Spinner />
          </div>
        ) : availableAccounts.length === 0 ? (
          <div className="dentist-profile-create__empty">
            <h3>Không có tài khoản nhân viên khả dụng</h3>
            <p>Vui lòng liên hệ quản trị viên hệ thống.</p>
          </div>
        ) : (
          <form
            className="dentist-profile-create__form"
            onSubmit={handleSubmit}
            noValidate
          >
            {error && (
              <p className="dentist-profile-create__alert" role="alert">
                {error.message}
              </p>
            )}

            <label className="dentist-profile-create__field dentist-profile-create__field--wide">
              <span>Vai trò <strong>*</strong></span>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="dentist">Nha sĩ</option>
                <option value="receptionist">Lễ tân</option>
              </select>
            </label>

            <label className="dentist-profile-create__field dentist-profile-create__field--wide">
              <span>
                Account <strong>*</strong>
              </span>
              <select
                name="accountId"
                value={form.accountId}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.accountId)}
              >
                <option value="">Chọn tài khoản {form.role === "dentist" ? "nha sĩ" : "lễ tân"} khả dụng</option>
                {roleAccounts.map((account) => (
                  <option key={account.accountId} value={account.accountId}>
                    {account.username}
                  </option>
                ))}
              </select>
              {fieldErrors.accountId && <small>{fieldErrors.accountId}</small>}
            </label>

            {selectedAccount && (
              <fieldset className="dentist-profile-create__account">
                <legend>Thông tin tài khoản đã chọn</legend>
                <dl>
                  <div>
                    <dt>Tên đăng nhập</dt>
                    <dd>{selectedAccount.username}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{selectedAccount.email || "Not updated"}</dd>
                  </div>
                  <div>
                    <dt>Số điện thoại</dt>
                    <dd>{selectedAccount.phone || "Not updated"}</dd>
                  </div>
                  <div>
                    <dt>Role</dt>
                    <dd>{form.role === "dentist" ? "Nha sĩ" : "Lễ tân"}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{selectedAccount.status}</dd>
                  </div>
                </dl>
                {fieldErrors.email && <small>{fieldErrors.email}</small>}
                {fieldErrors.phone && <small>{fieldErrors.phone}</small>}
              </fieldset>
            )}

            <div className="dentist-profile-create__grid">
              <label className="dentist-profile-create__field">
                <span>
                  Họ và tên <strong>*</strong>
                </span>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.fullName)}
                />
                {fieldErrors.fullName && <small>{fieldErrors.fullName}</small>}
              </label>
              <label className="dentist-profile-create__field">
                <span>
                  Birthdate <strong>*</strong>
                </span>
                <input
                  name="birthDate"
                  type="date"
                  value={form.birthDate}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.birthDate)}
                />
                {fieldErrors.birthDate && <small>{fieldErrors.birthDate}</small>}
              </label>
              <label className="dentist-profile-create__field">
                <span>
                  Gender <strong>*</strong>
                </span>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.gender)}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                </select>
                {fieldErrors.gender && <small>{fieldErrors.gender}</small>}
              </label>
              {form.role === "dentist" && (
                <>
                  <label className="dentist-profile-create__field">
                    <span>Chuyên môn <strong>*</strong></span>
                    <input name="speciality" value={form.speciality} onChange={handleChange} aria-invalid={Boolean(fieldErrors.speciality)} />
                    {fieldErrors.speciality && <small>{fieldErrors.speciality}</small>}
                  </label>
                  <label className="dentist-profile-create__field dentist-profile-create__field--wide">
                    <span>Kinh nghiệm <strong>*</strong></span>
                    <input name="experience" placeholder="VD: 5 năm" value={form.experience} onChange={handleChange} aria-invalid={Boolean(fieldErrors.experience)} />
                    {fieldErrors.experience && <small>{fieldErrors.experience}</small>}
                  </label>
                </>
              )}
              <label className="dentist-profile-create__field dentist-profile-create__field--wide">
                <span>
                  Address <strong>*</strong>
                </span>
                <textarea
                  name="address"
                  rows="3"
                  value={form.address}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.address)}
                />
                {fieldErrors.address && <small>{fieldErrors.address}</small>}
              </label>
            </div>

            <footer className="dentist-profile-create__footer">
              <button
                className="dentist-profile-create__cancel"
                type="button"
                onClick={onClose}
                disabled={isCreating}
              >
                Hủy
              </button>
              <button
                className="dentist-profile-create__submit"
                type="submit"
                disabled={isCreating}
              >
                {isCreating ? "Đang tạo..." : "Thêm nhân viên"}
              </button>
            </footer>
          </form>
        )}
      </section>
    </div>
  );
}

DentistProfileCreateModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreated: PropTypes.func.isRequired,
};

export default DentistProfileCreateModal;
