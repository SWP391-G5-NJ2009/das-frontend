import { useCallback, useEffect, useState } from "react";
import { patientService } from "../services/patient.service";

export function usePatientProfile() {
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await patientService.getMyProfile();
      setPatient(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (payload) => {
    const data = await patientService.updateMyProfile(payload);
    setPatient(data);
    return data;
  }, []);

  return {
    error,
    isLoading,
    patient,
    refetch: fetchProfile,
    updateProfile,
  };
}
