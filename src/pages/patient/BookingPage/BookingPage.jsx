import BookAppointmentPage from "../../shared/BookAppointmentPage/BookAppointmentPage";
import PatientPageShell from "../PatientPageShell";

function PatientBookAppointmentPage() {
  return <BookAppointmentPage isReceptionist={false} Shell={PatientPageShell} />;
}

export default PatientBookAppointmentPage;
