import { CalendarClock, Clock3, Stethoscope, X } from "lucide-react";
import PatientPageShell from "../PatientPageShell";
import { upcomingAppointments } from "../patientData";

function AppointmentsPage() {
  return (
    <PatientPageShell>
      <section className="patient-appointments-section" aria-labelledby="patient-appointments-title">
        <article className="patient-appointments-card">
          <div className="patient-appointments-card__header">
            <h1 id="patient-appointments-title">Quản lý lịch hẹn</h1>
            <p>Xem, thay đổi hoặc hủy các lịch hẹn sắp tới</p>
          </div>
          <div className="patient-appointments-list">
            {upcomingAppointments.map((appointment) => (
              <article className="patient-appointment-item" key={appointment.id}>
                <div className="patient-appointment-item__content">
                  <div className="patient-appointment-item__title">
                    <h2>{appointment.service}</h2>
                    <span>Sắp tới</span>
                  </div>
                  <p>
                    <Stethoscope size={16} aria-hidden="true" />
                    {appointment.dentist}
                  </p>
                  <div className="patient-appointment-item__meta">
                    <span>
                      <CalendarClock size={16} aria-hidden="true" />
                      {appointment.date}
                    </span>
                    <span>
                      <Clock3 size={16} aria-hidden="true" />
                      {appointment.time}
                    </span>
                  </div>
                </div>
                <div className="patient-appointment-item__actions">
                  <button type="button">Đổi lịch</button>
                  <button type="button" aria-label={`Hủy ${appointment.service}`}>
                    <X size={18} aria-hidden="true" />
                    <span>Hủy</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>
    </PatientPageShell>
  );
}

export default AppointmentsPage;
