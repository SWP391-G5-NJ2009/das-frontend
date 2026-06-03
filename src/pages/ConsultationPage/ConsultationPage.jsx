import { LockKeyhole, Send } from "lucide-react";
import heroConsultation from "../../assets/hero-consultation.png";
import SiteFooter from "../../components/SiteFooter/SiteFooter";
import SiteHeader from "../../components/SiteHeader/SiteHeader";
import "./ConsultationPage.css";
import { consultationService } from "../../services/consultation.service";
import { useState } from "react";
import Toast from "../../components/Toast/Toast";

function ConsultationPage() {

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    description: "",
  })

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await consultationService.create(form);
      setForm({ full_name: "", phone: "", email: "", description: ""});
      setSuccess("Gửi yêu cầu tư vấn thành công!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <form className="consultation-panel" onSubmit={handleSubmit}>
              {error && <p>{error}</p>}
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
                  name="full_name"
                  value={form.full_name}
                  placeholder="Nhập họ và tên của bạn"
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="consultation-panel__field">
                <span>Số điện thoại *</span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  placeholder="Nhập số điện thoại liên hệ"
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="consultation-panel__field">
                <span>Email (tùy chọn)</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="Nhập địa chỉ email của bạn"
                  onChange={handleChange}
                />
              </label>

              <label className="consultation-panel__field">
                <span>Nội dung cần tư vấn *</span>
                <textarea
                  name="description"
                  value={form.description}
                  placeholder="Mô tả ngắn gọn tình trạng hoặc dịch vụ bạn quan tâm..."
                  rows="5"
                  onChange={handleChange}
                  required
                />
              </label>

              <button className="consultation-panel__submit" type="submit" disabled={isSubmitting}>
                <Send size={18} aria-hidden="true" />
                Gửi yêu cầu
              </button>

              <p className="consultation-panel__privacy">
                <LockKeyhole size={16} aria-hidden="true" />
                Thông tin của bạn được bảo mật tuyệt đối.
              </p>
              {success && <Toast type="success" message={success} />}
            </form>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default ConsultationPage;
