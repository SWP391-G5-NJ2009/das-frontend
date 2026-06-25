import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminAccountsPage from "./pages/admin/AdminAccountsPage/AdminAccountsPage";
import ConsultationPage from "./pages/public/ConsultationPage/ConsultationPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage/ForgotPasswordPage";
import LandingPage from "./pages/public/LandingPage/LandingPage";
import ServiceCatalogPage from "./pages/owner/ServiceCatalogPage/ServiceCatalogPage";
import AppointmentsPage from "./pages/shared/AppointmentsPage/AppointmentsPage";
import BookingPage from "./pages/patient/BookingPage/BookingPage";
import DentistWaitingPatientsPage from "./pages/dentist/DentistWaitingPatientsPage/DentistWaitingPatientsPage";
import HistoryPage from "./pages/patient/HistoryPage/HistoryPage";
import PatientLoginPage from "./pages/auth/PatientLoginPage/PatientLoginPage";
import PaymentListPage from "./pages/receptionist/PaymentListPage/PaymentListPage";
import PatientRegistrationPage from "./pages/receptionist/PatientRegistrationPage/PatientRegistrationPage";
import ReceptionistRequestsPage from "./pages/receptionist/RequestsPage/RequestsPage";
import ReceptionistBookAppointmentPage from "./pages/receptionist/BookAppointmentPage/ReceptionistBookAppointmentPage";
import ManageProfilePage from "./pages/shared/ManageProfilePage/ManageProfilePage";
import ServicesPage from "./pages/public/ServicesPage/ServicesPage";
import StaffLoginPage from "./pages/auth/StaffLoginPage/StaffLoginPage";
import ProtectedRoute from "./router/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/staff/forgot-password"
            element={<ForgotPasswordPage mode="staff" />}
          />
          <Route path="/login" element={<PatientLoginPage />} />
          <Route path="/staff/login" element={<StaffLoginPage />} />
          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <ManageProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/booking"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/history"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/consultation-request"
            element={
              <ProtectedRoute allowedRoles={["receptionist"]}>
                <ReceptionistRequestsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/appointments"
            element={
              <ProtectedRoute allowedRoles={["receptionist"]}>
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/payments"
            element={
              <ProtectedRoute allowedRoles={["receptionist"]}>
                <PaymentListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/patient-registration"
            element={
              <ProtectedRoute allowedRoles={["receptionist"]}>
                <PatientRegistrationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/book-appointment"
            element={
              <ProtectedRoute allowedRoles={["receptionist"]}>
                <ReceptionistBookAppointmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/profile"
            element={
              <ProtectedRoute allowedRoles={["receptionist"]}>
                <ManageProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dentist/profile"
            element={
              <ProtectedRoute allowedRoles={["dentist"]}>
                <ManageProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dentist/patients"
            element={
              <ProtectedRoute allowedRoles={["dentist"]}>
                <DentistWaitingPatientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/services-management"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <ServiceCatalogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/profile"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <ManageProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/accounts"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminAccountsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
