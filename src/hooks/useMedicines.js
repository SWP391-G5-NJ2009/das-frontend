import { useCallback, useEffect, useState } from "react";
import { treatmentService } from "../services/treatment.service";

export function useMedicines(enabled = true) {
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMedicines = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError(null);
    try {
      setMedicines(await treatmentService.getMedicines());
    } catch (requestError) {
      setError(requestError);
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  return { medicines, isLoading, error, refetch: fetchMedicines };
}
