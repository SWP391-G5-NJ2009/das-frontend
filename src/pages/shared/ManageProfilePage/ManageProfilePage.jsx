import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AdminPageShell from "../../admin/AdminPageShell";
import DentistPageShell from "../../dentist/DentistPageShell";
import OwnerPageShell from "../../owner/OwnerPageShell";
import PatientPageShell from "../../patient/PatientPageShell";
import ReceptionistPageShell from "../../receptionist/ReceptionistPageShell";
import { useAuth } from "../../../context/AuthContext";
import { useMyProfile } from "../../../hooks/useMyProfile";
import { authService } from "../../../services/auth.service";
import "./ManageProfilePage.css";

const ROLE_FIELDS = {
  admin: [
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone number", type: "tel" },
  ],
  dentist: [
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone number", type: "tel" },
    { name: "speciality", label: "Speciality" },
    { name: "experience", label: "Experience", multiline: true },
    { name: "avatar", label: "Avatar URL", type: "url" },
  ],
  owner: [
    { name: "fullName", label: "Full name" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone number", type: "tel" },
  ],
  patient: [
    { name: "fullName", label: "Full name" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone number", type: "tel" },
    { name: "birthDate", label: "Date of birth", type: "date" },
    { name: "gender", label: "Gender" },
    { name: "address", label: "Address", multiline: true },
    { name: "medicalHistory", label: "Medical history", multiline: true },
  ],
  receptionist: [
    { name: "fullName", label: "Full name" },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone number", type: "tel" },
    { name: "citizenId", label: "Citizen ID" },
  ],
};

const EMPTY_PASSWORD_FORM = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function formatValue(value) {
  return value || "Not updated";
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

function getDraft(profile, fields) {
  return Object.fromEntries(
    fields.map((field) => [field.name, profile?.[field.name] || ""]),
  );
}

function ManageProfilePage() {
  const { user } = useAuth();
  const { error, isLoading, profile, updateProfile } = useMyProfile();
  const role = profile?.role || user?.role || "patient";
  const fields = ROLE_FIELDS[role] || ROLE_FIELDS.admin;
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

  const resetProfile = () => {
    setDraft(getDraft(profile, fields));
    setProfileStatus({ isLoading: false, error: "", success: "" });
  };

  const changePasswordForm = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
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
        <header className="manage-profile__header">
          <h1 id="manage-profile-title">Manage Profile</h1>
          <p>Keep your account details and password up to date.</p>
        </header>

        <article className="manage-profile__card">
          <div className="manage-profile__card-header">
            <h2>Account information</h2>
          </div>

          {isLoading && <p className="manage-profile__state">Loading profile...</p>}
          {error && (
            <p className="manage-profile__message manage-profile__message--error">
              {error.message || "Unable to load profile."}
            </p>
          )}

          {!isLoading && !error && profile && (
            <>
              <dl className="manage-profile__summary">
                <div>
                  <dt>Username</dt>
                  <dd>{formatValue(profile.username)}</dd>
                </div>
                <div>
                  <dt>Role</dt>
                  <dd>{formatValue(profile.role)}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{formatValue(profile.status)}</dd>
                </div>
              </dl>

              <form className="manage-profile__form" onSubmit={saveProfile}>
                {fields.map((field) => (
                  <label
                    className={`manage-profile__field${field.multiline ? " manage-profile__field--wide" : ""}`}
                    key={field.name}
                  >
                    <span>{field.label}</span>
                    {field.multiline ? (
                      <textarea
                        name={field.name}
                        value={draft[field.name] || ""}
                        onChange={changeDraft}
                      />
                    ) : (
                      <input
                        name={field.name}
                        type={field.type || "text"}
                        value={draft[field.name] || ""}
                        onChange={changeDraft}
                      />
                    )}
                  </label>
                ))}

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

                <div className="manage-profile__actions">
                  <button type="submit" disabled={profileStatus.isLoading}>
                    {profileStatus.isLoading ? "Saving..." : "Save changes"}
                  </button>
                  <button
                    type="button"
                    disabled={profileStatus.isLoading}
                    onClick={resetProfile}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </article>

        <article className="manage-profile__card">
          <div className="manage-profile__card-header">
            <h2>Change password</h2>
          </div>

          <form className="manage-profile__form" onSubmit={savePassword}>
            <label className="manage-profile__field">
              <span>Current password</span>
              <input
                required
                name="oldPassword"
                type="password"
                value={passwordForm.oldPassword}
                onChange={changePasswordForm}
              />
            </label>
            <label className="manage-profile__field">
              <span>New password</span>
              <input
                required
                minLength={8}
                name="newPassword"
                pattern="^(?=.*[A-Za-z])(?=.*\d).+$"
                type="password"
                value={passwordForm.newPassword}
                onChange={changePasswordForm}
              />
            </label>
            <label className="manage-profile__field">
              <span>Confirm new password</span>
              <input
                required
                name="confirmPassword"
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

            <div className="manage-profile__actions">
              <button type="submit" disabled={passwordStatus.isLoading}>
                {passwordStatus.isLoading ? "Saving..." : "Save password"}
              </button>
              <button
                type="button"
                disabled={passwordStatus.isLoading}
                onClick={() => setPasswordForm(EMPTY_PASSWORD_FORM)}
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
