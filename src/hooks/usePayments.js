import { useEffect, useState } from "react";
import { paymentService } from "../services/payment.service";

function normalizePayments(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.payments)) {
    return data.payments;
  }

  return [];
}

export function usePayments() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPayments() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await paymentService.getAllPayments();

        if (isMounted) {
          setPayments(normalizePayments(data));
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setPayments([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPayments();

    return () => {
      isMounted = false;
    };
  }, []);

  return { payments, isLoading, error };
}
