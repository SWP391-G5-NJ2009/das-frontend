import { Phone } from "lucide-react";
import AuthLoginLayout from "../../../components/layout/AuthLoginLayout/AuthLoginLayout";
import { useAuth } from "../../../context/AuthContext";
import { useLoginForm } from "../../../hooks/useLoginForm";

function getPatientCredentials(formData) {
  return {
    phone: formData.get("phone"),
    password: formData.get("password"),
  };
}

function PatientLoginPage() {
  const { loginPatient } = useAuth();
  const { error, handleSubmit, isSubmitting } = useLoginForm({
    fallbackPath: "/patient/profile",
    getCredentials: getPatientCredentials,
    login: loginPatient,
  });

  return (
    <AuthLoginLayout
      title="Chào mừng trở lại"
      subtitle="Hãy đăng nhập để quản lí hồ sơ cá nhân của bạn."
      credentialLabel="Số điện thoại"
      credentialName="phone"
      credentialType="tel"
      credentialPlaceholder="09xx xxx xxx"
      CredentialIcon={Phone}
      error={error}
      forgotPasswordPath="/forgot-password"
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
}

export default PatientLoginPage;
