import PropTypes from "prop-types";
import { Search } from "lucide-react";
import "./PaymentFilters.css";

function PaymentFilters({ filters, onChange }) {
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
            placeholder="Mã hóa đơn, tên khách hàng..."
            type="search"
            value={filters.keyword}
          />
        </div>
      </label>

      <label className="payment-filters__field">
        <span>Trạng thái</span>
        <select name="status" onChange={updateFilter} value={filters.status}>
          <option value="all">Tất cả</option>
          <option value="paid">Đã thanh toán</option>
          <option value="unpaid">Chưa thanh toán</option>
        </select>
      </label>

      <label className="payment-filters__field">
        <span>Từ ngày thanh toán</span>
        <input name="fromDate" onChange={updateFilter} type="date" value={filters.fromDate} />
      </label>

      <label className="payment-filters__field">
        <span>Đến ngày thanh toán</span>
        <input name="toDate" onChange={updateFilter} type="date" value={filters.toDate} />
      </label>
    </form>
  );
}

PaymentFilters.propTypes = {
  filters: PropTypes.shape({
    fromDate: PropTypes.string.isRequired,
    keyword: PropTypes.string.isRequired,
    status: PropTypes.oneOf(["all", "paid", "unpaid"]).isRequired,
    toDate: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PaymentFilters;
