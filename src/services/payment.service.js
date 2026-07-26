import { api } from "./api";

export const paymentService = {
  getMyPaymentHistory: () => api.get("/payments/me"),
  getMyPaymentDetail: (paymentId) => api.get(`/payments/me/${paymentId}`),
  getAllPayments: () => api.get("/payments"),
  getInvoiceDetail: (invoiceId) => api.get(`/payments/invoices/${invoiceId}`),
  getUnpaidInvoices: () => api.get("/payments/unpaid-invoices"),
  getPaymentDetail: (paymentId) => api.get(`/payments/${paymentId}`),
  payInvoice: (invoiceId, paymentMethod, paymentDate) =>
    api.post(`/payments/invoices/${invoiceId}/pay`, {
      paymentMethod,
      paymentDate,
    }),
};
