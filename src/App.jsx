import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Spinner from "./components/common/Spinner/Spinner";
import ProtectedRoute from "./router/ProtectedRoute";

const AdminAccountsPage = lazy(() => import("./pages/admin/AdminAccountsPage/AdminAccountsPage"));
const AppointmentDashboardPage = lazy(() =>
  import("./pages/manager/AppointmentDashboardPage/AppointmentDashboardPage"),
);
const ConsultationPage = lazy(() => import("./pages/public/ConsultationPage/ConsultationPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage/ForgotPasswordPage"));
const LandingPage = lazy(() => import("./pages/public/LandingPage/LandingPage"));
const ServiceCatalogPage = lazy(() => import("./pages/manager/ServiceCatalogPage/ServiceCatalogPage"));
const ClinicInfoPage = lazy(() => import("./pages/manager/ClinicInfoPage/ClinicInfoPage"));
const AppointmentsPage = lazy(() => import("./pages/shared/AppointmentsPage/AppointmentsPage"));
const BookingPage = lazy(() => import("./pages/patient/BookingPage/BookingPage"));
const PaymentHistoryPage = lazy(() => import("./pages/patient/PaymentHistoryPage/PaymentHistoryPage"));
const DentistWaitingPatientsPage = lazy(() =>
  import("./pages/dentist/DentistWaitingPatientsPage/DentistWaitingPatientsPage"),
);
const DentistQueuePage = lazy(() => import("./pages/dentist/DentistQueuePage/DentistQueuePage"));
const PatientTreatmentHistoryPage = lazy(() =>
  import("./pages/dentist/PatientTreatmentHistoryPage/PatientTreatmentHistoryPage"),
);
const PatientLoginPage = lazy(() => import("./pages/auth/PatientLoginPage/PatientLoginPage"));
const PaymentListPage = lazy(() => import("./pages/receptionist/PaymentListPage/PaymentListPage"));
const PatientRegistrationPage = lazy(() =>
  import("./pages/receptionist/PatientRegistrationPage/PatientRegistrationPage"),
);
const ReceptionistRequestsPage = lazy(() => import("./pages/receptionist/RequestsPage/RequestsPage"));
const ReceptionistBookAppointmentPage = lazy(() =>
  import("./pages/receptionist/BookAppointmentPage/ReceptionistBookAppointmentPage"),
);
const DentistScheduleViewPage = lazy(() =>
  import("./pages/receptionist/DentistScheduleViewPage/DentistScheduleViewPage"),
);
const ReceptionistQueuePage = lazy(() =>
  import("./pages/receptionist/ReceptionistQueuePage/ReceptionistQueuePage"),
);
const DentistScheduleManagement = lazy(() =>
  import("./pages/dentist/ScheduleManagement/DentistScheduleManagement"),
);
const ManageProfilePage = lazy(() => import("./pages/shared/ManageProfilePage/ManageProfilePage"));
const ScheduleApprovalPage = lazy(() => import("./pages/manager/ScheduleApprovalPage/ScheduleApprovalPage"));
const RoomsPage = lazy(() => import("./pages/manager/RoomsPage/RoomsPage"));
const ServicesPage = lazy(() => import("./pages/public/ServicesPage/ServicesPage"));
const StaffLoginPage = lazy(() => import("./pages/auth/StaffLoginPage/StaffLoginPage"));
const ManagerStaffPage = lazy(() => import("./pages/manager/ManagerStaffPage/ManagerStaffPage"));
const RevenuePage = lazy(() => import("./pages/manager/RevenuePage/RevenuePage"));
const PatientPage = lazy(() => import("./pages/manager/PatientPage/PatientPage"));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Spinner />}>
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
            path="/receptionist/queue"
            element={
              <ProtectedRoute allowedRoles={["receptionist"]}>
                <ReceptionistQueuePage />
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
            path="/dentist/queue"
            element={
              <ProtectedRoute allowedRoles={["dentist"]}>
                <DentistQueuePage />
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
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
