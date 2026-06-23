import { usePatientTreatments } from "../../../hooks/usePatientTreatments";
import PatientPageShell from "../PatientPageShell";
import "./HistoryPage.css";

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

  return (
    <PatientPageShell>
      <section
        className="patient-history-section"
        aria-labelledby="patient-history-title"
      >
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
              <div
                className="patient-history-table__wrap"
                role="region"
                aria-label="Treatment history list"
              >
                <table className="patient-history-table">
                  <thead className="patient-history-table__head">
                    <tr>
                      <th className="patient-history-table__th" scope="col">
                        Date
                      </th>
                      <th className="patient-history-table__th" scope="col">
                        Treatment
                      </th>
                      <th className="patient-history-table__th" scope="col">
                        Diagnosis
                      </th>
                      <th className="patient-history-table__th" scope="col">
                        Dentist
                      </th>
                      <th className="patient-history-table__th" scope="col">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody className="patient-history-table__body">
                    {treatments.map((record) => (
                      <tr className="patient-history-table__row" key={record.id}>
                        <td className="patient-history-table__td patient-history-table__td--date">
                          {formatDate(record.date)}
                        </td>
                        <td className="patient-history-table__td patient-history-table__td--treatment">
                          {record.treatment}
                        </td>
                        <td className="patient-history-table__td patient-history-table__td--diagnosis">
                          {record.diagnosis || "Not updated"}
                        </td>
                        <td className="patient-history-table__td">
                          {record.dentist || "Not updated"}
                        </td>
                        <td className="patient-history-table__td patient-history-table__td--cost">
                          {formatCurrency(record.cost)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </>
          )}
        </article>
      </section>
    </PatientPageShell>
  );
}

export default HistoryPage;
