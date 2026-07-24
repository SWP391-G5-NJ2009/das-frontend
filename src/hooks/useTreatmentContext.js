import { useCallback, useEffect, useState } from "react";
import { treatmentService } from "../services/treatment.service";

export function useTreatmentContext(appointmentId) {
  const [context, setContext] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isStartingPlan, setIsStartingPlan] = useState(false);

  const fetchContext = useCallback(async () => {
    if (!appointmentId) {
      setContext(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await treatmentService.getContext(appointmentId);
      setContext(data);
    } catch (requestError) {
      setError(requestError);
    } finally {
      setIsLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    fetchContext();
  }, [fetchContext]);

  const startPlan = useCallback(async () => {
    if (!appointmentId) return null;
    setIsStartingPlan(true);
    setError(null);
    try {
      const plan = await treatmentService.startPlan(appointmentId);
      await fetchContext();
      return plan;
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setIsStartingPlan(false);
    }
  }, [appointmentId, fetchContext]);

  return {
    context,
    isLoading,
    error,
    isStartingPlan,
    refetch: fetchContext,
    startPlan,
  };
}
