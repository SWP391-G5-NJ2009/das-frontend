import PropTypes from "prop-types";
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import ReceptionistPageShell from "../ReceptionistPageShell";
import { patientService } from "../../../services/patient.service";
import "./PatientRegistrationPage.css";

function generatePassword() {
  return `DP${Math.floor(100000 + Math.random() * 900000)}`;
}

function getInitialForm() {
  return {
    fullName: "",
    phone: "",
    birthDate: "",
    gender: "Male",
    address: "",
    password: generatePassword(),
  };
}

function PatientRegistrationPage() {
  const [form, setForm] = useState(getInitialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const setField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
    setSuccess("");
  };

  const resetForm = () => {
    setForm(getInitialForm());
    setError("");
    setSuccess("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const patient = await patientService.createPatientAccount(form);
      setSuccess(`Registered patient successfully.`);
      setForm(getInitialForm());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReceptionistPageShell
      contentClassName="patient-registration"
      contentLabelledBy="patient-registration-title"
    >
      <header className="patient-registration__header">
        <h1 id="patient-registration-title">Create New Patient Account</h1>
        <p>
          Enter the required details to create a patient account and electronic
          profile.
        </p>
      </header>

      <form className="patient-registration__form" onSubmit={submit}>
        <div className="patient-registration__grid">
          <label className="patient-registration__field">
            <span>
              Full name <strong>*</strong>
            </span>
            <input
              required
              type="text"
              value={form.fullName}
              placeholder="Enter patient full name"
              onChange={(event) => setField("fullName", event.target.value)}
            />
          </label>

          <label className="patient-registration__field">
            <span>
              Phone number <strong>*</strong>
            </span>
            <input
              required
              type="tel"
              value={form.phone}
              placeholder="09x xxx xxxx"
              onChange={(event) => setField("phone", event.target.value)}
            />
          </label>

          <label className="patient-registration__field">
            <span>Date of birth</span>
            <input
              type="date"
              value={form.birthDate}
              onChange={(event) => setField("birthDate", event.target.value)}
            />
          </label>

          <fieldset className="patient-registration__field patient-registration__field--radio">
            <legend>Gender</legend>
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={form.gender === "Male"}
                onChange={(event) => setField("gender", event.target.value)}
              />
              <span>Male</span>
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={form.gender === "Female"}
                onChange={(event) => setField("gender", event.target.value)}
              />
              <span>Female</span>
            </label>
          </fieldset>

          <label className="patient-registration__field patient-registration__field--wide">
            <span>Contact address</span>
            <input
              type="text"
              value={form.address}
              placeholder="House number, street, ward, district, province/city"
              onChange={(event) => setField("address", event.target.value)}
            />
          </label>

          <div className="patient-registration__field patient-registration__field--password">
            <label htmlFor="patient-registration-password">
              Default password
            </label>
            <div className="patient-registration__password-row">
              <input
                required
                id="patient-registration-password"
                type="text"
                value={form.password}
                onChange={(event) => setField("password", event.target.value)}
              />
              <button
                className="patient-registration__generate"
                type="button"
                onClick={() => setField("password", generatePassword())}
              >
                <RefreshCw size={16} aria-hidden="true" />
                Generate
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p className="patient-registration__message patient-registration__message--error">
            {error}
          </p>
        )}
        {success && (
          <p className="patient-registration__message patient-registration__message--success">
            {success}
          </p>
        )}

        <div className="patient-registration__actions">
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </div>
      </form>
    </ReceptionistPageShell>
  );
}

export default PatientRegistrationPage;
