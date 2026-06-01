import { LockKeyhole, Send } from "lucide-react";
import heroConsultation from "../../assets/hero-consultation.png";
import SiteFooter from "../../components/SiteFooter/SiteFooter";
import SiteHeader from "../../components/SiteHeader/SiteHeader";
import "./ConsultationPage.css";

function ConsultationPage() {
  return (
    <div className="consultation-page">
      <SiteHeader />

      <main className="consultation-page__main">
        <section className="consultation-hero" aria-labelledby="consultation-title">
          <img
            className="consultation-hero__image"
            src={heroConsultation}
            alt="Bác sĩ nha khoa tư vấn tại DentalCare"
          />
          <div className="consultation-hero__overlay">
            <form className="consultation-panel">
              <div className="consultation-panel__header">
                <h1 id="consultation-title">Đăng ký tư vấn</h1>
                <p>
                  Vui lòng để lại thông tin, chúng tôi sẽ liên hệ lại với bạn
                  trong thời gian sớm nhất.
                </p>
              </div>

              <label className="consultation-panel__field">
                <span>Họ và tên *</span>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Nhập họ và tên của bạn"
                  required
                />
              </label>

              <label className="consultation-panel__field">
                <span>Số điện thoại *</span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Nhập số điện thoại liên hệ"
                  required
                />
              </label>

              <label className="consultation-panel__field">
                <span>Email (tùy chọn)</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Nhập địa chỉ email của bạn"
                />
              </label>

              <label className="consultation-panel__field">
                <span>Nội dung cần tư vấn *</span>
                <textarea
                  name="message"
                  placeholder="Mô tả ngắn gọn tình trạng hoặc dịch vụ bạn quan tâm..."
                  rows="5"
                  required
                />
              </label>

              <button className="consultation-panel__submit" type="button">
                <Send size={18} aria-hidden="true" />
                Gửi yêu cầu
              </button>

              <p className="consultation-panel__privacy">
                <LockKeyhole size={16} aria-hidden="true" />
                Thông tin của bạn được bảo mật tuyệt đối.
              </p>
            </form>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default ConsultationPage;
