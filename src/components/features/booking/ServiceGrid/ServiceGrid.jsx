import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { ChevronDown } from "lucide-react";
import "./ServiceGrid.css";

const ALL_CATEGORY = "__all__";

function ServiceGrid({ services, selectedServiceId, onSelect }) {
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);

  /* Build unique category list from services */
  const categories = useMemo(() => {
    const seen = new Set();
    return services
      .map((s) => s.category)
      .filter((cat) => cat && !seen.has(cat) && seen.add(cat));
  }, [services]);

  const filtered = useMemo(() => {
    if (selectedCategory === ALL_CATEGORY) return services;
    return services.filter((s) => s.category === selectedCategory);
  }, [services, selectedCategory]);

  return (
    <div className="service-grid__wrapper">
      {/* ── Category Dropdown ── */}
      {categories.length > 0 && (
        <div className="service-grid__filter-row">
          <div className="service-grid__select-wrapper">
            <select
              id="service-category-filter"
              className="service-grid__select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Lọc dịch vụ theo danh mục"
            >
              <option value={ALL_CATEGORY}>Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="service-grid__select-icon"
              aria-hidden="true"
            />
          </div>
        </div>
      )}

      {/* ── Service Cards ── */}
      <div className="service-grid" role="list" aria-label="Danh sách dịch vụ nha khoa">
        {filtered.length === 0 ? (
          <p className="service-grid__empty">Không có dịch vụ trong danh mục này.</p>
        ) : (
          filtered.map((service) => {
            const isSelected = service.id === selectedServiceId;
            return (
              <button
                key={service.id}
                type="button"
                className={`service-grid__card${isSelected ? " service-grid__card--selected" : ""}`}
                onClick={() => onSelect(service)}
                aria-pressed={isSelected}
                aria-label={`${service.name}, duration ${service.duration} minutes`}
                role="listitem"
              >
                <span className="service-grid__icon" aria-hidden="true">🦷</span>
                <span className="service-grid__name">{service.name}</span>
                <span className="service-grid__duration">{service.duration} minutes</span>
              </button>
            );
          })
        )}
      </div>
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
      category: PropTypes.string,
    })
  ).isRequired,
  selectedServiceId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

ServiceGrid.defaultProps = {
  selectedServiceId: null,
};

export default ServiceGrid;
