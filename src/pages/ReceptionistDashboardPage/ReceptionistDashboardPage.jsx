import { CalendarDays, Headphones, ReceiptText, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import "./ReceptionistDashboardPage.css";

const RECEPTIONIST_STATS = [
  {
    label: "Lịch hẹn hôm nay",
    value: "12",
    Icon: CalendarDays,
  },
  {
    label: "Hóa đơn chờ xử lý",
    value: "3",
    Icon: ReceiptText,
  },
  {
    label: "Doanh thu hôm nay",
    value: "4.500.000 đ",
    Icon: Wallet,
  },
];

function ReceptionistDashboardPage() {
  return (
    <section className="receptionist-dashboard" aria-labelledby="receptionist-dashboard-title">
      <div className="receptionist-dashboard__page-header">
        <h1 id="receptionist-dashboard-title">Dashboard</h1>
        <p>Theo dõi nhanh lịch hẹn, thanh toán và các việc cần xử lý trong ca trực.</p>
      </div>

      <div className="receptionist-dashboard__stats" aria-label="Thống kê tổng quan">
        {RECEPTIONIST_STATS.map(({ label, value, Icon }) => (
          <article className="receptionist-dashboard__stat-card" key={label}>
            <div className="receptionist-dashboard__stat-icon">
              <Icon size={26} aria-hidden="true" />
            </div>
            <div>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          </article>
        ))}
      </div>

      <article className="receptionist-dashboard__priority-card">
        <h2>Công việc ưu tiên</h2>
        <strong>Kiểm tra thanh toán chờ xử lý</strong>
        <p>3 hóa đơn cần xác nhận trước khi đóng ca.</p>
        <Link className="receptionist-dashboard__priority-link" to="/payments">
          <Headphones size={18} aria-hidden="true" />
          Mở lịch sử thanh toán
        </Link>
      </article>
    </section>
  );
}

ReceptionistDashboardPage.propTypes = {};

export default ReceptionistDashboardPage;
