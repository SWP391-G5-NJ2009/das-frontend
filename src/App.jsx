import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminAccountsPage from "./pages/admin/AdminAccountsPage/AdminAccountsPage";
import AppointmentDashboardPage from "./pages/admin/AppointmentDashboardPage/AppointmentDashboardPage";

import ConsultationPage from "./pages/public/ConsultationPage/ConsultationPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage/ForgotPasswordPage";
import LandingPage from "./pages/public/LandingPage/LandingPage";
import ServiceCatalogPage from "./pages/manager/ServiceCatalogPage/ServiceCatalogPage";
import ClinicInfoPage from "./pages/manager/ClinicInfoPage/ClinicInfoPage";
import AppointmentsPage from "./pages/shared/AppointmentsPage/AppointmentsPage";
import BookingPage from "./pages/patient/BookingPage/BookingPage";
import PaymentHistoryPage from "./pages/patient/PaymentHistoryPage/PaymentHistoryPage";
import DentistWaitingPatientsPage from "./pages/dentist/DentistWaitingPatientsPage/DentistWaitingPatientsPage";
import PatientTreatmentHistoryPage from "./pages/dentist/PatientTreatmentHistoryPage/PatientTreatmentHistoryPage";
import PatientLoginPage from "./pages/auth/PatientLoginPage/PatientLoginPage";
import PaymentListPage from "./pages/receptionist/PaymentListPage/PaymentListPage";
import PatientRegistrationPage from "./pages/receptionist/PatientRegistrationPage/PatientRegistrationPage";
import ReceptionistRequestsPage from "./pages/receptionist/RequestsPage/RequestsPage";
import ReceptionistBookAppointmentPage from "./pages/receptionist/BookAppointmentPage/ReceptionistBookAppointmentPage";
import DentistScheduleViewPage from "./pages/receptionist/DentistScheduleViewPage/DentistScheduleViewPage";
import DentistScheduleManagement from "./pages/dentist/ScheduleManagement/DentistScheduleManagement";
import ManageProfilePage from "./pages/shared/ManageProfilePage/ManageProfilePage";
import ScheduleApprovalPage from "./pages/manager/ScheduleApprovalPage/ScheduleApprovalPage";
import RoomsPage from "./pages/manager/RoomsPage/RoomsPage";
import ServicesPage from "./pages/public/ServicesPage/ServicesPage";
import StaffLoginPage from "./pages/auth/StaffLoginPage/StaffLoginPage";
import ManagerStaffPage from "./pages/manager/ManagerStaffPage/ManagerStaffPage";
import ProtectedRoute from "./router/ProtectedRoute";
import RevenuePage from "./pages/manager/RevenuePage/RevenuePage";
import PatientPage from "./pages/manager/PatientPage/PatientPage";

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
                <PatientTreatmentHistoryPage viewer="patient" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/payments"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PaymentHistoryPage />
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
            path="/receptionist/dentist-schedules"
            element={
              <ProtectedRoute allowedRoles={["receptionist"]}>
                <DentistScheduleViewPage />
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
            path="/manager/services-management"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ServiceCatalogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/clinic-info"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ClinicInfoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/clinic-schedule"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ScheduleApprovalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/rooms-management"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <RoomsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/profile"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ManageProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/revenue"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <RevenuePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/patient"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <PatientPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/appointment-dashboard"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
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
            path="/manager/staff"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerStaffPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
