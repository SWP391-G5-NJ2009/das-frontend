import { CalendarDays, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import heroDentist from "../../../assets/images/hero-dentist.jpg";
import SiteFooter from "../../../components/layout/SiteFooter/SiteFooter";
import SiteHeader from "../../../components/layout/SiteHeader/SiteHeader";
import { dentalServices } from "../../../data/dentalServices";
import { useState } from "react";
import "./LandingPage.css";
import { consultationService } from "../../../services/consultation.service";
import Toast from "../../../components/common/Toast/Toast";

function LandingPage() {

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    description: "",
  });

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
      setSuccess("Consultation request sent successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="landing-page">
      <SiteHeader />

      <main>
        <section className="landing-hero" id="home">
          <div className="landing-hero__inner">
            <div className="landing-hero__content">
              <p className="landing-hero__eyebrow">
                <ShieldCheck size={16} aria-hidden="true" />
                Trusted dental care
              </p>
              <h1 className="landing-hero__title">
                Book your dental visit <span>easily</span> in just a few minutes
              </h1>
              <p className="landing-hero__text">
                DentalCare helps you book appointments with dentists,
                track visits, and care for a healthy smile every day.
              </p>
              <div className="landing-hero__actions">
                <Link className="landing-button landing-button--primary" to="/consultation">
                  <CalendarDays size={16} aria-hidden="true" />
                  Book now
                </Link>
                <Link className="landing-button landing-button--secondary" to="/services">
                  Learn more
                </Link>
              </div>
            </div>
            <div className="landing-hero__media">
              <img src={heroDentist} alt="Dentist at DentalCare clinic" />
            </div>
          </div>
        </section>

        <section className="landing-services" id="services">
          <div className="landing-services__header">
            <h2>Our services</h2>
            <p>
              A broad range of dental services from experienced dentists and
              modern equipment.
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
              <h2>Request a consultation</h2>
              <p>
                Leave your information and the DentalCare team will contact you for a free consultation
                and help arrange a suitable appointment.
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
                  <span>123 Nguyen Hue Street, District 1, Ho Chi Minh City</span>
                </li>
              </ul>
            </div>

            <form className="consultation-form" onSubmit={handleSubmit}>
              {error && <p>{error}</p>}
              <label className="consultation-form__field">
                <input type="text" name="full_name" value={form.full_name} placeholder="Full name" onChange={handleChange} required />
              </label>
              <label className="consultation-form__field">
                <input type="tel" name="phone" value={form.phone} placeholder="Phone number" onChange={handleChange} required />
              </label>
              <label className="consultation-form__field">
                <input type="email" name="email" value={form.email} placeholder="Email" onChange={handleChange} />
              </label>
              <label className="consultation-form__field">
                <textarea name="description" value={form.description} placeholder="Consultation details" rows="5" onChange={handleChange} required />
              </label>
              <button className="consultation-form__submit" type="submit" disabled={isSubmitting}>
                Send consultation request
              </button>
              {success && <Toast type="success" message={success} />}
            </form>
            
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default LandingPage;
