import { useCallback, useEffect, useState } from "react";
import { patientService } from "../services/patient.service";

export function usePatientTreatments(patientId = null, options = {}) {
  const [treatments, setTreatments] = useState([]);
  const isEnabled = options.enabled ?? true;
  const [isLoading, setIsLoading] = useState(isEnabled);
  const [error, setError] = useState(null);

  const fetchTreatments = useCallback(async () => {
    if (!isEnabled) {
      setTreatments([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = patientId
        ? await patientService.getTreatmentHistory(patientId)
        : await patientService.getMyTreatmentHistory();
      setTreatments(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [isEnabled, patientId]);

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
