import { User } from "lucide-react";
import AuthLoginLayout from "../../../components/layout/AuthLoginLayout/AuthLoginLayout";
import { useAuth } from "../../../context/AuthContext";
import { useLoginForm } from "../../../hooks/useLoginForm";

function getStaffCredentials(formData) {
  return {
    username: formData.get("username"),
    password: formData.get("password"),
  };
}

function StaffLoginPage() {
  const { loginStaff } = useAuth();
  const { error, handleSubmit, isSubmitting } = useLoginForm({
    fallbackPath: "/staff/login",
    getCredentials: getStaffCredentials,
    login: loginStaff,
  });

  return (
    <AuthLoginLayout
      title="Đăng nhập nhân viên"
      subtitle="Please log in with your internal account."
      credentialLabel="Username"
      credentialName="username"
      credentialType="text"
      credentialPlaceholder="Enter username"
      CredentialIcon={User}
      error={error}
      forgotPasswordPath="/staff/forgot-password"
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  );
}

export default StaffLoginPage;
