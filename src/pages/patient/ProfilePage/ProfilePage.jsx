import { useState } from "react";
import PatientPageShell from "../PatientPageShell";
import "./ProfilePage.css";
import { initialPatient } from "../patientData";
import { authService } from "../../../services/auth.service";

function ProfilePage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [patient, setPatient] = useState(initialPatient);
  const [draftPatient, setDraftPatient] = useState(initialPatient);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState({
    isLoading: false,
    error: "",
    success: "",
  });

  const handleEditProfile = () => {
    setDraftPatient(patient);
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setDraftPatient(patient);
    setIsEditingProfile(false);
  };

  const handleSaveProfile = () => {
    setPatient(draftPatient);
    setIsEditingProfile(false);
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setDraftPatient((current) => ({ ...current, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
    setPasswordStatus({ isLoading: false, error: "", success: "" });
  };

  const handleCancelPasswordChange = () => {
    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordStatus({ isLoading: false, error: "", success: "" });
  };

  const handleSubmitPasswordChange = async (event) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({
        isLoading: false,
        error: "Mật khẩu xác nhận không khớp.",
        success: "",
      });
      return;
    }

    setPasswordStatus({ isLoading: true, error: "", success: "" });

    try {
      await authService.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordStatus({
        isLoading: false,
        error: "",
        success: "Đổi mật khẩu thành công.",
      });
    } catch (error) {
      setPasswordStatus({
        isLoading: false,
        error: error.message || "Không thể đổi mật khẩu. Vui lòng thử lại.",
        success: "",
      });
    }
  };

  return (
    <PatientPageShell>
      <section
        className="patient-profile-section"
        aria-labelledby="patient-profile-title"
      >
        <article className="patient-profile-card">
          <div className="patient-profile-card__header">
            <div>
              <h1 id="patient-profile-title">Hồ sơ cá nhân</h1>
              <p>Quản lý thông tin cá nhân của bạn</p>
            </div>
            {!isEditingProfile && (
              <button
                className="patient-profile-card__edit"
                type="button"
                onClick={handleEditProfile}
              >
                Chỉnh sửa
              </button>
            )}
          </div>

          {isEditingProfile ? (
            <form className="patient-profile-form">
              <label className="patient-profile-form__field">
                <span>Họ và tên</span>
                <input
                  name="fullName"
                  type="text"
                  value={draftPatient.fullName}
                  onChange={handleProfileChange}
                />
              </label>
              <label className="patient-profile-form__field">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  value={draftPatient.email}
                  onChange={handleProfileChange}
                />
              </label>
              <label className="patient-profile-form__field">
                <span>Số điện thoại</span>
                <input
                  name="phone"
                  type="tel"
                  value={draftPatient.phone}
                  onChange={handleProfileChange}
                />
              </label>
              <label className="patient-profile-form__field">
                <span>Ngày sinh</span>
                <input
                  name="birthDate"
                  type="date"
                  value={draftPatient.birthDate}
                  onChange={handleProfileChange}
                />
              </label>
              <label className="patient-profile-form__field">
                <span>Giới tính</span>
                <input
                  name="gender"
                  type="text"
                  value={draftPatient.gender}
                  onChange={handleProfileChange}
                />
              </label>
              <label className="patient-profile-form__field patient-profile-form__field--full">
                <span>Địa chỉ</span>
                <input
                  name="address"
                  type="text"
                  value={draftPatient.address}
                  onChange={handleProfileChange}
                />
              </label>
              <div className="patient-profile-form__actions">
                <button type="button" onClick={handleSaveProfile}>
                  Lưu thay đổi
                </button>
                <button type="button" onClick={handleCancelEdit}>
                  Hủy
                </button>
              </div>
            </form>
          ) : (
            <dl className="patient-profile-details">
              <div>
                <dt>Họ và tên</dt>
                <dd>{patient.fullName}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{patient.email}</dd>
              </div>
              <div>
                <dt>Số điện thoại</dt>
                <dd>{patient.phone}</dd>
              </div>
              <div>
                <dt>Ngày sinh</dt>
                <dd>{patient.birthDate}</dd>
              </div>
              <div>
                <dt>Giới tính</dt>
                <dd>{patient.gender}</dd>
              </div>
              <div className="patient-profile-details__full">
                <dt>Địa chỉ</dt>
                <dd>{patient.address}</dd>
              </div>
            </dl>
          )}
        </article>

        <article className="patient-password-card">
          <div className="patient-password-card__header">
            <h2>Đổi mật khẩu</h2>
            <p>Cập nhật mật khẩu để bảo vệ tài khoản</p>
          </div>
          <form
            className="patient-password-form"
            onSubmit={handleSubmitPasswordChange}
          >
            <label>
              <span>Mật khẩu hiện tại</span>
              <input
                name="oldPassword"
                type="password"
                value={passwordForm.oldPassword}
                placeholder="Nhập mật khẩu hiện tại"
                onChange={handlePasswordChange}
                required
              />
            </label>
            <label>
              <span>Mật khẩu mới</span>
              <input
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                minLength={8}
                pattern="^(?=.*[A-Za-z])(?=.*\d).+$"
                placeholder="Nhập mật khẩu mới (ít nhất 8 ký tự, có chữ và số)"
                onChange={handlePasswordChange}
                required
              />
            </label>
            <label>
              <span>Xác nhận mật khẩu mới</span>
              <input
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                placeholder="Nhập lại mật khẩu mới"
                onChange={handlePasswordChange}
                required
              />
            </label>
            {passwordStatus.error && (
              <p className="patient-password-form__message patient-password-form__message--error">
                {passwordStatus.error}
              </p>
            )}
            {passwordStatus.success && (
              <p className="patient-password-form__message patient-password-form__message--success">
                {passwordStatus.success}
              </p>
            )}
            <div className="patient-password-form__actions">
              <button type="submit" disabled={passwordStatus.isLoading}>
                {passwordStatus.isLoading ? "Đang lưu..." : "Lưu mật khẩu"}
              </button>
              <button
                type="button"
                onClick={handleCancelPasswordChange}
                disabled={passwordStatus.isLoading}
              >
                Hủy
              </button>
            </div>
          </form>
        </article>
      </section>
    </PatientPageShell>
  );
}

export default ProfilePage;
