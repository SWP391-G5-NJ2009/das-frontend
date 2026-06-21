import PatientPageShell from "../PatientPageShell";
import { treatmentHistory } from "../patientData";

function HistoryPage() {
  return (
    <PatientPageShell>
      <section
        className="patient-history-section"
        aria-labelledby="patient-history-title"
      >
        <article className="patient-history-card">
          <div className="patient-history-card__header">
            <h1 id="patient-history-title">Lịch sử điều trị</h1>
            <p>Hồ sơ các lần khám và điều trị đã hoàn thành</p>
          </div>

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
                {treatmentHistory.map((record) => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>{record.treatment}</td>
                    <td>{record.diagnosis}</td>
                    <td>{record.dentist}</td>
                    <td>{record.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="patient-history-card__total">
            Tổng chi phí điều trị: <strong>2.650.000đ</strong>
          </p>
        </article>
      </section>
    </PatientPageShell>
  );
}

export default HistoryPage;
