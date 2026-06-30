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
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const clinicName = clinicInfo?.clinic_name || "DentalCare";
  const featuredServices = services.slice(0, 6);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      await consultationService.create(form);
      setForm({ full_name: "", phone: "", email: "", description: "" });
      setSuccess("Consultation request sent successfully!");
    } catch (err) {
      setError(err.message);
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
                Trusted dental care
              </p>
              <h1 className="landing-hero__title">
                {clinicName} helps you care for your smile <span>with ease</span>
              </h1>
              {isClinicLoading ? (
                <p className="landing-hero__text">
                  Loading clinic information...
                </p>
              ) : clinicError ? (
                <p className="landing-message landing-message--error">
                  We could not load clinic information right now. Please try
                  again later.
                </p>
              ) : (
                <p className="landing-hero__text">
                  {clinicInfo?.introduction}
                </p>
              )}
              <div className="landing-hero__actions">
                <Link
                  className="landing-button landing-button--primary"
                  to="/consultation"
                >
                  <CalendarDays size={16} aria-hidden="true" />
                  Book now
                </Link>
                <Link
                  className="landing-button landing-button--secondary"
                  to="/services"
                >
                  Explore services
                </Link>
              </div>
            </div>
            <div className="landing-hero__media">
              <img src={heroDentist} alt={`${clinicName} clinic dentist`} />
            </div>
          </div>
        </section>

        {clinicInfo && (
          <section className="landing-info" aria-label="Clinic information">
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
                  <h2>Address</h2>
                  <p>{clinicInfo.address}</p>
                </div>
              </article>
              <article className="landing-info__item">
                <Clock size={20} aria-hidden="true" />
                <div>
                  <h2>Open hours</h2>
                  <p>{clinicInfo.open_time}</p>
                </div>
              </article>
              <article className="landing-info__item">
                <Clock size={20} aria-hidden="true" />
                <div>
                  <h2>Close hours</h2>
                  <p>{clinicInfo.close_time}</p>
                </div>
              </article>
            </div>
          </section>
        )}

        <section className="landing-services" id="services">
          <div className="landing-services__header">
            <h2>Our services</h2>
            <p>
              A broad range of active dental services from experienced dentists
              and modern equipment.
            </p>
          </div>

          {isServicesLoading ? (
            <p className="landing-message">Loading dental services...</p>
          ) : servicesError ? (
            <p className="landing-message landing-message--error">
              We could not load dental services right now. Please try again
              later.
            </p>
          ) : featuredServices.length === 0 ? (
            <p className="landing-message">
              No dental services are available at the moment.
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
                    {service.description || "Service details are being updated."}
                  </p>
                  <dl className="service-card__meta">
                    <div>
                      <dt>Time</dt>
                      <dd>{service.duration} minutes</dd>
                    </div>
                    <div>
                      <dt>Cost</dt>
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
              <h2>Request a consultation</h2>
              <p>
                Leave your information and the {clinicName} team will contact
                you for a consultation and help arrange a suitable appointment.
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
                  placeholder="Full name"
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="consultation-form__field">
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  placeholder="Phone number"
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="consultation-form__field">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="Email"
                  onChange={handleChange}
                />
              </label>
              <label className="consultation-form__field">
                <textarea
                  name="description"
                  value={form.description}
                  placeholder="Consultation details"
                  rows="5"
                  onChange={handleChange}
                  required
                />
              </label>
              <button
                className="consultation-form__submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send consultation request"}
              </button>
              {success && <Toast type="success" message={success} />}
            </form>
          </div>
        </section>
      </main>

      <SiteFooter clinicInfo={clinicInfo} />
    </div>
  );
}

export default LandingPage;
