import { useState } from "react";
import { ArrowLeft, Eye, Send, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import heroLogin from "../../assets/hero-login.jpg";
import { authService } from "../../services/auth.service";
import "./ForgotPasswordPage.css";

const otpSlots = ["otp-1", "otp-2", "otp-3", "otp-4", "otp-5", "otp-6"];

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("request");
  const [identifier, setIdentifier] = useState("");
  const [devOtp, setDevOtp] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const nextIdentifier = formData.get("identifier");

    try {
      const data = await authService.forgotPassword({ identifier: nextIdentifier });
      setIdentifier(nextIdentifier);
      setDevOtp(data.devOtp || null);
      setStep("reset");
    } catch (err) {
      setError(err.message || "Không thể gửi mã OTP.");
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
      setError("Mật khẩu xác nhận không khớp.");
      setIsSubmitting(false);
      return;
    }

    try {
      await authService.resetPassword({ identifier, otp, newPassword });
      navigate("/login", { replace: true });
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
      const data = await authService.forgotPassword({ identifier });
      setDevOtp(data.devOtp || null);
    } catch (err) {
      setError(err.message || "Không thể gửi lại mã OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="forgot-password">
      <section className="forgot-password__hero" aria-label="Không gian phòng khám DentalCare">
        <img src={heroLogin} alt="Ghế nha khoa tại phòng khám DentalCare" />
      </section>

      <section className="forgot-password__panel" aria-labelledby="forgot-password-title">
        <Link className="forgot-password__back" to="/login">
          <ArrowLeft size={18} aria-hidden="true" />
          Quay lại
        </Link>

        {step === "request" ? (
          <form className="forgot-password__form" onSubmit={handleRequestOtp}>
            <div className="forgot-password__heading">
              <h2 id="forgot-password-title">Quên mật khẩu?</h2>
              <p>
                Vui lòng nhập tên đăng nhập hoặc số điện thoại để nhận mã xác
                thực OTP.
              </p>
            </div>

            {error && <p className="forgot-password__error">{error}</p>}

            <label className="forgot-password__field">
              <span>Tên đăng nhập / Số điện thoại</span>
              <div className="forgot-password__control">
                <UserRound size={18} aria-hidden="true" />
                <input
                  type="text"
                  name="identifier"
                  placeholder="Nhập ID hoặc số điện thoại..."
                  required
                />
              </div>
            </label>

            <button className="forgot-password__submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang gửi..." : "Gửi mã OTP"}
              <Send size={18} aria-hidden="true" />
            </button>

            <p className="forgot-password__support">
              Cần hỗ trợ? <a href="mailto:it@dentalcare.vn">Liên hệ bộ phận IT</a>
            </p>
          </form>
        ) : (
          <form className="forgot-password__form forgot-password__form--reset" onSubmit={handleResetPassword}>
            <div className="forgot-password__heading">
              <h2 id="forgot-password-title">Xác thực & Đặt lại mật khẩu</h2>
              <p>
                Mã OTP đã được tạo cho tài khoản của bạn. Vui lòng nhập mã bên
                dưới.
              </p>
            </div>

            {devOtp && <p className="forgot-password__dev-otp">Mã OTP dev: {devOtp}</p>}
            {error && <p className="forgot-password__error">{error}</p>}

            <div className="forgot-password__otp" aria-label="Nhập mã OTP">
              {otpSlots.map((slot) => (
                <input
                  aria-label="Một chữ số OTP"
                  inputMode="numeric"
                  key={slot}
                  maxLength="1"
                  name={slot}
                  type="text"
                  required
                />
              ))}
            </div>

            <p className="forgot-password__resend">
              Chưa nhận được mã? <button type="button" onClick={handleResendOtp}>Gửi lại mã</button>
            </p>

            <label className="forgot-password__field">
              <span>Mật khẩu mới</span>
              <div className="forgot-password__control forgot-password__control--password">
                <input type="password" name="newPassword" placeholder="Nhập mật khẩu mới" required />
                <button type="button" aria-label="Hiện mật khẩu mới">
                  <Eye size={16} aria-hidden="true" />
                </button>
              </div>
            </label>

            <label className="forgot-password__field">
              <span>Xác nhận mật khẩu mới</span>
              <div className="forgot-password__control forgot-password__control--password">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu mới"
                  required
                />
                <button type="button" aria-label="Hiện xác nhận mật khẩu mới">
                  <Eye size={16} aria-hidden="true" />
                </button>
              </div>
            </label>

            <button className="forgot-password__submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Xác nhận & Đổi mật khẩu"}
            </button>

            <Link className="forgot-password__login-link" to="/login">
              Quay lại trang Đăng nhập
            </Link>
          </form>
        )}
      </section>
    </main>
  );
}

export default ForgotPasswordPage;
