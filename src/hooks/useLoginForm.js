import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROLE_HOME } from "../context/AuthContext";

export function useLoginForm({ login, getCredentials, fallbackPath }) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const user = await login(getCredentials(formData));
      navigate(ROLE_HOME[user.role] || fallbackPath, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { error, handleSubmit, isSubmitting };
}
