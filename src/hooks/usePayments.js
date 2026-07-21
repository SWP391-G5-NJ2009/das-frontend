import { useCallback, useEffect, useState } from "react";
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
  const [unpaidInvoices, setUnpaidInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [data, unpaidData] = await Promise.all([
        paymentService.getAllPayments(),
        paymentService.getUnpaidInvoices(),
      ]);
      setPayments(normalizePayments(data));
      setUnpaidInvoices(normalizePayments(unpaidData));
    } catch (err) {
      setError(err);
      setPayments([]);
      setUnpaidInvoices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  return { payments, unpaidInvoices, isLoading, error, refetch: fetchPayments };
}
