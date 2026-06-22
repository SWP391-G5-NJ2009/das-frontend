import { useState } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthLoginLayout from "../../../components/layout/AuthLoginLayout/AuthLoginLayout";
import { ROLE_HOME, useAuth } from "../../../context/AuthContext";

function StaffLoginPage() {
  const { loginStaff } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const user = await loginStaff({
        username: formData.get("username"),
        password: formData.get("password"),
      });
      navigate(ROLE_HOME[user.role] || "/staff/login", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLoginLayout
      title="Staff login"
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
