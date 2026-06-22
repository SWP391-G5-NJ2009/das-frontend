import { useState } from "react";
import { Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthLoginLayout from "../../../components/layout/AuthLoginLayout/AuthLoginLayout";
import { ROLE_HOME, useAuth } from "../../../context/AuthContext";

function PatientLoginPage() {
  const { loginPatient } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const user = await loginPatient({
        phone: formData.get("phone"),
        password: formData.get("password"),
      });
      navigate(ROLE_HOME[user.role] || "/patient/profile", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLoginLayout
      title="Welcome back"
      subtitle="Please log in to manage your profile."
      credentialLabel="Phone number"
      credentialName="phone"
      credentialType="tel"
      credentialPlaceholder="Enter phone number"
      CredentialIcon={Phone}
      error={error}
      forgotPasswordPath="/forgot-password"
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
}

export default PatientLoginPage;
