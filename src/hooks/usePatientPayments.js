import { useCallback, useEffect, useState } from "react";
import { paymentService } from "../services/payment.service";

export function usePatientPayments() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await paymentService.getMyPaymentHistory();
      setPayments(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(requestError);
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, isLoading, error, refetch: fetchPayments };
}
