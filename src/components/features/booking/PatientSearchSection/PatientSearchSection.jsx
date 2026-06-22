import PropTypes from "prop-types";
import { Search, UserPlus, CheckCircle2, X } from "lucide-react";
import "./PatientSearchSection.css";

function PatientSearchSection({
  isReceptionist,
  searchQuery,
  onSearchChange,
  searchResults,
  selectedPatient,
  onSelectPatient,
  onClearPatient,
  onAddNewPatient,
  isSearching,
  phoneNumber,
  onPhoneChange,
}) {
  return (
    <div className="patient-search">
      <div className="patient-search__row">
        {/* Search Field */}
        <div className="patient-search__field">
          <label htmlFor="patient-search-input" className="patient-search__label">
            {isReceptionist ? "Find patient" : "Patient information"}
          </label>
          <div className="patient-search__input-wrapper">
            <Search size={16} className="patient-search__input-icon" aria-hidden="true" />
            {selectedPatient ? (
              <div className="patient-search__selected">
                <CheckCircle2 size={16} className="patient-search__selected-icon" aria-hidden="true" />
                <span className="patient-search__selected-name">{selectedPatient.fullName}</span>
                {isReceptionist && (
                  <button
                    type="button"
                    className="patient-search__clear-btn"
                    onClick={onClearPatient}
                    aria-label="Clear selected patient"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ) : (
              <input
                id="patient-search-input"
                type="text"
                className="patient-search__input"
                placeholder={isReceptionist ? "Search by name or phone..." : "Patient full name"}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoComplete="off"
                readOnly={!isReceptionist}
                aria-label="Search patients"
              />
            )}

            {/* Dropdown results */}
            {isReceptionist && !selectedPatient && searchResults.length > 0 && (
              <ul className="patient-search__dropdown" role="listbox" aria-label="Search results">
                {searchResults.map((p) => (
                  <li
                    key={p.id}
                    className="patient-search__dropdown-item"
                    role="option"
                    aria-selected="false"
                    onClick={() => onSelectPatient(p)}
                    onKeyDown={(e) => e.key === "Enter" && onSelectPatient(p)}
                    tabIndex={0}
                  >
                    <span className="patient-search__dropdown-name">{p.fullName}</span>
                    <span className="patient-search__dropdown-phone">{p.phone}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {isReceptionist && !selectedPatient && (
            <button
              type="button"
              className="patient-search__add-btn"
              onClick={onAddNewPatient}
              aria-label="Add new patient"
            >
              <UserPlus size={14} aria-hidden="true" />
              Add new patient
            </button>
          )}
        </div>

        {/* Phone Field */}
        <div className="patient-search__field">
          <label htmlFor="patient-phone-input" className="patient-search__label">
            Phone number
          </label>
          <div className="patient-search__input-wrapper">
            <input
              id="patient-phone-input"
              type="tel"
              className="patient-search__input patient-search__input--phone"
              placeholder={isReceptionist ? "Auto-filled when patient is selected" : "Auto-filled from your profile"}
              value={phoneNumber}
              readOnly
              aria-label="Patient phone number"
            />
          </div>
        </div>
      </div>

      {isSearching && (
        <p className="patient-search__searching" aria-live="polite">
          Searching...
        </p>
      )}
    </div>
  );
}

PatientSearchSection.propTypes = {
  isReceptionist: PropTypes.bool.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchResults: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedPatient: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }),
  onSelectPatient: PropTypes.func.isRequired,
  onClearPatient: PropTypes.func.isRequired,
  onAddNewPatient: PropTypes.func,
  isSearching: PropTypes.bool.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  onPhoneChange: PropTypes.func,
};

PatientSearchSection.defaultProps = {
  selectedPatient: null,
  onAddNewPatient: null,
  onPhoneChange: null,
};

export default PatientSearchSection;
