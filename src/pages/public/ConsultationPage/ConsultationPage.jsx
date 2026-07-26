import { LockKeyhole, Send } from "lucide-react";
import heroConsultation from "../../../assets/images/hero-consultation.png";
import SiteFooter from "../../../components/layout/SiteFooter/SiteFooter";
import SiteHeader from "../../../components/layout/SiteHeader/SiteHeader";
import "./ConsultationPage.css";
import { consultationService } from "../../../services/consultation.service";
import { usePublicServices } from "../../../hooks/useDentalServices";
import { useState } from "react";
import Toast from "../../../components/common/Toast/Toast";

function ConsultationPage() {

  const { services, isLoading: isServicesLoading } = usePublicServices();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    description: "",
    service_id: "",
    consultation_date: "",
    website: "",
  })

  const [loadedAt] = useState(Date.now());

  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleaned = name === "phone" ? value.replace(/\D/g, "") : value;
    setForm((prev) => ({ ...prev, [name]: cleaned }));
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
    e.target.setCustomValidity('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await consultationService.create({ ...form, loadedAt });
      setForm({ full_name: "", phone: "", email: "", description: "", service_id: "", consultation_date: "" });
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

  function handleInvalid(e) {
    const v = e.target.validity;

    if (v.valueMissing) {
      e.target.setCustomValidity('Vui lòng nhập thông tin này');
    } else if (v.patternMismatch) {
      e.target.setCustomValidity('Số điện thoại phải bắt đầu bằng 0 và có từ 10 đến 11 chữ số');
    } else if (v.typeMismatch) {
      e.target.setCustomValidity('Vui lòng email đúng định dạng (VD: abc@gmail.com)');
    }
  }

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
                  maxLength={100}
                  onChange={handleChange}
                  onInvalid={handleInvalid}
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
                  pattern="0[0-9]{9,10}"
                  value={form.phone}
                  placeholder="Nhập số điện thoại liên hệ"
                  onChange={handleChange}
                  onInvalid={handleInvalid}
                  required
                />
                {fieldErrors?.phone && (
                  <span className="consultation-panel__field-error">
                    {fieldErrors.phone[0]}
                  </span>
                )}
              </label>

              <label className="consultation-panel__field">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  maxLength={254}
                  placeholder="Nhập địa chỉ email"
                  onChange={handleChange}
                  onInvalid={handleInvalid}
                />
                {fieldErrors?.email && (
                  <span className="consultation-panel__field-error">
                    {fieldErrors.email[0]}
                  </span>
                )}
              </label>

              <label className="consultation-panel__field">
                <span>Dịch vụ quan tâm</span>
                <select
                  name="service_id"
                  value={form.service_id}
                  onChange={handleChange}
                >
                  <option value="">-- Chọn dịch vụ --</option>
                  {!isServicesLoading && services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </label>

              <label className="consultation-panel__field">
                <span>Ngày tư vấn mong muốn</span>
                <input
                  type="date"
                  name="consultation_date"
                  value={form.consultation_date}
                  min={today}
                  onChange={handleChange}
                />
              </label>

              <label className="consultation-panel__field">
                <span>Nội dung yêu cầu tư vấn</span>
                <textarea
                  name="description"
                  maxLength={1000}
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

              {error && <p className="consultation-panel__error">{error}</p>}

              <button className="consultation-panel__submit" type="submit" disabled={isSubmitting}>
                <Send size={18} aria-hidden="true" />
                Gửi yêu cầu
              </button>

              <p className="consultation-panel__privacy">
                <LockKeyhole size={16} aria-hidden="true" />
                Thông tin của bạn được giữ bí mật tuyệt đối.
              </p>
              {success && <Toast type="success" message={success} onClose={() => setSuccess(null)} duration={5000} />}
            </form>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default ConsultationPage;
