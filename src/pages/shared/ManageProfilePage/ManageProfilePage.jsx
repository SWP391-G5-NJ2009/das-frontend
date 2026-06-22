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

const COMMON_FIELDS = [
  { name: "fullName", label: "Full name" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone number", type: "tel" },
  { name: "birthDate", label: "Date of birth", type: "date" },
  { name: "gender", label: "Gender", options: ["Male", "Female"] },
  { name: "address", label: "Address", wide: true },
];

const ROLE_FIELDS = {
  admin: COMMON_FIELDS,
  dentist: [
    ...COMMON_FIELDS,
    { name: "speciality", label: "Speciality", wide: true },
  ],
  owner: COMMON_FIELDS,
  patient: [
    ...COMMON_FIELDS,
    { name: "noShowCount", label: "No-show count", readOnly: true },
  ],
  receptionist: COMMON_FIELDS,
};

const EMPTY_PASSWORD_FORM = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function formatValue(value) {
  return value === 0 ? "0" : value || "Not updated";
}

function normalizeGender(value) {
  if (value === "Nam") return "Male";
  if (value === "Nữ" || value === "Nu") return "Female";
  return value || "";
}

function getFieldValue(field, profile) {
  const value = profile?.[field.name];
  return field.name === "gender" ? normalizeGender(value) : value;
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

function getEditableFields(fields) {
  return fields.filter((field) => !field.readOnly);
}

function getDraft(profile, fields) {
  return Object.fromEntries(
    getEditableFields(fields).map((field) => [
      field.name,
      getFieldValue(field, profile),
    ]),
  );
}

function ProfileField({ field, value, onChange }) {
  if (field.options) {
    return (
      <fieldset
        className={`manage-profile__field manage-profile__field--radio${field.wide ? " manage-profile__field--wide" : ""}`}
      >
        <legend>{field.label}</legend>
        <div className="manage-profile__radio-group">
          {field.options.map((option) => (
            <label className="manage-profile__radio" key={option}>
              <input
                name={field.name}
                type="radio"
                value={option}
                checked={value === option}
                onChange={onChange}
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
        type={field.type || "text"}
        value={value}
        onChange={onChange}
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
  const fields = ROLE_FIELDS[role] || COMMON_FIELDS;
  const editableFields = getEditableFields(fields);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [profileStatus, setProfileStatus] = useState({
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
    setDraft(getDraft(profile, fields));
  }, [fields, profile]);

  const startEdit = () => {
    setProfileStatus({ isLoading: false, error: "", success: "" });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(getDraft(profile, fields));
    setProfileStatus({ isLoading: false, error: "", success: "" });
    setIsEditing(false);
  };

  const changeDraft = (event) => {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
    setProfileStatus({ isLoading: false, error: "", success: "" });
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setProfileStatus({ isLoading: true, error: "", success: "" });

    try {
      await updateProfile(draft);
      setIsEditing(false);
      setProfileStatus({
        isLoading: false,
        error: "",
        success: "Profile updated successfully.",
      });
    } catch (err) {
      setProfileStatus({
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
                type="button"
                onClick={startEdit}
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
              {profileStatus.error && (
                <p className="manage-profile__message manage-profile__message--error">
                  {profileStatus.error}
                </p>
              )}
              {profileStatus.success && (
                <p className="manage-profile__message manage-profile__message--success">
                  {profileStatus.success}
                </p>
              )}

              {isEditing ? (
                <form className="manage-profile__form" onSubmit={saveProfile}>
                  {editableFields.map((field) => (
                    <ProfileField
                      field={field}
                      key={field.name}
                      value={draft[field.name] || ""}
                      onChange={changeDraft}
                    />
                  ))}
                  <div className="manage-profile__actions">
                    <button type="submit" disabled={profileStatus.isLoading}>
                      {profileStatus.isLoading ? "Saving..." : "Save changes"}
                    </button>
                    <button
                      type="button"
                      disabled={profileStatus.isLoading}
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <dl className="manage-profile__details">
                  {fields.map((field) => (
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
                required
                name="oldPassword"
                placeholder="Enter current password"
                type="password"
                value={passwordForm.oldPassword}
                onChange={changePasswordForm}
              />
            </label>
            <label>
              <span>New password</span>
              <input
                required
                minLength={8}
                name="newPassword"
                pattern="^(?=.*[A-Za-z])(?=.*\d).+$"
                placeholder="Enter new password"
                type="password"
                value={passwordForm.newPassword}
                onChange={changePasswordForm}
              />
            </label>
            <label>
              <span>Confirm new password</span>
              <input
                required
                name="confirmPassword"
                placeholder="Re-enter new password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={changePasswordForm}
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
              <button type="submit" disabled={passwordStatus.isLoading}>
                {passwordStatus.isLoading ? "Saving..." : "Save password"}
              </button>
              <button
                type="button"
                disabled={passwordStatus.isLoading}
                onClick={resetPasswordForm}
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
