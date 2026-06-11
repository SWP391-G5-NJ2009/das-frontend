import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReceptionistLayout from "./components/layout/ReceptionistLayout/ReceptionistLayout";
import { AuthProvider } from "./context/AuthContext";
import AdminAccountsPage from "./pages/admin/AdminAccountsPage/AdminAccountsPage";
import ConsultationPage from "./pages/public/ConsultationPage/ConsultationPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage/ForgotPasswordPage";
import LandingPage from "./pages/public/LandingPage/LandingPage";
import OwnerServiceCatalogPage from "./pages/owner/OwnerServiceCatalogPage/OwnerServiceCatalogPage";
import PatientDashboardPage from "./pages/patient/PatientDashboardPage/PatientDashboardPage";
import PatientLoginPage from "./pages/auth/PatientLoginPage/PatientLoginPage";
import PaymentListPage from "./pages/receptionist/PaymentListPage/PaymentListPage";
import ReceptionistDashboardPage from "./pages/receptionist/ReceptionistDashboardPage/ReceptionistDashboardPage";
import ReceptionistRequestsPage from "./pages/receptionist/ReceptionistRequestsPage/ReceptionistRequestsPage";
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
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            element={
              <ProtectedRoute allowedRoles={["receptionist"]}>
                <ReceptionistLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/receptionist/dashboard" element={<ReceptionistDashboardPage />} />
            <Route
              path="/receptionist/consultation-request"
              element={<ReceptionistRequestsPage />}
            />
            <Route path="/payments" element={<PaymentListPage />} />
          </Route>
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
                <OwnerServiceCatalogPage />
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
