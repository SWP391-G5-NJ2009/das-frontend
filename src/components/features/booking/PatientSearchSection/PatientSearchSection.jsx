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
}) {
  return (
    <div className="patient-search">
      <div className="patient-search__row">
        {/* Search Field */}
        <div className="patient-search__field">
          <label htmlFor="patient-search-input" className="patient-search__label">
            {isReceptionist ? "Tìm bệnh nhân" : "Thông tin bệnh nhân"}
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
                    aria-label="Xóa bệnh nhân đã chọn"
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
                placeholder={isReceptionist ? "Tìm theo tên hoặc SĐT..." : "Họ tên bệnh nhân"}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoComplete="off"
                readOnly={!isReceptionist}
                aria-label="Tìm kiếm bệnh nhân"
              />
            )}

            {/* Dropdown results */}
            {isReceptionist && !selectedPatient && searchResults.length > 0 && (
              <ul className="patient-search__dropdown" role="listbox" aria-label="Kết quả tìm kiếm">
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
              aria-label="Thêm bệnh nhân mới"
            >
              <UserPlus size={14} aria-hidden="true" />
              Thêm bệnh nhân mới
            </button>
          )}
        </div>

        {/* Phone Field */}
        <div className="patient-search__field">
          <label htmlFor="patient-phone-input" className="patient-search__label">
            Số điện thoại
          </label>
          <div className="patient-search__input-wrapper">
            <input
              id="patient-phone-input"
              type="tel"
              className="patient-search__input patient-search__input--phone"
              placeholder="Tự động điền khi chọn bệnh nhân"
              value={phoneNumber}
              readOnly
              aria-label="Số điện thoại bệnh nhân"
            />
          </div>
        </div>
      </div>

      {isSearching && (
        <p className="patient-search__searching" aria-live="polite">
          Đang tìm kiếm...
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
};

PatientSearchSection.defaultProps = {
  selectedPatient: null,
  onAddNewPatient: null,
};

export default PatientSearchSection;
