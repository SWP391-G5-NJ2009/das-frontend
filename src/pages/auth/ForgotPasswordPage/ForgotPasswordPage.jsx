import { useState } from "react";
import PropTypes from "prop-types";
import { ArrowLeft, Eye, EyeOff, Phone, Send, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import heroLogin from "../../../assets/images/hero-login.jpg";
import { authService } from "../../../services/auth.service";
import "./ForgotPasswordPage.css";

const otpSlots = ["otp-1", "otp-2", "otp-3", "otp-4", "otp-5", "otp-6"];

const FORGOT_PASSWORD_CONFIG = {
  patient: {
    IdentifierIcon: Phone,
    identifierLabel: "Số điện thoại",
    identifierPlaceholder: "09xx xxx xxx",
    identifierType: "tel",
    loginPath: "/login",
    requestHelp: "Nhập số điện thoại của bạn để nhận mã OTP",
  },
  staff: {
    IdentifierIcon: UserRound,
    identifierLabel: "Tên đăng nhập",
    identifierPlaceholder: "E.g: admin",
    identifierType: "text",
    loginPath: "/staff/login",
    requestHelp: "Nhập tên đăng nhập của bạn để nhận mã OTP.",
  },
};

const PASSWORD_FIELDS = [
  {
    hideLabel: "Hide new password",
    label: "Mật khẩu mới",
    name: "newPassword",
    placeholder: "Nhập mật khẩu mới",
    showLabel: "Show new password",
  },
  {
    hideLabel: "Hide password confirmation",
    label: "Xác nhận mật khẩu mới",
    name: "confirmPassword",
    placeholder: "Nhập lại mật khẩu mới",
    showLabel: "Show password confirmation",
  },
];

function getOtpValue(formData) {
  return otpSlots.map((slot) => formData.get(slot) || "").join("");
}

function ForgotPasswordPage({ mode = "patient" }) {
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
  const {
    IdentifierIcon,
    identifierLabel,
    identifierPlaceholder,
    identifierType,
    loginPath,
    requestHelp,
  } = FORGOT_PASSWORD_CONFIG[mode];

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
      setError(err.message || "Không thể gửi OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const otp = getOtpValue(formData);
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới không khớp.");
      setIsSubmitting(false);
      return;
    }

    if (!resetAccountId) {
      setError(
        "No password reset session was found. Please request a new OTP.",
      );
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
      setError(err.message || "Không thể đặt lại mật khẩu.");
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
      setError(err.message || "Không thể gửi lại OTP.");
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
      const input = document.querySelector(
        `[name="${otpSlots[index + offset]}"]`,
      );

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
        aria-label="Không gian phòng khám DentalCare"
      >
        <img src={heroLogin} alt="Ghế nha khoa tại phòng khám DentalCare" />
      </section>

      <section
        className="forgot-password__panel"
        aria-labelledby="forgot-password-title"
      >
        <Link className="forgot-password__back" to={loginPath}>
          <ArrowLeft size={18} aria-hidden="true" />
          Trang chủ
        </Link>

        {step === "request" ? (
          <form className="forgot-password__form" onSubmit={handleRequestOtp}>
            <div className="forgot-password__heading">
              <h2 id="forgot-password-title">Quên mật khẩu?</h2>
              <p>{requestHelp}</p>
            </div>

            {error && <p className="forgot-password__error">{error}</p>}

            <label className="forgot-password__field">
              <span>{identifierLabel}</span>
              <div className="forgot-password__control">
                <IdentifierIcon size={18} aria-hidden="true" />
                <input
                  type={identifierType}
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
              {isSubmitting ? "Đang gửi..." : "Gửi OTP"}
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
        ) : (
          <form
            className="forgot-password__form forgot-password__form--reset"
            onSubmit={handleResetPassword}
          >
            <div className="forgot-password__heading">
              <h2 id="forgot-password-title">Xác minh và đặt lại mật khẩu</h2>
              <p>
                Mã OTP đã được tạo cho tài khoản của bạn. Vui lòng nhập mã bên
                dưới.
              </p>
            </div>

            {devOtp && (
              <p className="forgot-password__dev-otp">OTP dev: {devOtp}</p>
            )}
            {error && <p className="forgot-password__error">{error}</p>}

            <div className="forgot-password__otp" aria-label="Nhập OTP">
              {otpSlots.map((slot, index) => (
                <input
                  aria-label="Một chữ số OTP"
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
              Chưa nhận được mã?{" "}
              <button type="button" onClick={handleResendOtp}>
                Gửi lại mã
              </button>
            </p>

            {PASSWORD_FIELDS.map((field) => {
              const isVisible = visiblePasswords[field.name];
              const VisibilityIcon = isVisible ? EyeOff : Eye;

              return (
                <label className="forgot-password__field" key={field.name}>
                  <span>{field.label}</span>
                  <div className="forgot-password__control forgot-password__control--password">
                    <input
                      type={isVisible ? "text" : "password"}
                      name={field.name}
                      placeholder={field.placeholder}
                      required
                    />
                    <button
                      type="button"
                      aria-label={isVisible ? field.hideLabel : field.showLabel}
                      onClick={() => handleTogglePassword(field.name)}
                    >
                      <VisibilityIcon size={16} aria-hidden="true" />
                    </button>
                  </div>
                </label>
              );
            })}

            <button
              className="forgot-password__submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Xác nhận và thay đổi mật khẩu"}
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
