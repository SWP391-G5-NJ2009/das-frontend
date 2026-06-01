import { useState } from "react";
import { Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthLoginLayout from "../../components/AuthLoginLayout/AuthLoginLayout";
import { ROLE_HOME, useAuth } from "../../context/AuthContext";

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
      navigate(ROLE_HOME[user.role] || "/patient/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLoginLayout
      title="Chào mừng trở lại"
      subtitle="Vui lòng đăng nhập để quản lý hồ sơ của bạn."
      credentialLabel="Số điện thoại"
      credentialName="phone"
      credentialType="tel"
      credentialPlaceholder="Nhập số điện thoại"
      CredentialIcon={Phone}
      error={error}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
}

export default PatientLoginPage;
