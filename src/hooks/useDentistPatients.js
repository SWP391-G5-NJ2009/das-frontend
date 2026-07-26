import { useCallback, useEffect, useState } from "react";
import { patientService } from "../services/patient.service";

export function useDentistPatients() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await patientService.getMyTreatedPatients();
      setPatients(data || []);
    } catch (requestError) {
      setError(requestError);
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    isLoading,
    error,
    refetch: fetchPatients,
  };
}
