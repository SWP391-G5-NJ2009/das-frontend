import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Plus, Trash2, X } from "lucide-react";
import "./TreatmentRecordModal.css";

const EMPTY_MEDICINE = { medicineId: "", dosage: "", quantity: 1 };

function TreatmentRecordModal({
  appointment,
  error,
  medicines,
  medicinesError,
  isLoadingMedicines,
  isSubmitting,
  onClose,
  onSubmit,
}) {
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentNote, setTreatmentNote] = useState("");
  const [prescriptionNote, setPrescriptionNote] = useState("");
  const [prescriptionItems, setPrescriptionItems] = useState([]);

  useEffect(() => {
    const closeOnEscape = (event) =>
      event.key === "Escape" && !isSubmitting && onClose();
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isSubmitting, onClose]);

  const medicineById = useMemo(
    () =>
      new Map(
        medicines.map((medicine) => [String(medicine.medicine_id), medicine]),
      ),
    [medicines],
  );

  const updateItem = (index, field, value) => {
    setPrescriptionItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      diagnosis,
      treatmentNote,
      prescriptionNote,
      medicines: prescriptionItems.map((item) => ({
        medicineId: Number(item.medicineId),
        dosage: item.dosage,
        quantity: Number(item.quantity),
      })),
    });
  };

  return (
    <div
      className="treatment-record__overlay"
      onMouseDown={(event) =>
        event.target === event.currentTarget && !isSubmitting && onClose()
      }
      role="presentation"
    >
      <section
        aria-labelledby="treatment-record-title"
        aria-modal="true"
        className="treatment-record"
        role="dialog"
      >
        <header className="treatment-record__header">
          <div>
            <h2 id="treatment-record-title">Ghi kết quả điều trị</h2>
            <p>
              {appointment.patientName} · {appointment.serviceName}
            </p>
          </div>
          <button
            aria-label="Đóng"
            className="treatment-record__close"
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            <X />
          </button>
        </header>

        <form className="treatment-record__body" onSubmit={submit}>
          <label className="treatment-record__field">
            <span>
              Chẩn đoán <b aria-hidden="true">*</b>
            </span>
            <textarea
              maxLength={1000}
              onChange={(event) => setDiagnosis(event.target.value)}
              placeholder="Nhập chẩn đoán của bác sĩ..."
              required
              rows={3}
              value={diagnosis}
            />
          </label>
          <label className="treatment-record__field">
            <span>
              Nội dung điều trị <b aria-hidden="true">*</b>
            </span>
            <textarea
              maxLength={2000}
              onChange={(event) => setTreatmentNote(event.target.value)}
              placeholder="Mô tả quá trình và kết quả điều trị..."
              required
              rows={5}
              value={treatmentNote}
            />
          </label>

          <section
            className="treatment-record__prescription"
            aria-labelledby="prescription-title"
          >
            <div className="treatment-record__section-heading">
              <button
                className="treatment-record__add-medicine"
                disabled={
                  isLoadingMedicines ||
                  medicines.length === 0 ||
                  prescriptionItems.length >= medicines.length
                }
                onClick={() =>
                  setPrescriptionItems((current) => [
                    ...current,
                    { ...EMPTY_MEDICINE },
                  ])
                }
                type="button"
              >
                <Plus size={18} aria-hidden="true" /> Thêm thuốc
              </button>
            </div>

            {isLoadingMedicines && (
              <p className="treatment-record__medicine-state">
                Đang tải danh sách thuốc...
              </p>
            )}
            {!isLoadingMedicines && medicinesError && (
              <p className="treatment-record__error" role="alert">
                {medicinesError.message}
              </p>
            )}
            {!isLoadingMedicines &&
              !medicinesError &&
              medicines.length === 0 && (
                <p className="treatment-record__medicine-state">
                  Hiện không có thuốc đang hoạt động.
                </p>
              )}

            {prescriptionItems.map((item, index) => {
              const selectedMedicine = medicineById.get(
                String(item.medicineId),
              );
              const selectedIds = new Set(
                prescriptionItems
                  .filter((_, itemIndex) => itemIndex !== index)
                  .map((row) => String(row.medicineId)),
              );
              return (
                <div
                  className="treatment-record__medicine-row"
                  key={`medicine-${index + 1}`}
                >
                  <label className="treatment-record__field treatment-record__field--medicine">
                    <span>
                      Thuốc <b aria-hidden="true">*</b>
                    </span>
                    <select
                      onChange={(event) =>
                        updateItem(index, "medicineId", event.target.value)
                      }
                      required
                      value={item.medicineId}
                    >
                      <option value="">Chọn thuốc</option>
                      {medicines.map((medicine) => (
                        <option
                          disabled={selectedIds.has(
                            String(medicine.medicine_id),
                          )}
                          key={medicine.medicine_id}
                          value={medicine.medicine_id}
                        >
                          {medicine.name} 
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="treatment-record__field treatment-record__field--dosage">
                    <span>
                      Liều dùng <b aria-hidden="true">*</b>
                    </span>
                    <input
                      maxLength={255}
                      onChange={(event) =>
                        updateItem(index, "dosage", event.target.value)
                      }
                      placeholder="VD: 1 viên x 2 lần/ngày"
                      required
                      value={item.dosage}
                    />
                  </label>
                  <label className="treatment-record__field treatment-record__field--quantity">
                    <span>
                      Số lượng <b aria-hidden="true">*</b>
                    </span>
                    <input
                      max={selectedMedicine?.stock_quantity || undefined}
                      min="1"
                      onChange={(event) =>
                        updateItem(index, "quantity", event.target.value)
                      }
                      required
                      type="number"
                      value={item.quantity}
                    />
                  </label>
                  <button
                    aria-label={`Xóa thuốc dòng ${index + 1}`}
                    className="treatment-record__remove-medicine"
                    onClick={() =>
                      setPrescriptionItems((current) =>
                        current.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    type="button"
                  >
                    <Trash2 size={18} />
                  </button>
                  {selectedMedicine && (
                    <p className="treatment-record__medicine-meta">
                      {Number(selectedMedicine.unit_price).toLocaleString(
                        "vi-VN",
                      )}
                      đ/{selectedMedicine.unit} · Thành tiền:{" "}
                      {(
                        Number(selectedMedicine.unit_price) *
                        Number(item.quantity || 0)
                      ).toLocaleString("vi-VN")}
                      đ
                    </p>
                  )}
                </div>
              );
            })}

            {prescriptionItems.length > 0 && (
              <label className="treatment-record__field">
                <span>Ghi chú đơn thuốc</span>
                <textarea
                  maxLength={1000}
                  onChange={(event) => setPrescriptionNote(event.target.value)}
                  placeholder="Dặn dò chung khi sử dụng thuốc..."
                  rows={3}
                  value={prescriptionNote}
                />
              </label>
            )}
          </section>

          {error && (
            <p className="treatment-record__error" role="alert">
              {error.message}
            </p>
          )}
          <footer className="treatment-record__actions">
            <button
              className="treatment-record__button treatment-record__button--cancel"
              disabled={isSubmitting}
              onClick={onClose}
              type="button"
            >
              Hủy
            </button>
            <button
              className="treatment-record__button treatment-record__button--submit"
              disabled={isSubmitting || isLoadingMedicines}
              type="submit"
            >
              {isSubmitting ? "Đang lưu..." : "Hoàn tất điều trị"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

const medicineShape = PropTypes.shape({
  medicine_id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  unit_price: PropTypes.number.isRequired,
  stock_quantity: PropTypes.number.isRequired,
});

TreatmentRecordModal.propTypes = {
  appointment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    patientName: PropTypes.string.isRequired,
    serviceName: PropTypes.string.isRequired,
  }).isRequired,
  error: PropTypes.instanceOf(Error),
  medicines: PropTypes.arrayOf(medicineShape).isRequired,
  medicinesError: PropTypes.instanceOf(Error),
  isLoadingMedicines: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

TreatmentRecordModal.defaultProps = { error: null, medicinesError: null };

export default TreatmentRecordModal;
