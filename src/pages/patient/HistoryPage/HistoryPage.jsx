import { useMemo } from "react";
import { usePatientTreatments } from "../../../hooks/usePatientTreatments";
import PatientPageShell from "../PatientPageShell";

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  currency: "VND",
  style: "currency",
});

function formatDate(value) {
  if (!value) return "Chưa cập nhật";
  return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === "") {
    return "Chưa cập nhật";
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
            <h1 id="patient-history-title">Lịch sử điều trị</h1>
            <p>Hồ sơ các lần khám và điều trị đã hoàn thành</p>
          </div>

          {isLoading && (
            <p className="patient-profile-card__state">Đang tải lịch sử điều trị...</p>
          )}
          {error && (
            <p className="patient-profile-card__state patient-profile-card__state--error">
              {error.message || "Không thể tải lịch sử điều trị."}
            </p>
          )}
          {!isLoading && !error && !treatments.length && (
            <p className="patient-profile-card__state">
              Chưa có lịch sử điều trị.
            </p>
          )}

          {!isLoading && !error && treatments.length > 0 && (
            <>
              <div className="patient-history-table-wrap">
                <table className="patient-history-table">
                  <thead>
                    <tr>
                      <th>Ngày</th>
                      <th>Điều trị</th>
                      <th>Chẩn đoán</th>
                      <th>Bác sĩ</th>
                      <th>Chi phí</th>
                    </tr>
                  </thead>
                  <tbody>
                    {treatments.map((record) => (
                      <tr key={record.id}>
                        <td>{formatDate(record.date)}</td>
                        <td>{record.treatment}</td>
                        <td>{record.diagnosis || "Chưa cập nhật"}</td>
                        <td>{record.dentist || "Chưa cập nhật"}</td>
                        <td>{formatCurrency(record.cost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="patient-history-card__total">
                Tổng chi phí điều trị: <strong>{formatCurrency(totalCost)}</strong>
              </p>
            </>
          )}
        </article>
      </section>
    </PatientPageShell>
  );
}

export default HistoryPage;
