import ManagerPageShell from "../ManagerPageShell";
import NewPatientCount from "./NewPatient";
import NoShowRate from "./NoShowRate";
import ReturningPatientCount from "./ReturningPatient";
import MonthlyNewPatientCount from "./MonthlyNewPatient";
import MonthlyReturningPatientCount from "./MonthlyReturningPatient";
import MonthlyNoShowRate from "./MonthlyNoShowRate";
import "./PatientPage.css";

function RevenuePage() {
  

  return (
    <ManagerPageShell>
      <div className="patient-page__header">
        <div className="patient-page__heading">
          <h1 className="patient-page__title">Thống kê bệnh nhân</h1>
          <p className="patient-page__subtitle">
            Tổng quan bệnh nhân của phòng khám.
          </p>
        </div>
      </div>

      <div className="patient-page__cards">
        <NewPatientCount/>
        <ReturningPatientCount/>
        <NoShowRate/>
      </div>
      <div className="patient-page__monthly">
        <MonthlyNewPatientCount/>
        <MonthlyReturningPatientCount/>
        <MonthlyNoShowRate/>
      </div>
    </ManagerPageShell>
  );
}

RevenuePage.propTypes = {};

export default RevenuePage;
