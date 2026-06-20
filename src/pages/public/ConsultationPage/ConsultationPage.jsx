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
      setSuccess("Consultation request sent successfully!");
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
            alt="DentalCare dentist consultation"
          />
          <div className="consultation-hero__overlay">
            <form className="consultation-panel" onSubmit={handleSubmit}>
              {error && <p>{error}</p>}
              <div className="consultation-panel__header">
                <h1 id="consultation-title">Request a consultation</h1>
                <p>
                  Please leave your information and we will contact you
                  as soon as possible.
                </p>
              </div>

              <label className="consultation-panel__field">
                <span>Full name *</span>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  placeholder="Enter your full name"
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="consultation-panel__field">
                <span>Phone number *</span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  placeholder="Enter your contact phone number"
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="consultation-panel__field">
                <span>Email (optional)</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="Enter your email address"
                  onChange={handleChange}
                />
              </label>

              <label className="consultation-panel__field">
                <span>Consultation details *</span>
                <textarea
                  name="description"
                  value={form.description}
                  placeholder="Briefly describe your concern or the service you are interested in..."
                  rows="5"
                  onChange={handleChange}
                  required
                />
              </label>

              <button className="consultation-panel__submit" type="submit" disabled={isSubmitting}>
                <Send size={18} aria-hidden="true" />
                Submit request
              </button>

              <p className="consultation-panel__privacy">
                <LockKeyhole size={16} aria-hidden="true" />
                Your information is kept strictly confidential.
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
