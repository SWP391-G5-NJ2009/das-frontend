import { useState } from "react";
import {
  CalendarClock,
  CalendarPlus,
  ChevronDown,
  Clock3,
  Grid2X2,
  History,
  LogOut,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { authService } from "../../../services/auth.service";
import "./PatientDashboardPage.css";

const initialPatient = {
  fullName: "Nguyễn Văn An",
  email: "an.nguyen@email.com",
  phone: "0901 234 567",
  birthDate: "1995-06-15",
  gender: "Nam",
  address: "123 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
};

const navItems = [
  { id: "overview", label: "Tổng quan", Icon: Grid2X2 },
  { id: "profile", label: "Hồ sơ cá nhân", Icon: UserRound },
  { id: "booking", label: "Đặt lịch", Icon: CalendarPlus },
  { id: "appointments", label: "Lịch hẹn", Icon: CalendarClock },
  { id: "history", label: "Lịch sử điều trị", Icon: History },
];

const upcomingAppointments = [
  {
    id: "appointment-1",
    service: "Khám tổng quát",
    dentist: "BS. Nguyễn Thị Lan",
    date: "03/06/2026",
    time: "09:00",
  },
  {
    id: "appointment-2",
    service: "Niềng răng",
    dentist: "BS. Trần Văn Minh",
    date: "07/06/2026",
    time: "14:00",
  },
];

const treatmentHistory = [
  {
    id: "treatment-1",
    date: "02/05/2026",
    treatment: "Trám răng số 6",
    diagnosis: "Sâu răng độ 2",
    dentist: "BS. Nguyễn Thị Lan",
    cost: "500.000đ",
  },
  {
    id: "treatment-2",
    date: "03/03/2026",
    treatment: "Cạo vôi răng & đánh bóng",
    diagnosis: "Vôi răng nhiều",
    dentist: "BS. Lê Hoàng Anh",
    cost: "350.000đ",
  },
  {
    id: "treatment-3",
    date: "03/12/2025",
    treatment: "Điều trị tủy răng số 4",
    diagnosis: "Viêm tủy không hồi phục",
    dentist: "BS. Nguyễn Thị Lan",
    cost: "1.800.000đ",
  },
];

function PatientDashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [patient, setPatient] = useState(initialPatient);
  const [draftPatient, setDraftPatient] = useState(initialPatient);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState({
    isLoading: false,
    error: "",
    success: "",
  });

  const handleEditProfile = () => {
    setDraftPatient(patient);
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setDraftPatient(patient);
    setIsEditingProfile(false);
  };

  const handleSaveProfile = () => {
    setPatient(draftPatient);
    setIsEditingProfile(false);
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setDraftPatient((current) => ({ ...current, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
    setPasswordStatus({ isLoading: false, error: "", success: "" });
  };

  const handleCancelPasswordChange = () => {
    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordStatus({ isLoading: false, error: "", success: "" });
  };

  const handleSubmitPasswordChange = async (event) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({
        isLoading: false,
        error: "Mật khẩu xác nhận không khớp.",
        success: "",
      });
      return;
    }

    setPasswordStatus({ isLoading: true, error: "", success: "" });

    try {
      await authService.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordStatus({
        isLoading: false,
        error: "",
        success: "Đổi mật khẩu thành công.",
      });
    } catch (error) {
      setPasswordStatus({
        isLoading: false,
        error: error.message || "Không thể đổi mật khẩu. Vui lòng thử lại.",
        success: "",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="patient-dashboard">
      <aside className="patient-dashboard__sidebar">
        <Link className="patient-dashboard__brand" to="/">
          <span>DentalCare</span>
        </Link>

        <div className="patient-dashboard__profile">
          <p>Xin chào,</p>
          <strong>{patient.fullName}</strong>
        </div>

        <nav className="patient-dashboard__nav" aria-label="Điều hướng bệnh nhân">
          {navItems.map(({ id, label, Icon }) => (
            <button
              className={
                activeSection === id
                  ? "patient-dashboard__nav-item patient-dashboard__nav-item--active"
                  : "patient-dashboard__nav-item"
              }
              type="button"
              key={id}
              onClick={() => setActiveSection(id)}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <button className="patient-dashboard__logout" type="button" onClick={handleLogout}>
          <LogOut size={18} aria-hidden="true" />
          <span>Đăng xuất</span>
        </button>
      </aside>

      <main className="patient-dashboard__main">
        {activeSection === "overview" && (
          <section className="patient-overview" aria-labelledby="patient-overview-title">
            <div className="patient-overview__header">
              <h1 id="patient-overview-title">Tổng quan</h1>
              <p>Chào mừng trở lại, {patient.fullName}!</p>
            </div>

            <div className="patient-overview__stats" aria-label="Thống kê tổng quan">
              <button
                className="patient-stat-card patient-stat-card--action"
                type="button"
                onClick={() => setActiveSection("appointments")}
              >
                <div className="patient-stat-card__icon">
                  <CalendarClock size={26} aria-hidden="true" />
                </div>
                <div>
                  <strong>2</strong>
                  <span>Lịch hẹn sắp tới</span>
                </div>
              </button>

              <button
                className="patient-stat-card patient-stat-card--action"
                type="button"
                onClick={() => setActiveSection("history")}
              >
                <div className="patient-stat-card__icon">
                  <Clock3 size={26} aria-hidden="true" />
                </div>
                <div>
                  <strong>3</strong>
                  <span>Lần điều trị</span>
                </div>
              </button>

              <button
                className="patient-stat-card patient-stat-card--action"
                type="button"
                onClick={() => setActiveSection("booking")}
              >
                <div className="patient-stat-card__icon">
                  <CalendarPlus size={26} aria-hidden="true" />
                </div>
                <div>
                  <strong>+</strong>
                  <span>Đặt lịch mới</span>
                </div>
              </button>
            </div>

            <article className="patient-next-appointment">
              <h2>Lịch hẹn tiếp theo</h2>
              <strong>Khám tổng quát</strong>
              <p>BS. Nguyễn Thị Lan</p>
              <time dateTime="2026-06-03T09:00">03/06/2026 lúc 09:00</time>
            </article>
          </section>
        )}

        {activeSection === "profile" && (
          <section className="patient-profile-section" aria-labelledby="patient-profile-title">
            <article className="patient-profile-card">
              <div className="patient-profile-card__header">
                <div>
                  <h1 id="patient-profile-title">Hồ sơ cá nhân</h1>
                  <p>Quản lý thông tin cá nhân của bạn</p>
                </div>
                {!isEditingProfile && (
                  <button
                    className="patient-profile-card__edit"
                    type="button"
                    onClick={handleEditProfile}
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form className="patient-profile-form">
                  <label className="patient-profile-form__field">
                    <span>Họ và tên</span>
                    <input name="fullName" type="text" value={draftPatient.fullName} onChange={handleProfileChange} />
                  </label>
                  <label className="patient-profile-form__field">
                    <span>Email</span>
                    <input name="email" type="email" value={draftPatient.email} onChange={handleProfileChange} />
                  </label>
                  <label className="patient-profile-form__field">
                    <span>Số điện thoại</span>
                    <input name="phone" type="tel" value={draftPatient.phone} onChange={handleProfileChange} />
                  </label>
                  <label className="patient-profile-form__field">
                    <span>Ngày sinh</span>
                    <input name="birthDate" type="date" value={draftPatient.birthDate} onChange={handleProfileChange} />
                  </label>
                  <label className="patient-profile-form__field">
                    <span>Giới tính</span>
                    <input name="gender" type="text" value={draftPatient.gender} onChange={handleProfileChange} />
                  </label>
                  <label className="patient-profile-form__field patient-profile-form__field--full">
                    <span>Địa chỉ</span>
                    <input name="address" type="text" value={draftPatient.address} onChange={handleProfileChange} />
                  </label>
                  <div className="patient-profile-form__actions">
                    <button type="button" onClick={handleSaveProfile}>
                      Lưu thay đổi
                    </button>
                    <button type="button" onClick={handleCancelEdit}>
                      Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <dl className="patient-profile-details">
                  <div>
                    <dt>Họ và tên</dt>
                    <dd>{patient.fullName}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{patient.email}</dd>
                  </div>
                  <div>
                    <dt>Số điện thoại</dt>
                    <dd>{patient.phone}</dd>
                  </div>
                  <div>
                    <dt>Ngày sinh</dt>
                    <dd>{patient.birthDate}</dd>
                  </div>
                  <div>
                    <dt>Giới tính</dt>
                    <dd>{patient.gender}</dd>
                  </div>
                  <div className="patient-profile-details__full">
                    <dt>Địa chỉ</dt>
                    <dd>{patient.address}</dd>
                  </div>
                </dl>
              )}
            </article>

            <article className="patient-password-card">
              <div className="patient-password-card__header">
                <h2>Đổi mật khẩu</h2>
                <p>Cập nhật mật khẩu để bảo vệ tài khoản</p>
              </div>
              <form className="patient-password-form" onSubmit={handleSubmitPasswordChange}>
                <label>
                  <span>Mật khẩu hiện tại</span>
                  <input
                    name="oldPassword"
                    type="password"
                    value={passwordForm.oldPassword}
                    placeholder="Nhập mật khẩu hiện tại"
                    onChange={handlePasswordChange}
                    required
                  />
                </label>
                <label>
                  <span>Mật khẩu mới</span>
                  <input
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    minLength={8}
                    pattern="^(?=.*[A-Za-z])(?=.*\d).+$"
                    placeholder="Nhập mật khẩu mới (ít nhất 8 ký tự, có chữ và số)"
                    onChange={handlePasswordChange}
                    required
                  />
                </label>
                <label>
                  <span>Xác nhận mật khẩu mới</span>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    placeholder="Nhập lại mật khẩu mới"
                    onChange={handlePasswordChange}
                    required
                  />
                </label>
                {passwordStatus.error && (
                  <p className="patient-password-form__message patient-password-form__message--error">
                    {passwordStatus.error}
                  </p>
                )}
                {passwordStatus.success && (
                  <p className="patient-password-form__message patient-password-form__message--success">
                    {passwordStatus.success}
                  </p>
                )}
                <div className="patient-password-form__actions">
                  <button type="submit" disabled={passwordStatus.isLoading}>
                    {passwordStatus.isLoading ? "Đang lưu..." : "Lưu mật khẩu"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelPasswordChange}
                    disabled={passwordStatus.isLoading}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </article>
          </section>
        )}

        {activeSection === "booking" && (
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
        )}

        {activeSection === "appointments" && (
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
        )}

        {activeSection === "history" && (
          <section className="patient-history-section" aria-labelledby="patient-history-title">
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
        )}
      </main>
    </div>
  );
}

export default PatientDashboardPage;
