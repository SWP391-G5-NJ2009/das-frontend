import PropTypes from "prop-types";
import { usePublicServices } from "../../../../hooks/useDentalServices";
import Spinner from "../../../common/Spinner/Spinner";
import "./DentistServiceSelector.css";

function DentistServiceSelector({
  selectedIds,
  onChange,
  disabled,
  errorMessage,
  required,
}) {
  const { services, isLoading, error } = usePublicServices();

  const toggleService = (serviceId) => {
    const nextIds = selectedIds.includes(serviceId)
      ? selectedIds.filter((id) => id !== serviceId)
      : [...selectedIds, serviceId];
    onChange(nextIds);
  };

  return (
    <fieldset
      className="dentist-service-selector"
      aria-invalid={Boolean(errorMessage)}
    >
      <legend>
        Dịch vụ phụ trách {required && <strong>*</strong>}
      </legend>

      {isLoading && (
        <div className="dentist-service-selector__state">
          <Spinner />
        </div>
      )}
      {error && (
        <p className="dentist-service-selector__error">
          Không thể tải danh sách dịch vụ.
        </p>
      )}
      {!isLoading && !error && services.length === 0 && (
        <p className="dentist-service-selector__state">
          Chưa có dịch vụ đang hoạt động.
        </p>
      )}
      {!isLoading && !error && services.length > 0 && (
        <div className="dentist-service-selector__options">
          {services.map((service) => {
            const serviceId = String(service.id);
            return (
              <label key={serviceId}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(serviceId)}
                  onChange={() => toggleService(serviceId)}
                  disabled={disabled}
                />
                <span>{service.name}</span>
              </label>
            );
          })}
        </div>
      )}
      {errorMessage && (
        <small className="dentist-service-selector__error">{errorMessage}</small>
      )}
    </fieldset>
  );
}

DentistServiceSelector.propTypes = {
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  required: PropTypes.bool,
};

DentistServiceSelector.defaultProps = {
  disabled: false,
  errorMessage: "",
  required: false,
};

export default DentistServiceSelector;
