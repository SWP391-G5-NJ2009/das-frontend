import { useMemo } from "react";
import { usePatientTreatments } from "../../../hooks/usePatientTreatments";
import PatientPageShell from "../PatientPageShell";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "VND",
  style: "currency",
});

function formatDate(value) {
  if (!value) return "Not updated";
  return new Intl.DateTimeFormat("en-US").format(new Date(value));
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === "") {
    return "Not updated";
  }

  return currencyFormatter.format(Number(value));
}

function HistoryPage() {
  const { error, isLoading, treatments } = usePatientTreatments();
  const totalCost = useMemo(
    () =>
      treatments.reduce(
        (sum, record) => sum + Number(record.cost || 0),
        0,
      ),
    [treatments],
  );

  return (
    <PatientPageShell>
      <section className="patient-history-section" aria-labelledby="patient-history-title">
        <article className="patient-history-card">
          <div className="patient-history-card__header">
            <h1 id="patient-history-title">Treatment History</h1>
            <p>Records of completed visits and treatments</p>
          </div>

          {isLoading && (
            <p className="patient-profile-card__state">Loading treatment history...</p>
          )}
          {error && (
            <p className="patient-profile-card__state patient-profile-card__state--error">
              {error.message || "Unable to load treatment history."}
            </p>
          )}
          {!isLoading && !error && !treatments.length && (
            <p className="patient-profile-card__state">
              No treatment history yet.
            </p>
          )}

          {!isLoading && !error && treatments.length > 0 && (
            <>
              <div className="patient-history-table-wrap">
                <table className="patient-history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Treatment</th>
                      <th>Diagnosis</th>
                      <th>Dentist</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {treatments.map((record) => (
                      <tr key={record.id}>
                        <td>{formatDate(record.date)}</td>
                        <td>{record.treatment}</td>
                        <td>{record.diagnosis || "Not updated"}</td>
                        <td>{record.dentist || "Not updated"}</td>
                        <td>{formatCurrency(record.cost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="patient-history-card__total">
                Total treatment cost: <strong>{formatCurrency(totalCost)}</strong>
              </p>
            </>
          )}
        </article>
      </section>
    </PatientPageShell>
  );
}

export default HistoryPage;
