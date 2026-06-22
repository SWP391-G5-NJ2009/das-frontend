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
  return value || "Not updated";
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
        success: "Profile updated successfully.",
      });
    } catch (error) {
      setProfileStatus({
        isLoading: false,
        error: error.message || "Unable to update profile. Please try again.",
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

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordStatus({
        isLoading: false,
        error: "",
        success: "Password changed successfully.",
      });
    } catch (error) {
      setPasswordStatus({
        isLoading: false,
        error: error.message || "Unable to change password. Please try again.",
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
              <h1 id="patient-profile-title">Personal Profile</h1>
              <p>Manage your personal information</p>
            </div>
            {!isEditingProfile && patient && (
              <button
                className="patient-profile-card__edit"
                type="button"
                onClick={handleEditProfile}
              >
                Edit
              </button>
            )}
          </div>

          {isLoading && (
            <p className="patient-profile-card__state">Loading profile...</p>
          )}
          {profileError && (
            <p className="patient-profile-card__state patient-profile-card__state--error">
              {profileError.message || "Unable to load patient profile."}
            </p>
          )}
          {!isLoading && !profileError && !patient && (
            <p className="patient-profile-card__state">
              Patient profile not found.
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
                    <span>Full name</span>
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
                    <span>Phone number</span>
                    <input
                      name="phone"
                      type="tel"
                      value={draftPatient.phone}
                      onChange={handleProfileChange}
                    />
                  </label>
                  <label className="patient-profile-form__field">
                    <span>Date of birth</span>
                    <input
                      name="birthDate"
                      type="date"
                      value={draftPatient.birthDate}
                      onChange={handleProfileChange}
                    />
                  </label>
                  <label className="patient-profile-form__field">
                    <span>Gender</span>
                    <input
                      name="gender"
                      type="text"
                      value={draftPatient.gender}
                      onChange={handleProfileChange}
                    />
                  </label>
                  <label className="patient-profile-form__field patient-profile-form__field--full">
                    <span>Address</span>
                    <input
                      name="address"
                      type="text"
                      value={draftPatient.address}
                      onChange={handleProfileChange}
                    />
                  </label>
                  <label className="patient-profile-form__field patient-profile-form__field--full">
                    <span>Medical history</span>
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
                      {profileStatus.isLoading ? "Saving..." : "Save changes"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={profileStatus.isLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <dl className="patient-profile-details">
                  <div>
                    <dt>Full name</dt>
                    <dd>{formatValue(patient.fullName)}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{formatValue(patient.email)}</dd>
                  </div>
                  <div>
                    <dt>Phone number</dt>
                    <dd>{formatValue(patient.phone)}</dd>
                  </div>
                  <div>
                    <dt>Date of birth</dt>
                    <dd>{formatValue(patient.birthDate)}</dd>
                  </div>
                  <div>
                    <dt>Gender</dt>
                    <dd>{formatValue(patient.gender)}</dd>
                  </div>
                  <div>
                    <dt>No-show count</dt>
                    <dd>{patient.noShowCount ?? 0}</dd>
                  </div>
                  <div className="patient-profile-details__full">
                    <dt>Address</dt>
                    <dd>{formatValue(patient.address)}</dd>
                  </div>
                  <div className="patient-profile-details__full">
                    <dt>Medical history</dt>
                    <dd>{formatValue(patient.medicalHistory)}</dd>
                  </div>
                </dl>
              )}
            </>
          )}
        </article>

        <article className="patient-password-card">
          <div className="patient-password-card__header">
            <h2>Change password</h2>
            <p>Update your password to protect your account</p>
          </div>
          <form
            className="patient-password-form"
            onSubmit={handleSubmitPasswordChange}
          >
            <label>
              <span>Current password</span>
              <input
                name="oldPassword"
                type="password"
                value={passwordForm.oldPassword}
                placeholder="Enter current password"
                onChange={handlePasswordChange}
                required
              />
            </label>
            <label>
              <span>New password</span>
              <input
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                minLength={8}
                pattern="^(?=.*[A-Za-z])(?=.*\d).+$"
                placeholder="Enter new password"
                onChange={handlePasswordChange}
                required
              />
            </label>
            <label>
              <span>Confirm new password</span>
              <input
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                placeholder="Re-enter new password"
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
                {passwordStatus.isLoading ? "Saving..." : "Save password"}
              </button>
              <button
                type="button"
                onClick={handleCancelPasswordChange}
                disabled={passwordStatus.isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </article>
      </section>
    </PatientPageShell>
  );
}

export default ProfilePage;
