import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReceptionistLayout from "./components/ReceptionistLayout/ReceptionistLayout";
import { AuthProvider } from "./context/AuthContext";
import AdminAccountsPage from "./pages/AdminAccountsPage/AdminAccountsPage";
import ConsultationPage from "./pages/ConsultationPage/ConsultationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import OwnerServiceCatalogPage from "./pages/OwnerServiceCatalogPage/OwnerServiceCatalogPage";
import PatientDashboardPage from "./pages/PatientDashboardPage/PatientDashboardPage";
import PatientLoginPage from "./pages/PatientLoginPage/PatientLoginPage";
import PaymentListPage from "./pages/PaymentListPage/PaymentListPage";
import ReceptionistDashboardPage from "./pages/ReceptionistDashboardPage/ReceptionistDashboardPage";
import ReceptionistRequestsPage from "./pages/ReceptionistRequestsPage/ReceptionistRequestsPage";
import RoleDashboardPage from "./pages/RoleDashboardPage/RoleDashboardPage";
import ServicesPage from "./pages/ServicesPage/ServicesPage";
import StaffLoginPage from "./pages/StaffLoginPage/StaffLoginPage";
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
