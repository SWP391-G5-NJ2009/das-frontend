import { ChevronDown } from "lucide-react";
import PatientPageShell from "../PatientPageShell";

function BookingPage() {
  return (
    <PatientPageShell>
      <section className="patient-booking-section" aria-labelledby="patient-booking-title">
        <article className="patient-booking-card">
          <div className="patient-booking-card__header">
            <h1 id="patient-booking-title">Đặt lịch hẹn</h1>
            <p>Chọn bác sĩ và khung giờ còn trống để đặt lịch</p>
          </div>
          <form className="patient-booking-form">
            <label>
              <span>Bác sĩ</span>
              <div className="patient-booking-form__select">
                <select name="dentist" defaultValue="">
                  <option value="" disabled>
                    Chọn bác sĩ
                  </option>
                  <option value="nguyen-thi-lan">BS. Nguyễn Thị Lan</option>
                  <option value="tran-minh-khoa">BS. Trần Minh Khoa</option>
                  <option value="pham-anh-tuan">BS. Phạm Anh Tuấn</option>
                </select>
                <ChevronDown size={18} aria-hidden="true" />
              </div>
            </label>
            <label>
              <span>Dịch vụ</span>
              <div className="patient-booking-form__select">
                <select name="service" defaultValue="">
                  <option value="" disabled>
                    Chọn dịch vụ
                  </option>
                  <option value="kham-tong-quat">Khám tổng quát</option>
                  <option value="tay-trang-rang">Tẩy trắng răng</option>
                  <option value="nieng-rang">Niềng răng</option>
                  <option value="trong-rang-implant">Trồng răng Implant</option>
                </select>
                <ChevronDown size={18} aria-hidden="true" />
              </div>
            </label>
            <div className="patient-booking-form__actions">
              <button type="button">Xác nhận đặt lịch</button>
            </div>
          </form>
        </article>
      </section>
    </PatientPageShell>
  );
}

export default BookingPage;
