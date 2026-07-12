import { useCallback, useEffect, useState } from "react";
import { clinicService } from "../services/clinic.service";

export function useClinicInfo() {
  const [clinicInfo, setClinicInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClinicInfo = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await clinicService.getInfo();
      setClinicInfo(data || null);
    } catch (err) {
      setError(err);
      setClinicInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClinicInfo();
  }, [fetchClinicInfo]);

  return {
    clinicInfo,
    error,
    isLoading,
    refetch: fetchClinicInfo,
  };
}
