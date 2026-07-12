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
  { name: "fullName", label: "Full name" },
  { name: "birthDate", label: "Date of birth", type: "date" },
  { name: "gender", label: "Gender", options: ["Male", "Female"] },
  { name: "address", label: "Address", wide: true },
];

const EMPTY_PASSWORD_FORM = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function formatValue(value) {
  return value || "Not updated";
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
  if (role === "dentist") return <DentistPageShell>{children}</DentistPageShell>;
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
              <span>{option}</span>
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
        success: "Profile updated successfully.",
      });
    } catch (err) {
      setStatus({
        isLoading: false,
        error: err.message || "Unable to update profile.",
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
        error: "Password confirmation does not match.",
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
        success: "Password changed successfully.",
      });
    } catch (err) {
      setPasswordStatus({
        isLoading: false,
        error: err.message || "Unable to change password.",
        success: "",
      });
    }
  };

  return (
    <RoleShell role={role}>
      <section className="manage-profile" aria-labelledby="manage-profile-title">
        <article className="manage-profile__card">
          <div className="manage-profile__card-header">
            <div>
              <h1 id="manage-profile-title">Personal Profile</h1>
              <p>Manage your personal information</p>
            </div>
            {!isEditing && profile && (
              <button
                className="manage-profile__edit"
                onClick={startEdit}
                type="button"
              >
                Edit
              </button>
            )}
          </div>

          {isLoading && <p className="manage-profile__state">Loading profile...</p>}
          {error && (
            <p className="manage-profile__message manage-profile__message--error">
              {error.message || "Unable to load profile."}
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
                      {status.isLoading ? "Saving..." : "Save changes"}
                    </button>
                    <button
                      disabled={status.isLoading}
                      onClick={cancelEdit}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <dl className="manage-profile__details">
                  {PROFILE_FIELDS.map((field) => (
                    <div
                      className={field.wide ? "manage-profile__details-full" : ""}
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
              <h2>Change password</h2>
              <p>Update your password to protect your account</p>
            </div>
          </div>

          <form className="manage-profile__password-form" onSubmit={savePassword}>
            <label>
              <span>Current password</span>
              <input
                name="oldPassword"
                onChange={changePasswordForm}
                placeholder="Enter current password"
                required
                type="password"
                value={passwordForm.oldPassword}
              />
            </label>

            <label>
              <span>New password</span>
              <input
                minLength={8}
                name="newPassword"
                onChange={changePasswordForm}
                pattern="^(?=.*[A-Za-z])(?=.*\\d).+$"
                placeholder="Enter new password"
                required
                type="password"
                value={passwordForm.newPassword}
              />
            </label>

            <label>
              <span>Confirm new password</span>
              <input
                name="confirmPassword"
                onChange={changePasswordForm}
                placeholder="Re-enter new password"
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
                {passwordStatus.isLoading ? "Saving..." : "Save password"}
              </button>
              <button
                disabled={passwordStatus.isLoading}
                onClick={resetPasswordForm}
                type="button"
              >
                Cancel
              </button>
            </div>
          </form>
        </article>
      </section>
    </RoleShell>
  );
}

export default ManageProfilePage;
