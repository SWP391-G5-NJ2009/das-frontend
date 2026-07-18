import { LockKeyhole, Send } from "lucide-react";
import heroConsultation from "../../../assets/images/hero-consultation.png";
import SiteFooter from "../../../components/layout/SiteFooter/SiteFooter";
import SiteHeader from "../../../components/layout/SiteHeader/SiteHeader";
import "./ConsultationPage.css";
import { consultationService } from "../../../services/consultation.service";
import { useState } from "react";
import Toast from "../../../components/common/Toast/Toast";

function ConsultationPage() {

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    description: "",
    website: "",
  })

  const [loadedAt] = useState(Date.now());

  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const {name, value} = e.target;
    const cleaned = name === "phone" ? value.replace(/\D/g, "") : value;
    setForm((prev) => ({ ...prev, [name]: cleaned }));
    setFieldErrors((prev) => ({ ...prev , [name]: null}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await consultationService.create({ ...form, loadedAt });
      setForm({ full_name: "", phone: "", email: "", description: "" });
      setFieldErrors(null);
      setSuccess("Yêu cầu tư vấn đã được gửi thành công!");
    } catch (err) {
      if (err.code === "VALIDATION_ERROR") {
        setFieldErrors(err.details);
      } else {
        setError(err.message);
      }
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
            alt="Tư vấn nha khoa DentalCare"
          />
          <div className="consultation-hero__overlay">
            <form className="consultation-panel" onSubmit={handleSubmit}>
              {error && <p className="consultation-panel__error">{error}</p>}
              <div className="consultation-panel__header">
                <h1 id="consultation-title">Yêu cầu tư vấn</h1>
                <p>
                  Vui lòng để lại thông tin, chúng tôi sẽ liên hệ với bạn
                  trong thời gian sớm nhất.
                </p>
              </div>

              <label className="consultation-panel__field">
                <span>Họ và tên *</span>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  placeholder="Nhập họ và tên"
                  onChange={handleChange}
                  required
                />
                {fieldErrors?.full_name && (
                  <span className="consultation-panel__field-error">
                    {fieldErrors.full_name[0]}
                  </span>
                )}
              </label>

              <label className="consultation-panel__field">
                <span>Số điện thoại *</span>
                <input
                  type="tel"
                  name="phone"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.phone}
                  placeholder="Nhập số điện thoại liên hệ"
                  onChange={handleChange}
                  required
                />
                {fieldErrors?.phone && (
                  <span className="consultation-panel__field-error">
                    {fieldErrors.phone[0]}
                  </span>
                )}
              </label>

              <label className="consultation-panel__field">
                <span>Email (không bắt buộc)</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="Nhập địa chỉ email"
                  onChange={handleChange}
                />
                {fieldErrors?.email && (
                  <span className="consultation-panel__field-error">
                    {fieldErrors.email[0]}
                  </span>
                )}
              </label>

              <label className="consultation-panel__field">
                <span>Nội dung yêu cầu tư vấn</span>
                <textarea
                  name="description"
                  value={form.description}
                  placeholder="Mô tả ngắn gọn vấn đề hoặc dịch vụ bạn quan tâm..."
                  rows="5"
                  onChange={handleChange}
                />
                {fieldErrors?.description && (
                  <span className="consultation-panel__field-error">
                    {fieldErrors.description[0]}
                  </span>
                )}
              </label>

              <input
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                style={{ position: "absolute", left: "-9999px" }}
                value={form.website}
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              />

              <button className="consultation-panel__submit" type="submit" disabled={isSubmitting}>
                <Send size={18} aria-hidden="true" />
                Gửi yêu cầu
              </button>

              <p className="consultation-panel__privacy">
                <LockKeyhole size={16} aria-hidden="true" />
                Thông tin của bạn được giữ bí mật tuyệt đối.
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
