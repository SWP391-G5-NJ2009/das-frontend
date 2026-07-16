import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminAccountsPage from "./pages/admin/AdminAccountsPage/AdminAccountsPage";
import AppointmentDashboardPage from "./pages/admin/AppointmentDashboardPage/AppointmentDashboardPage";

import ConsultationPage from "./pages/public/ConsultationPage/ConsultationPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage/ForgotPasswordPage";
import LandingPage from "./pages/public/LandingPage/LandingPage";
import ServiceCatalogPage from "./pages/owner/ServiceCatalogPage/ServiceCatalogPage";
import ClinicInfoPage from "./pages/owner/ClinicInfoPage/ClinicInfoPage";
import AppointmentsPage from "./pages/shared/AppointmentsPage/AppointmentsPage";
import BookingPage from "./pages/patient/BookingPage/BookingPage";
import DentistWaitingPatientsPage from "./pages/dentist/DentistWaitingPatientsPage/DentistWaitingPatientsPage";
import PatientTreatmentHistoryPage from "./pages/dentist/PatientTreatmentHistoryPage/PatientTreatmentHistoryPage";
import HistoryPage from "./pages/patient/HistoryPage/HistoryPage";
import PatientLoginPage from "./pages/auth/PatientLoginPage/PatientLoginPage";
import PaymentListPage from "./pages/receptionist/PaymentListPage/PaymentListPage";
import PatientRegistrationPage from "./pages/receptionist/PatientRegistrationPage/PatientRegistrationPage";
import ReceptionistRequestsPage from "./pages/receptionist/RequestsPage/RequestsPage";
import ReceptionistBookAppointmentPage from "./pages/receptionist/BookAppointmentPage/ReceptionistBookAppointmentPage";
import DentistScheduleManagement from "./pages/dentist/ScheduleManagement/DentistScheduleManagement";
import ManageProfilePage from "./pages/shared/ManageProfilePage/ManageProfilePage";
import ScheduleApprovalPage from "./pages/owner/ScheduleApprovalPage/ScheduleApprovalPage";
import RoomsPage from "./pages/shared/RoomsPage/RoomsPage";
import ServicesPage from "./pages/public/ServicesPage/ServicesPage";
import StaffLoginPage from "./pages/auth/StaffLoginPage/StaffLoginPage";
import OwnerStaffPage from "./pages/owner/OwnerStaffPage/OwnerStaffPage";
import ProtectedRoute from "./router/ProtectedRoute";
import RevenuePage from "./pages/owner/RevenuePage/RevenuePage";
import PatientPage from "./pages/owner/PatientPage/PatientPage";

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
            path="/receptionist/rooms"
            element={
              <ProtectedRoute allowedRoles={["receptionist"]}>
                <RoomsPage />
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
            path="/dentist/patients/:patientId/treatment-history"
            element={
              <ProtectedRoute allowedRoles={["dentist"]}>
                <PatientTreatmentHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dentist/schedule"
            element={
              <ProtectedRoute allowedRoles={["dentist"]}>
                <DentistScheduleManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dentist/appointments"
            element={
              <ProtectedRoute allowedRoles={["dentist"]}>
                <AppointmentsPage />
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
            path="/owner/clinic-info"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <ClinicInfoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/rooms-management"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <RoomsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/clinic-schedule"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <ScheduleApprovalPage />
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
            path="/owner/revenue"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <RevenuePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/patient"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <PatientPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/appointment-dashboard"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <AppointmentDashboardPage />
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
          <Route
            path="/owner/staff"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerStaffPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
