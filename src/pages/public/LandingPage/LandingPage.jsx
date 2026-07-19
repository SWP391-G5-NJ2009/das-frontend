import {
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import heroDentist from "../../../assets/images/hero-dentist.jpg";
import Toast from "../../../components/common/Toast/Toast";
import SiteFooter from "../../../components/layout/SiteFooter/SiteFooter";
import SiteHeader from "../../../components/layout/SiteHeader/SiteHeader";
import { useClinicInfo } from "../../../hooks/useClinicInfo";
import { usePublicServices } from "../../../hooks/useDentalServices";
import { consultationService } from "../../../services/consultation.service";
import "./LandingPage.css";

function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "Contact for pricing";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function LandingPage() {
  const {
    clinicInfo,
    error: clinicError,
    isLoading: isClinicLoading,
  } = useClinicInfo();
  const {
    error: servicesError,
    isLoading: isServicesLoading,
    services,
  } = usePublicServices();

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    description: "",
    website: "",
  });

  const [error, setError] = useState(null);
  const [loadedAt] = useState(Date.now());
  const [fieldErrors, setFieldErrors] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const clinicName = clinicInfo?.clinic_name || "DentalCare";
  const featuredServices = services.slice(0, 6);

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
    <div className="landing-page">
      <SiteHeader brandName={clinicName} />

      <main>
        <section className="landing-hero" id="home">
          <div className="landing-hero__inner">
            <div className="landing-hero__content">
              <p className="landing-hero__eyebrow">
                <ShieldCheck size={16} aria-hidden="true" />
                Chăm sóc nha khoa đáng tin cậy
              </p>
              <h1 className="landing-hero__title">
                {clinicName} giúp bạn chăm sóc nụ cười <span>thật dễ dàng</span>
              </h1>
              {isClinicLoading ? (
                <p className="landing-hero__text">
                  Đang tải thông tin phòng khám...
                </p>
              ) : clinicError ? (
                <p className="landing-message landing-message--error">
                  Hiện không thể tải thông tin phòng khám. Vui lòng thử lại sau.
                </p>
              ) : (
                <p className="landing-hero__text">
                  Dịch vụ chăm sóc nha khoa chuyên nghiệp với đội ngũ nha sĩ
                  giàu kinh nghiệm và trang thiết bị hiện đại.
                </p>
              )}
              <div className="landing-hero__actions">
                <Link
                  className="landing-button landing-button--primary"
                  to="/consultation"
                >
                  <CalendarDays size={16} aria-hidden="true" />
                  Đặt lịch ngay
                </Link>
                <Link
                  className="landing-button landing-button--secondary"
                  to="/services"
                >
                  Khám phá dịch vụ
                </Link>
              </div>
            </div>
            <div className="landing-hero__media">
              <img src={heroDentist} alt={`${clinicName} clinic dentist`} />
            </div>
          </div>
        </section>

        {clinicInfo && (
          <section className="landing-info" aria-label="Thông tin phòng khám">
            <div className="landing-info__grid">
              <article className="landing-info__item">
                <Phone size={20} aria-hidden="true" />
                <div>
                  <h2>Hotline</h2>
                  <p>{clinicInfo.hotline}</p>
                </div>
              </article>
              <article className="landing-info__item">
                <MapPin size={20} aria-hidden="true" />
                <div>
                  <h2>Địa chỉ</h2>
                  <p>{clinicInfo.address}</p>
                </div>
              </article>
              <article className="landing-info__item">
                <Clock size={20} aria-hidden="true" />
                <div>
                  <h2>Giờ mở cửa</h2>
                  <p>{clinicInfo.open_time}</p>
                </div>
              </article>
              <article className="landing-info__item">
                <Clock size={20} aria-hidden="true" />
                <div>
                  <h2>Giờ đóng cửa</h2>
                  <p>{clinicInfo.close_time}</p>
                </div>
              </article>
            </div>
          </section>
        )}

        <section className="landing-services" id="services">
          <div className="landing-services__header">
            <h2>Dịch vụ của chúng tôi</h2>
            <p>
              Nhiều dịch vụ nha khoa đang hoạt động với đội ngũ nha sĩ giàu kinh
              nghiệm và thiết bị hiện đại.
            </p>
          </div>

          {isServicesLoading ? (
            <p className="landing-message">Đang tải dịch vụ nha khoa...</p>
          ) : servicesError ? (
            <p className="landing-message landing-message--error">
              Hiện không thể tải dịch vụ nha khoa. Vui lòng thử lại sau.
            </p>
          ) : featuredServices.length === 0 ? (
            <p className="landing-message">
              Hiện chưa có dịch vụ nha khoa nào.
            </p>
          ) : (
            <div className="landing-services__grid">
              {featuredServices.map((service) => (
                <article className="service-card" key={service.id}>
                  <div className="service-card__icon">
                    <Stethoscope size={24} aria-hidden="true" />
                  </div>
                  <h3>{service.name}</h3>
                  <p>
                    {service.description ||
                      "Service details are being updated."}
                  </p>
                  <dl className="service-card__meta">
                    <div>
                      <dt>Thời gian</dt>
                      <dd>{service.duration} phút</dd>
                    </div>
                    <div>
                      <dt>Chi phí</dt>
                      <dd>{formatPrice(service.price)}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="landing-consultation" id="consultation">
          <div className="landing-consultation__inner">
            <div className="landing-consultation__content">
              <h2>Yêu cầu tư vấn</h2>
              <p>
                Để lại thông tin, đội ngũ {clinicName} sẽ liên hệ tư vấn
                và hỗ trợ bạn đặt lịch hẹn phù hợp.
              </p>
              {clinicInfo && (
                <ul className="landing-contact">
                  <li>
                    <Phone size={20} aria-hidden="true" />
                    <span>{clinicInfo.hotline}</span>
                  </li>
                  {clinicInfo.email && (
                    <li>
                      <Mail size={20} aria-hidden="true" />
                      <span>{clinicInfo.email}</span>
                    </li>
                  )}
                  <li>
                    <MapPin size={20} aria-hidden="true" />
                    <span>{clinicInfo.address}</span>
                  </li>
                  <li>
                    <Clock size={20} aria-hidden="true" />
                    <span>{clinicInfo.operating_hours}</span>
                  </li>
                </ul>
              )}
            </div>

            <form className="consultation-form" onSubmit={handleSubmit}>
              {error && (
                <p className="landing-message landing-message--error">
                  {error}
                </p>
              )}
              <label className="consultation-form__field">
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  placeholder="Họ và tên *"
                  onChange={handleChange}
                  required
                />
                {fieldErrors?.full_name && (
                  <span className="consultation-form__field-error">
                    {fieldErrors.full_name[0]}
                  </span>
                )}
              </label>
              <label className="consultation-form__field">
                <input
                  type="tel"
                  name="phone"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.phone}
                  placeholder="Số điện thoại *"
                  onChange={handleChange}
                  required
                />
                {fieldErrors?.phone && (
                  <span className="consultation-form__field-error">
                    {fieldErrors.phone[0]}
                  </span>
                )}
              </label>
              <label className="consultation-form__field">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="Email"
                  onChange={handleChange}
                />
                {fieldErrors?.email && (
                  <span className="consultation-form__field-error">
                    {fieldErrors.email[0]}
                  </span>
                )}
              </label>
              <label className="consultation-form__field">
                <textarea
                  name="description"
                  value={form.description}
                  placeholder="Chi tiết yêu cầu tư vấn"
                  rows="5"
                  onChange={handleChange}
                />
                {fieldErrors?.description && (
                  <span className="consultation-form__field-error">
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
                onChange={(e) =>
                  setForm((f) => ({ ...f, website: e.target.value }))
                }
              />

              <button
                className="consultation-form__submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
              </button>
              {success && <Toast type="success" message={success} onClose={() => setSuccess(null)} duration={5000} />}
            </form>
          </div>
        </section>
      </main>

      <SiteFooter clinicInfo={clinicInfo} />
    </div>
  );
}

export default LandingPage;
