import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import AdminPageShell from "../../admin/AdminPageShell";
import DentistPageShell from "../../dentist/DentistPageShell";
import OwnerPageShell from "../../owner/OwnerPageShell";
import PatientPageShell from "../../patient/PatientPageShell";
import ReceptionistPageShell from "../../receptionist/ReceptionistPageShell";
import { useAuth } from "../../../context/AuthContext";
import { useMyProfile } from "../../../hooks/useMyProfile";
import { authService } from "../../../services/auth.service";
import "./ManageProfilePage.css";

const PROFILE_FIELDS = [
  { name: "fullName", label: "Họ và tên" },
  { name: "birthDate", label: "Ngày sinh", type: "date" },
  { name: "gender", label: "Giới tính", options: ["Male", "Female"] },
  { name: "address", label: "Địa chỉ", wide: true },
];

const OPTION_LABELS = {
  Male: "Nam",
  Female: "Nữ",
};

const EMPTY_PASSWORD_FORM = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function formatValue(value) {
  return value || "Chưa cập nhật";
}

function normalizeGender(value) {
  if (value === "Nam") return "Male";
  if (value === "Nu") return "Female";
  return value || "";
}

function getFieldValue(field, profile) {
  const value = profile?.[field.name];
  return field.name === "gender" ? normalizeGender(value) : value;
}

function getDraft(profile) {
  return Object.fromEntries(
    PROFILE_FIELDS.map((field) => [field.name, getFieldValue(field, profile)]),
  );
}

function RoleShell({ children, role }) {
  if (role === "admin") return <AdminPageShell>{children}</AdminPageShell>;
  if (role === "dentist")
    return <DentistPageShell>{children}</DentistPageShell>;
  if (role === "owner") return <OwnerPageShell>{children}</OwnerPageShell>;
  if (role === "receptionist") {
    return <ReceptionistPageShell>{children}</ReceptionistPageShell>;
  }

  return <PatientPageShell>{children}</PatientPageShell>;
}

RoleShell.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string,
};

RoleShell.defaultProps = {
  role: "patient",
};

function ProfileField({ field, value, onChange }) {
  if (field.options) {
    return (
      <fieldset className="manage-profile__field manage-profile__field--radio">
        <legend>{field.label}</legend>
        <div className="manage-profile__radio-group">
          {field.options.map((option) => (
            <label className="manage-profile__radio" key={option}>
              <input
                checked={value === option}
                name={field.name}
                onChange={onChange}
                type="radio"
                value={option}
              />
              <span>{OPTION_LABELS[option] || option}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  return (
    <label
      className={`manage-profile__field${field.wide ? " manage-profile__field--wide" : ""}`}
    >
      <span>{field.label}</span>
      <input
        name={field.name}
        onChange={onChange}
        type={field.type || "text"}
        value={value}
      />
    </label>
  );
}

ProfileField.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string),
    type: PropTypes.string,
    wide: PropTypes.bool,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

function ManageProfilePage() {
  const { user } = useAuth();
  const { error, isLoading, profile, updateProfile } = useMyProfile();
  const role = profile?.role || user?.role || "patient";
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [status, setStatus] = useState({
    isLoading: false,
    error: "",
    success: "",
  });
  const [passwordForm, setPasswordForm] = useState(EMPTY_PASSWORD_FORM);
  const [passwordStatus, setPasswordStatus] = useState({
    isLoading: false,
    error: "",
    success: "",
  });

  useEffect(() => {
    setDraft(getDraft(profile));
  }, [profile]);

  const startEdit = () => {
    setStatus({ isLoading: false, error: "", success: "" });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(getDraft(profile));
    setStatus({ isLoading: false, error: "", success: "" });
    setIsEditing(false);
  };

  const changeDraft = (event) => {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
    setStatus({ isLoading: false, error: "", success: "" });
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setStatus({ isLoading: true, error: "", success: "" });

    try {
      await updateProfile(draft);
      setIsEditing(false);
      setStatus({
        isLoading: false,
        error: "",
        success: "Cập nhật hồ sơ thành công.",
      });
    } catch (err) {
      setStatus({
        isLoading: false,
        error: err.message || "Không thể cập nhật hồ sơ.",
        success: "",
      });
    }
  };

  const changePasswordForm = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
    setPasswordStatus({ isLoading: false, error: "", success: "" });
  };

  const resetPasswordForm = () => {
    setPasswordForm(EMPTY_PASSWORD_FORM);
    setPasswordStatus({ isLoading: false, error: "", success: "" });
  };

  const savePassword = async (event) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({
        isLoading: false,
        error: "Mật khẩu mới không khớp.",
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
      setPasswordForm(EMPTY_PASSWORD_FORM);
      setPasswordStatus({
        isLoading: false,
        error: "",
        success: "Đổi mật khẩu thành công.",
      });
    } catch (err) {
      setPasswordStatus({
        isLoading: false,
        error: err.message || "Không thể đổi mật khẩu.",
        success: "",
      });
    }
  };

  return (
    <RoleShell role={role}>
      <section
        className="manage-profile"
        aria-labelledby="manage-profile-title"
      >
        <article className="manage-profile__card">
          <div className="manage-profile__card-header">
            <div>
              <h1 id="manage-profile-title">Hồ sơ cá nhân</h1>
              <p>Quản lý thông tin cá nhân</p>
            </div>
            {!isEditing && profile && (
              <button
                className="manage-profile__edit"
                onClick={startEdit}
                type="button"
              >
                Chỉnh sửa
              </button>
            )}
          </div>

          {isLoading && (
            <p className="manage-profile__state">Đang tải hồ sơ...</p>
          )}
          {error && (
            <p className="manage-profile__message manage-profile__message--error">
              {error.message || "Không thể tải hồ sơ."}
            </p>
          )}

          {!isLoading && !error && profile && (
            <>
              {status.error && (
                <p className="manage-profile__message manage-profile__message--error">
                  {status.error}
                </p>
              )}
              {status.success && (
                <p className="manage-profile__message manage-profile__message--success">
                  {status.success}
                </p>
              )}

              {isEditing ? (
                <form className="manage-profile__form" onSubmit={saveProfile}>
                  {PROFILE_FIELDS.map((field) => (
                    <ProfileField
                      field={field}
                      key={field.name}
                      onChange={changeDraft}
                      value={draft[field.name] || ""}
                    />
                  ))}
                  <div className="manage-profile__actions">
                    <button disabled={status.isLoading} type="submit">
                      {status.isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    <button
                      disabled={status.isLoading}
                      onClick={cancelEdit}
                      type="button"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <dl className="manage-profile__details">
                  {PROFILE_FIELDS.map((field) => (
                    <div
                      className={
                        field.wide ? "manage-profile__details-full" : ""
                      }
                      key={field.name}
                    >
                      <dt>{field.label}</dt>
                      <dd>{formatValue(getFieldValue(field, profile))}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </>
          )}
        </article>

        <article className="manage-profile__card">
          <div className="manage-profile__card-header">
            <div>
              <h2>Đổi mật khẩu</h2>
              <p>Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
            </div>
          </div>

          <form
            className="manage-profile__password-form"
            onSubmit={savePassword}
          >
            <label>
              <span>Mật khẩu hiện tại</span>
              <input
                name="oldPassword"
                onChange={changePasswordForm}
                placeholder="Nhập mật khẩu hiện tại"
                required
                type="password"
                value={passwordForm.oldPassword}
              />
            </label>

            <label>
              <span>Mật khẩu mới</span>
              <input
                name="newPassword"
                onChange={changePasswordForm}
                placeholder="Nhập mật khẩu mới"
                required
                type="password"
                value={passwordForm.newPassword}
              />
            </label>

            <label>
              <span>Xác nhận mật khẩu mới</span>
              <input
                name="confirmPassword"
                onChange={changePasswordForm}
                placeholder="Nhập lại mật khẩu mới"
                required
                type="password"
                value={passwordForm.confirmPassword}
              />
            </label>

            {passwordStatus.error && (
              <p className="manage-profile__message manage-profile__message--error">
                {passwordStatus.error}
              </p>
            )}
            {passwordStatus.success && (
              <p className="manage-profile__message manage-profile__message--success">
                {passwordStatus.success}
              </p>
            )}

            <div className="manage-profile__actions manage-profile__actions--password">
              <button disabled={passwordStatus.isLoading} type="submit">
                {passwordStatus.isLoading ? "Đang lưu..." : "Lưu mật khẩu"}
              </button>
              <button
                disabled={passwordStatus.isLoading}
                onClick={resetPasswordForm}
                type="button"
              >
                Hủy
              </button>
            </div>
          </form>
        </article>
      </section>
    </RoleShell>
  );
}

export default ManageProfilePage;
