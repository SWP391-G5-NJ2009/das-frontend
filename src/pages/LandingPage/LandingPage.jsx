import { CalendarDays, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import heroDentist from "../../assets/hero-dentist.jpg";
import SiteFooter from "../../components/SiteFooter/SiteFooter";
import SiteHeader from "../../components/SiteHeader/SiteHeader";
import { dentalServices } from "../../data/dentalServices";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">
      <SiteHeader />

      <main>
        <section className="landing-hero" id="home">
          <div className="landing-hero__inner">
            <div className="landing-hero__content">
              <p className="landing-hero__eyebrow">
                <ShieldCheck size={16} aria-hidden="true" />
                Nha khoa uy tín hàng đầu
              </p>
              <h1 className="landing-hero__title">
                Đặt lịch khám răng <span>dễ dàng</span> chỉ trong vài phút
              </h1>
              <p className="landing-hero__text">
                DentalCare giúp bạn chủ động đặt lịch hẹn với bác sĩ nha khoa,
                theo dõi lịch khám và chăm sóc nụ cười khỏe đẹp mỗi ngày.
              </p>
              <div className="landing-hero__actions">
                <Link className="landing-button landing-button--primary" to="/consultation">
                  <CalendarDays size={16} aria-hidden="true" />
                  Đặt lịch ngay
                </Link>
                <Link className="landing-button landing-button--secondary" to="/services">
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
            <div className="landing-hero__media">
              <img src={heroDentist} alt="Bác sĩ nha khoa tại phòng khám DentalCare" />
            </div>
          </div>
        </section>

        <section className="landing-services" id="services">
          <div className="landing-services__header">
            <h2>Dịch vụ của chúng tôi</h2>
            <p>
              Đa dạng dịch vụ nha khoa với đội ngũ bác sĩ giàu kinh nghiệm và
              trang thiết bị hiện đại.
            </p>
          </div>
          <div className="landing-services__grid">
            {dentalServices.map(({ title, description, Icon }) => (
              <article className="service-card" key={title}>
                <div className="service-card__icon">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-consultation" id="consultation">
          <div className="landing-consultation__inner">
            <div className="landing-consultation__content">
              <h2>Đăng ký tư vấn</h2>
              <p>
                Để lại thông tin, đội ngũ DentalCare sẽ liên hệ tư vấn miễn phí
                và sắp xếp lịch hẹn phù hợp cho bạn.
              </p>
              <ul className="landing-contact">
                <li>
                  <Phone size={20} aria-hidden="true" />
                  <span>1900 1234</span>
                </li>
                <li>
                  <Mail size={20} aria-hidden="true" />
                  <span>lienhe@dentalcare.vn</span>
                </li>
                <li>
                  <MapPin size={20} aria-hidden="true" />
                  <span>123 Đường Nguyễn Huệ, Quận 1, TP.HCM</span>
                </li>
              </ul>
            </div>

            <form className="consultation-form">
              <label className="consultation-form__field">
                <span>Họ và tên</span>
                <input type="text" name="fullName" placeholder="Họ và tên" />
              </label>
              <label className="consultation-form__field">
                <span>Số điện thoại</span>
                <input type="tel" name="phone" placeholder="Số điện thoại" />
              </label>
              <label className="consultation-form__field">
                <span>Email</span>
                <input type="email" name="email" placeholder="Email" />
              </label>
              <label className="consultation-form__field">
                <span>Nội dung cần tư vấn</span>
                <textarea name="message" placeholder="Nội dung cần tư vấn" rows="5" />
              </label>
              <button className="consultation-form__submit" type="button">
                Gửi yêu cầu tư vấn
              </button>
            </form>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default LandingPage;
