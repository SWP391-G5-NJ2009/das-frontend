import PropTypes from "prop-types";
import {
  User,
  Stethoscope,
  UserCheck,
  CalendarClock,
  Info,
  Tag,
} from "lucide-react";
import "./BookingSummary.css";

function BookingSummary({
  patient,
  service,
  dentist,
  date,
  slot,
  onConfirm,
  onCancel,
  isSubmitting,
}) {
  const hasAll = patient && service && dentist && date && slot;

  const formattedDate = date
    ? date.toLocaleDateString("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  const formattedFee = service?.price
    ? new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(service.price)
    : null;

  return (
    <aside className="booking-summary" aria-label="Tóm tắt lịch hẹn">
      <div className="booking-summary__header">
        <CalendarClock size={18} aria-hidden="true" />
        <h3 className="booking-summary__title">Tóm tắt lịch hẹn</h3>
      </div>

      <div className="booking-summary__body">
        {/* Patient */}
        <div
          className={`booking-summary__row${patient ? "" : " booking-summary__row--empty"}`}
        >
          <div className="booking-summary__row-icon" aria-hidden="true">
            <User size={16} />
          </div>
          <div className="booking-summary__row-content">
            <span className="booking-summary__row-label">BỆNH NHÂN</span>
            {patient ? (
              <>
                <span className="booking-summary__row-value">
                  {patient.fullName}
                </span>
                <span className="booking-summary__row-sub">
                  {patient.phone}
                </span>
              </>
            ) : (
              <span className="booking-summary__row-placeholder">
                Chưa chọn bệnh nhân
              </span>
            )}
          </div>
        </div>

        {/* Service */}
        <div
          className={`booking-summary__row${service ? "" : " booking-summary__row--empty"}`}
        >
          <div className="booking-summary__row-icon" aria-hidden="true">
            <Stethoscope size={16} />
          </div>
          <div className="booking-summary__row-content">
            <span className="booking-summary__row-label">DỊCH VỤ</span>
            {service ? (
              <>
                <span className="booking-summary__row-value">
                  {service.name}
                </span>
                <span className="booking-summary__row-sub">
                  {service.duration} phút
                </span>
              </>
            ) : (
              <span className="booking-summary__row-placeholder">
                Chưa chọn dịch vụ
              </span>
            )}
          </div>
        </div>

        {/* Dentist */}
        <div
          className={`booking-summary__row${dentist ? "" : " booking-summary__row--empty"}`}
        >
          <div className="booking-summary__row-icon" aria-hidden="true">
            <UserCheck size={16} />
          </div>
          <div className="booking-summary__row-content">
            <span className="booking-summary__row-label">NHA SĨ</span>
            {dentist ? (
              <span className="booking-summary__row-value">
                {dentist.fullName}
              </span>
            ) : (
              <span className="booking-summary__row-placeholder">
                Chưa chọn nha sĩ
              </span>
            )}
          </div>
        </div>

        {/* Date & Time */}
        <div
          className={`booking-summary__row${date && slot ? "" : " booking-summary__row--empty"}`}
        >
          <div className="booking-summary__row-icon" aria-hidden="true">
            <CalendarClock size={16} />
          </div>
          <div className="booking-summary__row-content">
            <span className="booking-summary__row-label">NGÀY & GIỜ</span>
            {date && slot ? (
              <span className="booking-summary__row-value">
                {slot.time}{slot.timeEnd ? ` – ${slot.timeEnd}` : ""}, {formattedDate}
              </span>
            ) : (
              <span className="booking-summary__row-placeholder">
                Chưa chọn ngày/giờ
              </span>
            )}
          </div>
        </div>

        {/* Fee */}
        {formattedFee && (
          <div className="booking-summary__fee">
            <div className="booking-summary__fee-header">
              <Tag size={14} aria-hidden="true" className="booking-summary__fee-icon" />
              <span className="booking-summary__fee-label">GIÁ DỊCH VỤ</span>
            </div>
            <div className="booking-summary__fee-body">
              <span className="booking-summary__fee-service-name">
                {service.name}
              </span>
              <span className="booking-summary__fee-value">{formattedFee}</span>
            </div>
            <p className="booking-summary__fee-note">
              * Giá trên là mức tham khảo cho dịch vụ. Chi phí thực tế có thể
              thay đổi tùy theo tình trạng răng miệng của bệnh nhân.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="booking-summary__actions">
        <button
          type="button"
          id="confirm-booking-btn"
          className="booking-summary__confirm-btn"
          onClick={onConfirm}
          disabled={!hasAll || isSubmitting}
          aria-disabled={!hasAll || isSubmitting}
        >
          {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt lịch"}
        </button>
        <button
          type="button"
          id="cancel-booking-btn"
          className="booking-summary__cancel-btn"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Hủy
        </button>
      </div>

      {/* Notice */}
      <div className="booking-summary__notice" role="note">
        <Info size={14} aria-hidden="true" />
        <p className="booking-summary__notice-text">
          Hệ thống sẽ tự động gửi email xác nhận đặt lịch đến
          địa chỉ email của bệnh nhân sau khi bạn bấm Xác nhận.
        </p>
      </div>
    </aside>
  );
}

BookingSummary.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
  }),
  service: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    price: PropTypes.number,
  }),
  dentist: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
  }),
  date: PropTypes.instanceOf(Date),
  slot: PropTypes.shape({
    id: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    timeEnd: PropTypes.string,
  }),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

BookingSummary.defaultProps = {
  patient: null,
  service: null,
  dentist: null,
  date: null,
  slot: null,
};

export default BookingSummary;
