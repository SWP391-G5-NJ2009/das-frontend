import { api } from "./api";

export const paymentService = {
  getAllPayments: () => api.get("/payments"),
  getInvoiceDetail: (invoiceId) => api.get(`/payments/invoices/${invoiceId}`),
  getUnpaidInvoices: () => api.get("/payments/unpaid-invoices"),
  getPaymentDetail: (paymentId) => api.get(`/payments/${paymentId}`),
  payInvoice: (invoiceId, paymentMethod) => api.post(`/payments/invoices/${invoiceId}/pay`, { paymentMethod }),
};
