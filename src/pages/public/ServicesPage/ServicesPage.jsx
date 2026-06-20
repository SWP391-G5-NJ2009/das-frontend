import SiteFooter from "../../../components/layout/SiteFooter/SiteFooter";
import SiteHeader from "../../../components/layout/SiteHeader/SiteHeader";
import { dentalServices, serviceMetaIcons } from "../../../data/dentalServices";
import "./ServicesPage.css";

function ServicesPage() {
  const { DurationIcon, PriceIcon } = serviceMetaIcons;

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
            {dentalServices.map(({ title, description, duration, price, Icon }) => (
              <article className="services-card" key={title}>
                <div className="services-card__icon">
                  <Icon size={24} aria-hidden="true" />
                </div>

                <div className="services-card__body">
                  <h2>{title}</h2>
                  <p>{description}</p>
                </div>

                <dl className="services-card__meta">
                  <div className="services-card__meta-row">
                    <dt>
                      <DurationIcon size={15} aria-hidden="true" />
                      Time
                    </dt>
                    <dd>{duration}</dd>
                  </div>
                  <div className="services-card__meta-row">
                    <dt>
                      <PriceIcon size={15} aria-hidden="true" />
                      Cost
                    </dt>
                    <dd>{price}</dd>
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
