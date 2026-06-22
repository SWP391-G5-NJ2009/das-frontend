import { useCallback, useEffect, useState } from "react";
import { patientService } from "../services/patient.service";

export function usePatientTreatments() {
  const [treatments, setTreatments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTreatments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await patientService.getMyTreatmentHistory();
      setTreatments(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTreatments();
  }, [fetchTreatments]);

  return {
    error,
    isLoading,
    refetch: fetchTreatments,
    treatments,
  };
}
