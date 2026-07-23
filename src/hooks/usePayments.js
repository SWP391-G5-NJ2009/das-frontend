import { useCallback, useEffect, useMemo, useState } from "react";
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

  const invoices = useMemo(
    () => [...payments, ...unpaidInvoices].sort(
      (first, second) => Number(second.invoice_id) - Number(first.invoice_id),
    ),
    [payments, unpaidInvoices],
  );

  return {
    payments,
    unpaidInvoices,
    invoices,
    isLoading,
    error,
    refetch: fetchPayments,
  };
}
