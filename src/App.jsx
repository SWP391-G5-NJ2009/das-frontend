import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminAccountsPage from "./pages/admin/AdminAccountsPage/AdminAccountsPage";
import ConsultationPage from "./pages/public/ConsultationPage/ConsultationPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage/ForgotPasswordPage";
import LandingPage from "./pages/public/LandingPage/LandingPage";
import ServiceCatalogPage from "./pages/owner/ServiceCatalogPage/ServiceCatalogPage";
import AppointmentsPage from "./pages/patient/AppointmentsPage/AppointmentsPage";
import BookingPage from "./pages/patient/BookingPage/BookingPage";
import HistoryPage from "./pages/patient/HistoryPage/HistoryPage";
import PatientLoginPage from "./pages/auth/PatientLoginPage/PatientLoginPage";
import ProfilePage from "./pages/patient/ProfilePage/ProfilePage";
import PaymentListPage from "./pages/receptionist/PaymentListPage/PaymentListPage";
import ReceptionistRequestsPage from "./pages/receptionist/RequestsPage/RequestsPage";
import RoleDashboardPage from "./pages/shared/RoleDashboardPage/RoleDashboardPage";
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
          <Route path="/login" element={<PatientLoginPage />} />
          <Route path="/staff/login" element={<StaffLoginPage />} />
          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <ProfilePage />
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
            path="/receptionist/dashboard"
            element={
              <ProtectedRoute allowedRoles={["receptionist"]}>
                <RoleDashboardPage title="Bảng điều khiển lễ tân" />
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
            path="/payments"
            element={
              <ProtectedRoute allowedRoles={["receptionist"]}>
                <PaymentListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dentist/dashboard"
            element={
              <ProtectedRoute allowedRoles={["dentist"]}>
                <RoleDashboardPage title="Bảng điều khiển bác sĩ" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <RoleDashboardPage title="Bảng điều khiển chủ phòng khám" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/services"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <ServiceCatalogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <RoleDashboardPage title="Bảng điều khiển quản trị" />
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
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
