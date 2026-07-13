import { Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import SiteFooter from "../../../components/layout/SiteFooter/SiteFooter";
import SiteHeader from "../../../components/layout/SiteHeader/SiteHeader";
import { serviceMetaIcons } from "../../../data/dentalServices";
import { useClinicInfo } from "../../../hooks/useClinicInfo";
import { usePublicServices } from "../../../hooks/useDentalServices";
import "./ServicesPage.css";

function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "Contact for pricing";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function ServicesPage() {
  const { DurationIcon, PriceIcon } = serviceMetaIcons;
  const { clinicInfo } = useClinicInfo();
  const { error, isLoading, services } = usePublicServices();
  const clinicName = clinicInfo?.clinic_name || "DentalCare";

  return (
    <div className="services-page">
      <SiteHeader brandName={clinicName} />

      <main className="services-page__main">
        <section className="services-catalog" aria-labelledby="services-title">
          <div className="services-catalog__header">
            <h1 id="services-title">Dịch vụ nha khoa</h1>
            <p>
              Dịch vụ chăm sóc nha khoa chuyên nghiệp với đội ngũ nha sĩ giàu
              kinh nghiệm và trang thiết bị hiện đại.
            </p>
            <div className="services-catalog__actions">
              <Link to="/" className="services-catalog__link">
                Về trang chủ
              </Link>
              <Link
                to="/consultation"
                className="services-catalog__link services-catalog__link--primary"
              >
                Yêu cầu tư vấn
              </Link>
            </div>
          </div>

          {isLoading ? (
            <p className="services-catalog__state">
              Đang tải dịch vụ nha khoa...
            </p>
          ) : error ? (
            <p className="services-catalog__state services-catalog__state--error">
              Hiện không thể tải dịch vụ nha khoa. Vui lòng thử lại later.
            </p>
          ) : services.length === 0 ? (
            <p className="services-catalog__state">
              Hiện chưa có dịch vụ nha khoa nào.
            </p>
          ) : (
            <div className="services-catalog__grid">
              {services.map((service) => (
                <article className="services-card" key={service.id}>
                  <div className="services-card__icon">
                    <Stethoscope size={24} aria-hidden="true" />
                  </div>

                  <div className="services-card__body">
                    <h2>{service.name}</h2>
                    {service.category && (
                      <p className="services-card__category">
                        {service.category}
                      </p>
                    )}
                    <p>
                      {service.description ||
                        "Service details are being updated."}
                    </p>
                    {service.process && (
                      <p className="services-card__process">
                        Process: {service.process}
                      </p>
                    )}
                  </div>

                  <dl className="services-card__meta">
                    <div className="services-card__meta-row">
                      <dt>
                        <DurationIcon size={15} aria-hidden="true" />
                        Thời gian
                      </dt>
                      <dd>{service.duration} phút</dd>
                    </div>
                    <div className="services-card__meta-row">
                      <dt>
                        <PriceIcon size={15} aria-hidden="true" />
                        Chi phí
                      </dt>
                      <dd>{formatPrice(service.price)}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter clinicInfo={clinicInfo} />
    </div>
  );
}

export default ServicesPage;
