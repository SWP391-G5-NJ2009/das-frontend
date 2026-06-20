import { useEffect, useState } from "react";
import { usePatientProfile } from "../../../hooks/usePatientProfile";
import { authService } from "../../../services/auth.service";
import PatientPageShell from "../PatientPageShell";
import "./ProfilePage.css";

const emptyPatient = {
  fullName: "",
  email: "",
  phone: "",
  birthDate: "",
  gender: "",
  address: "",
  medicalHistory: "",
};

function formatValue(value) {
  return value || "Chưa cập nhật";
}

function ProfilePage() {
  const {
    error: profileError,
    isLoading,
    patient,
    updateProfile,
  } = usePatientProfile();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [draftPatient, setDraftPatient] = useState(emptyPatient);
  const [profileStatus, setProfileStatus] = useState({
    isLoading: false,
    error: "",
    success: "",
  });
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

  useEffect(() => {
    if (patient) {
      setDraftPatient({
        fullName: patient.fullName || "",
        email: patient.email || "",
        phone: patient.phone || "",
        birthDate: patient.birthDate || "",
        gender: patient.gender || "",
        address: patient.address || "",
        medicalHistory: patient.medicalHistory || "",
      });
    }
  }, [patient]);

  const handleEditProfile = () => {
    setProfileStatus({ isLoading: false, error: "", success: "" });
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    if (patient) {
      setDraftPatient({
        fullName: patient.fullName || "",
        email: patient.email || "",
        phone: patient.phone || "",
        birthDate: patient.birthDate || "",
        gender: patient.gender || "",
        address: patient.address || "",
        medicalHistory: patient.medicalHistory || "",
      });
    }
    setProfileStatus({ isLoading: false, error: "", success: "" });
    setIsEditingProfile(false);
  };

  const handleSaveProfile = async () => {
    setProfileStatus({ isLoading: true, error: "", success: "" });

    try {
      await updateProfile(draftPatient);
      setIsEditingProfile(false);
      setProfileStatus({
        isLoading: false,
        error: "",
        success: "Cập nhật hồ sơ thành công.",
      });
    } catch (error) {
      setProfileStatus({
        isLoading: false,
        error: error.message || "Không thể cập nhật hồ sơ. Vui lòng thử lại.",
        success: "",
      });
    }
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setDraftPatient((current) => ({ ...current, [name]: value }));
    setProfileStatus({ isLoading: false, error: "", success: "" });
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
            {!isEditingProfile && patient && (
              <button
                className="patient-profile-card__edit"
                type="button"
                onClick={handleEditProfile}
              >
                Chỉnh sửa
              </button>
            )}
          </div>

          {isLoading && (
            <p className="patient-profile-card__state">Đang tải hồ sơ...</p>
          )}
          {profileError && (
            <p className="patient-profile-card__state patient-profile-card__state--error">
              {profileError.message || "Không thể tải hồ sơ bệnh nhân."}
            </p>
          )}
          {!isLoading && !profileError && !patient && (
            <p className="patient-profile-card__state">
              Không tìm thấy hồ sơ bệnh nhân.
            </p>
          )}

          {!isLoading && !profileError && patient && (
            <>
              {profileStatus.error && (
                <p className="patient-password-form__message patient-password-form__message--error">
                  {profileStatus.error}
                </p>
              )}
              {profileStatus.success && (
                <p className="patient-password-form__message patient-password-form__message--success">
                  {profileStatus.success}
                </p>
              )}

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
                  <label className="patient-profile-form__field patient-profile-form__field--full">
                    <span>Tiền sử bệnh</span>
                    <input
                      name="medicalHistory"
                      type="text"
                      value={draftPatient.medicalHistory}
                      onChange={handleProfileChange}
                    />
                  </label>
                  <div className="patient-profile-form__actions">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={profileStatus.isLoading}
                    >
                      {profileStatus.isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={profileStatus.isLoading}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <dl className="patient-profile-details">
                  <div>
                    <dt>Họ và tên</dt>
                    <dd>{formatValue(patient.fullName)}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{formatValue(patient.email)}</dd>
                  </div>
                  <div>
                    <dt>Số điện thoại</dt>
                    <dd>{formatValue(patient.phone)}</dd>
                  </div>
                  <div>
                    <dt>Ngày sinh</dt>
                    <dd>{formatValue(patient.birthDate)}</dd>
                  </div>
                  <div>
                    <dt>Giới tính</dt>
                    <dd>{formatValue(patient.gender)}</dd>
                  </div>
                  <div>
                    <dt>Số lần vắng mặt</dt>
                    <dd>{patient.noShowCount ?? 0}</dd>
                  </div>
                  <div className="patient-profile-details__full">
                    <dt>Địa chỉ</dt>
                    <dd>{formatValue(patient.address)}</dd>
                  </div>
                  <div className="patient-profile-details__full">
                    <dt>Tiền sử bệnh</dt>
                    <dd>{formatValue(patient.medicalHistory)}</dd>
                  </div>
                </dl>
              )}
            </>
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
                placeholder="Nhập mật khẩu mới"
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
