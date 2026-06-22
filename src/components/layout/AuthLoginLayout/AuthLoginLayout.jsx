import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Smile,
} from "lucide-react";
import heroLogin from "../../../assets/images/hero-login.jpg";
import "./AuthLoginLayout.css";

function AuthLoginLayout({
  CredentialIcon,
  credentialLabel,
  credentialName,
  credentialPlaceholder,
  credentialType,
  error,
  forgotPasswordPath,
  isSubmitting,
  onSubmit,
  subtitle,
  title,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <main className="auth-login">
      <section
        className="auth-login__hero"
        aria-label="DentalCare clinic space"
      >
        <img src={heroLogin} alt="Dental chair at DentalCare clinic" />
      </section>

      <section className="auth-login__panel" aria-labelledby="auth-login-title">
        <Link className="auth-login__back" to="/">
          <ArrowLeft size={18} aria-hidden="true" />
          Home
        </Link>

        <form className="auth-login__form" onSubmit={onSubmit}>
          <div className="auth-login__brand">
            <Smile size={34} aria-hidden="true" />
            <span>DentalCare</span>
          </div>

          <div className="auth-login__heading">
            <h2 id="auth-login-title">{title}</h2>
            <p>{subtitle}</p>
          </div>

          {error && <p className="auth-login__error">{error}</p>}

          <label className="auth-login__field">
            <span>{credentialLabel}</span>
            <div className="auth-login__control">
              <CredentialIcon size={20} aria-hidden="true" />
              <input
                type={credentialType}
                name={credentialName}
                placeholder={credentialPlaceholder}
                required
              />
            </div>
          </label>

          <label className="auth-login__field">
            <span>Password</span>
            <div className="auth-login__control">
              <LockKeyhole size={20} aria-hidden="true" />
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                aria-label={
                  isPasswordVisible ? "Hide password" : "Show password"
                }
                onClick={() => setIsPasswordVisible((current) => !current)}
              >
                {isPasswordVisible ? (
                  <EyeOff size={20} aria-hidden="true" />
                ) : (
                  <Eye size={20} aria-hidden="true" />
                )}
              </button>
            </div>
          </label>

          <Link className="auth-login__forgot" to={forgotPasswordPath}>
            Forgot password?
          </Link>

          <button
            className="auth-login__submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </form>
      </section>
    </main>
  );
}

AuthLoginLayout.propTypes = {
  CredentialIcon: PropTypes.elementType.isRequired,
  credentialLabel: PropTypes.string.isRequired,
  credentialName: PropTypes.string.isRequired,
  credentialPlaceholder: PropTypes.string.isRequired,
  credentialType: PropTypes.string.isRequired,
  error: PropTypes.string,
  forgotPasswordPath: PropTypes.string,
  isSubmitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  subtitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

AuthLoginLayout.defaultProps = {
  error: null,
  forgotPasswordPath: "/forgot-password",
  isSubmitting: false,
};

export default AuthLoginLayout;
