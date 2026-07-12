import OwnerPageShell from "../OwnerPageShell";
import NewPatientCount from "./NewPatient";
import NoShowRate from "./NoShowRate";
import ReturningPatientCount from "./ReturningPatient";
import MonthlyNewPatientCount from "./MonthlyNewPatient";
import MonthlyReturningPatientCount from "./MonthlyReturningPatient";
import MonthlyNoShowRate from "./MonthlyNoShowRate";
import "./PatientPage.css";

function RevenuePage() {
  

  return (
    <OwnerPageShell>
      <div className="patient-page__header">
        <div className="patient-page__heading">
          <h1 className="patient-page__title">Patient Analytics</h1>
          <p className="patient-page__subtitle">
            Clinic's patients overview.
          </p>
        </div>
      </div>

      <div className="patient-page__cards">
        <NewPatientCount/>
        <ReturningPatientCount/>
        <NoShowRate/>
      </div>
      <div>
        <MonthlyNewPatientCount/>
        <MonthlyReturningPatientCount/>
        <MonthlyNoShowRate/>
      </div>
    </OwnerPageShell>
  );
}

RevenuePage.propTypes = {};

export default RevenuePage;
