import { useState } from "react";
import PropTypes from "prop-types";
import { ArrowLeft, Eye, EyeOff, Phone, Send, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import heroLogin from "../../../assets/images/hero-login.jpg";
import { authService } from "../../../services/auth.service";
import "./ForgotPasswordPage.css";

const otpSlots = ["otp-1", "otp-2", "otp-3", "otp-4", "otp-5", "otp-6"];

function ForgotPasswordPage({ mode }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("request");
  const [identifier, setIdentifier] = useState("");
  const [resetAccountId, setResetAccountId] = useState(null);
  const [devOtp, setDevOtp] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const isStaffMode = mode === "staff";
  const loginPath = isStaffMode ? "/staff/login" : "/login";
  const identifierLabel = isStaffMode ? "Username" : "Phone number";
  const identifierPlaceholder = isStaffMode
    ? "Enter your staff username"
    : "Enter phone number";
  const IdentifierIcon = isStaffMode ? UserRound : Phone;

  const focusOtpSlot = (index) => {
    const nextInput = document.querySelector(`[name="${otpSlots[index]}"]`);
    nextInput?.focus();
  };

  const requestOtp = (nextIdentifier) => {
    if (isStaffMode) {
      return authService.staffForgotPassword({ username: nextIdentifier });
    }

    return authService.forgotPassword({ identifier: nextIdentifier });
  };

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const nextIdentifier = formData.get("identifier");

    try {
      const data = await requestOtp(nextIdentifier);
      setIdentifier(nextIdentifier);
      setResetAccountId(data.accountId);
      setDevOtp(data.devOtp || null);
      setStep("reset");
    } catch (err) {
      setError(err.message || "Unable to send OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const otp = otpSlots.map((slot) => formData.get(slot) || "").join("");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      setError("Password confirmation does not match.");
      setIsSubmitting(false);
      return;
    }

    if (!resetAccountId) {
      setError("No password reset session was found. Please request a new OTP.");
      setIsSubmitting(false);
      return;
    }

    try {
      await authService.resetPassword({
        accountId: resetAccountId,
        otp,
        newPassword,
      });
      navigate(loginPath, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!identifier) return;
    setError(null);
    setIsSubmitting(true);

    try {
      const data = await requestOtp(identifier);
      setResetAccountId(data.accountId);
      setDevOtp(data.devOtp || null);
    } catch (err) {
      setError(err.message || "Unable to resend OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpInput = (event, index) => {
    const input = event.currentTarget;
    const digit = input.value.replace(/\D/g, "").slice(-1);
    input.value = digit;

    if (digit && index < otpSlots.length - 1) {
      focusOtpSlot(index + 1);
    }
  };

  const handleOtpKeyDown = (event, index) => {
    if (event.key === "Backspace" && !event.currentTarget.value && index > 0) {
      focusOtpSlot(index - 1);
    }
  };

  const handleOtpPaste = (event, index) => {
    event.preventDefault();

    const digits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, otpSlots.length - index)
      .split("");

    digits.forEach((digit, offset) => {
      const input = document.querySelector(`[name="${otpSlots[index + offset]}"]`);

      if (input) {
        input.value = digit;
      }
    });

    const nextIndex = Math.min(index + digits.length, otpSlots.length - 1);
    focusOtpSlot(nextIndex);
  };

  const handleTogglePassword = (field) => {
    setVisiblePasswords((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  return (
    <main className="forgot-password">
      <section
        className="forgot-password__hero"
        aria-label="DentalCare clinic space"
      >
        <img src={heroLogin} alt="Dental chair at DentalCare clinic" />
      </section>

      <section
        className="forgot-password__panel"
        aria-labelledby="forgot-password-title"
      >
        <Link className="forgot-password__back" to={loginPath}>
          <ArrowLeft size={18} aria-hidden="true" />
          Back
        </Link>

        {step === "request" ? (
          <form className="forgot-password__form" onSubmit={handleRequestOtp}>
            <div className="forgot-password__heading">
              <h2 id="forgot-password-title">Forgot password?</h2>
              <p>
                {isStaffMode
                  ? "Enter your username to receive an OTP on the phone number linked to your staff account."
                  : "Enter your phone number to receive an OTP."}
              </p>
            </div>

            {error && <p className="forgot-password__error">{error}</p>}

            <label className="forgot-password__field">
              <span>{identifierLabel}</span>
              <div className="forgot-password__control">
                <IdentifierIcon size={18} aria-hidden="true" />
                <input
                  type={isStaffMode ? "text" : "tel"}
                  name="identifier"
                  placeholder={identifierPlaceholder}
                  required
                />
              </div>
            </label>

            <button
              className="forgot-password__submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send OTP"}
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
        ) : (
          <form
            className="forgot-password__form forgot-password__form--reset"
            onSubmit={handleResetPassword}
          >
            <div className="forgot-password__heading">
              <h2 id="forgot-password-title">Verify and reset password</h2>
              <p>
                An OTP has been created for your account. Please enter the code
                below.
              </p>
            </div>

            {devOtp && (
              <p className="forgot-password__dev-otp">Dev OTP: {devOtp}</p>
            )}
            {error && <p className="forgot-password__error">{error}</p>}

            <div className="forgot-password__otp" aria-label="Enter OTP">
              {otpSlots.map((slot, index) => (
                <input
                  aria-label="One OTP digit"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  inputMode="numeric"
                  key={slot}
                  maxLength="1"
                  name={slot}
                  onInput={(event) => handleOtpInput(event, index)}
                  onKeyDown={(event) => handleOtpKeyDown(event, index)}
                  onPaste={(event) => handleOtpPaste(event, index)}
                  type="text"
                  required
                />
              ))}
            </div>

            <p className="forgot-password__resend">
              Did not receive the code?{" "}
              <button type="button" onClick={handleResendOtp}>
                Resend code
              </button>
            </p>

            <label className="forgot-password__field">
              <span>New password</span>
              <div className="forgot-password__control forgot-password__control--password">
                <input
                  type={visiblePasswords.newPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  aria-label={
                    visiblePasswords.newPassword
                      ? "Hide new password"
                      : "Show new password"
                  }
                  onClick={() => handleTogglePassword("newPassword")}
                >
                  {visiblePasswords.newPassword ? (
                    <EyeOff size={16} aria-hidden="true" />
                  ) : (
                    <Eye size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            </label>

            <label className="forgot-password__field">
              <span>Confirm new password</span>
              <div className="forgot-password__control forgot-password__control--password">
                <input
                  type={visiblePasswords.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter new password"
                  required
                />
                <button
                  type="button"
                  aria-label={
                    visiblePasswords.confirmPassword
                      ? "Hide password confirmation"
                      : "Show password confirmation"
                  }
                  onClick={() => handleTogglePassword("confirmPassword")}
                >
                  {visiblePasswords.confirmPassword ? (
                    <EyeOff size={16} aria-hidden="true" />
                  ) : (
                    <Eye size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            </label>

            <button
              className="forgot-password__submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Confirm and change password"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

ForgotPasswordPage.propTypes = {
  mode: PropTypes.oneOf(["patient", "staff"]),
};

ForgotPasswordPage.defaultProps = {
  mode: "patient",
};

export default ForgotPasswordPage;
