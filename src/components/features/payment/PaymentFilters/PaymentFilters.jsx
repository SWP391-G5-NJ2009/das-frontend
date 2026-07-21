import PropTypes from "prop-types";
import { Search, RotateCcw } from "lucide-react";
import "./PaymentFilters.css";

function PaymentFilters({ filters, methods, onChange, onReset }) {
  const updateFilter = (event) => {
    onChange({ ...filters, [event.target.name]: event.target.value });
  };

  return (
    <form className="payment-filters" onSubmit={(event) => event.preventDefault()}>
      <label className="payment-filters__field payment-filters__field--search">
        <span>Tìm kiếm</span>
        <div className="payment-filters__search-control">
          <Search aria-hidden="true" size={18} />
          <input
            name="keyword"
            onChange={updateFilter}
            placeholder="Mã hóa đơn..."
            type="search"
            value={filters.keyword}
          />
        </div>
      </label>

      <label className="payment-filters__field">
        <span>Từ ngày</span>
        <input name="fromDate" onChange={updateFilter} type="date" value={filters.fromDate} />
      </label>

      <label className="payment-filters__field">
        <span>Đến ngày</span>
        <input name="toDate" onChange={updateFilter} type="date" value={filters.toDate} />
      </label>
    </form>
  );
}

PaymentFilters.propTypes = {
  filters: PropTypes.shape({
    fromDate: PropTypes.string.isRequired,
    keyword: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    toDate: PropTypes.string.isRequired,
  }).isRequired,
  methods: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default PaymentFilters;
