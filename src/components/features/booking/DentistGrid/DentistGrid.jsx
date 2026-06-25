import PropTypes from "prop-types";
import "./DentistGrid.css";

function DentistGrid({ dentists, selectedDentistId, onSelect }) {
  if (!dentists || dentists.length === 0) {
    return (
      <p className="dentist-grid__empty">
        Please select a service first to see suitable dentists.
      </p>
    );
  }

  return (
    <div className="dentist-grid" role="list" aria-label="Dentist list">
      {dentists.map((dentist) => {
        const isSelected = dentist.id === selectedDentistId;
        return (
          <button
            key={dentist.id}
            type="button"
            className={`dentist-grid__card${isSelected ? " dentist-grid__card--selected" : ""}`}
            onClick={() => onSelect(dentist)}
            aria-pressed={isSelected}
            aria-label={`Select ${dentist.fullName}, ${dentist.specialization}`}
            role="listitem"
          >
            <div className="dentist-grid__info">
              <span className="dentist-grid__name">{dentist.fullName}</span>
              <span className="dentist-grid__spec">{dentist.specialization}</span>
            </div>
            {isSelected && (
              <span className="dentist-grid__check" aria-hidden="true">✓</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

DentistGrid.propTypes = {
  dentists: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      specialization: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedDentistId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

DentistGrid.defaultProps = {
  selectedDentistId: null,
};

export default DentistGrid;
