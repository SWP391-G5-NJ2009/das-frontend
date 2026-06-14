import PropTypes from "prop-types";
import "./ServiceGrid.css";

function ServiceGrid({ services, selectedServiceId, onSelect }) {
  return (
    <div className="service-grid" role="list" aria-label="Danh sách dịch vụ nha khoa">
      {services.map((service) => {
        const isSelected = service.id === selectedServiceId;
        return (
          <button
            key={service.id}
            type="button"
            className={`service-grid__card${isSelected ? " service-grid__card--selected" : ""}`}
            onClick={() => onSelect(service)}
            aria-pressed={isSelected}
            aria-label={`${service.name}, thời gian ${service.duration} phút`}
            role="listitem"
          >
            <span className="service-grid__icon" aria-hidden="true">🦷</span>
            <span className="service-grid__name">{service.name}</span>
            <span className="service-grid__duration">{service.duration} phút</span>
          </button>
        );
      })}
    </div>
  );
}

ServiceGrid.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
      price: PropTypes.number,
    })
  ).isRequired,
  selectedServiceId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

ServiceGrid.defaultProps = {
  selectedServiceId: null,
};

export default ServiceGrid;
