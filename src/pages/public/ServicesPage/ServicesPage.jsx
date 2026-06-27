import { useState, useEffect } from "react";
import SiteFooter from "../../../components/layout/SiteFooter/SiteFooter";
import SiteHeader from "../../../components/layout/SiteHeader/SiteHeader";
import { dentalServiceService } from "../../../services/dentalService.service";
import "./ServicesPage.css";

function ServicesPage() {
  const [activeServices, setActiveServices] = useState([]);

  useEffect(() => {
    dentalServiceService.getAll()
      .then((data) => {
        const active = (data || []).filter(
          (s) => s.status?.toLowerCase() === "active"
        );
        setActiveServices(active);
      })
      .catch(() => {
        // Silently fail — page simply shows no services
      });
  }, []);

  return (
    <div className="services-page">
      <SiteHeader />

      <main className="services-page__main">
        <section className="services-catalog" aria-labelledby="services-title">
          <div className="services-catalog__header">
            <h1 id="services-title">Dental Services</h1>
            <p>
              Comprehensive oral health care with an expert team
              and modern equipment.
            </p>
          </div>

          <div className="services-catalog__grid">
            {activeServices.map((s) => (
              <article className="services-card" key={s.service_id}>
                <div className="services-card__body">
                  <h2>{s.service_name}</h2>
                  <p>{s.description || ""}</p>
                </div>

                <dl className="services-card__meta">
                  <div className="services-card__meta-row">
                    <dt>Duration</dt>
                    <dd>{(s.slot_occupied ?? 1) * 30} min</dd>
                  </div>
                  <div className="services-card__meta-row">
                    <dt>Cost</dt>
                    <dd>
                      {s.unit_price != null
                        ? s.unit_price.toLocaleString("vi-VN") + " ₫"
                        : "—"}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default ServicesPage;
