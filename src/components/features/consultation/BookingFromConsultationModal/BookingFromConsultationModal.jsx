import { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { X, CalendarClock, Stethoscope, UserCheck, User } from "lucide-react";

import {
  usePublicServices,
  useDentistsByService,
} from "../../../../hooks/useDentalServices";
import { useAvailableSlots } from "../../../../hooks/useAvailableSlots";
import { appointmentService } from "../../../../services/appointment.service";

import ServiceGrid from "../../booking/ServiceGrid/ServiceGrid";
import DentistGrid from "../../booking/DentistGrid/DentistGrid";
import DateTimePicker from "../../booking/DateTimePicker/DateTimePicker";
import BookingSummary from "../../booking/BookingSummary/BookingSummary";
import BookingStepHeader from "../../booking/BookingStepHeader/BookingStepHeader";
import Spinner from "../../../common/Spinner/Spinner";

import "./BookingFromConsultationModal.css";

function BookingFromConsultationModal({ request, onClose, onSuccess }) {
  const selectedPatient = useMemo(
    () => ({
      id: `new-${Date.now()}`,
      fullName: request.full_name || "",
      phone: request.phone || "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [request.id],
  );

  const [selectedService, setSelectedService] = useState(null);
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const {
    services,
    isLoading: isServicesLoading,
    error: servicesError,
  } = usePublicServices();

  const {
    dentists,
    isLoading: isDentistsLoading,
    error: dentistsError,
  } = useDentistsByService(selectedService?.id ?? null);

  const {
    slots,
    isLoading: isSlotsLoading,
    error: slotsError,
    refetch: refetchSlots,
  } = useAvailableSlots(selectedDentist?.id ?? null, selectedDate ?? null);

  const handleSelectService = useCallback((service) => {
    setSelectedService(service);
    setSelectedDentist(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setSubmitError(null);
  }, []);

  const handleSelectDentist = useCallback((dentist) => {
    setSelectedDentist(dentist);
    setSelectedDate(null);
    setSelectedSlot(null);
  }, []);

  const handleSelectDate = useCallback((date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  }, []);

  const handleSelectSlot = useCallback(
    (slot) => {
      const slotOccupied = selectedService?.slotOccupied ?? 1;
      if (slotOccupied > 1) {
        const startIdx = slots.findIndex((s) => s.id === slot.id);
        let lastIdx = startIdx;
        for (let k = 1; k < slotOccupied; k++) {
          const nextIdx = lastIdx + 1;
          if (nextIdx >= slots.length) break;
          const prevTimeEnd = slots[lastIdx]?.timeEnd;
          const nextTime = slots[nextIdx]?.time;
          if (!prevTimeEnd || !nextTime || prevTimeEnd !== nextTime) break;
          lastIdx = nextIdx;
        }
        const lastSlot = slots[lastIdx];
        setSelectedSlot({
          ...slot,
          timeEnd: lastSlot?.timeEnd || slot.timeEnd,
        });
      } else {
        setSelectedSlot(slot);
      }
    },
    [selectedService, slots],
  );

  const handleConfirm = useCallback(async () => {
    if (!selectedService || !selectedDentist || !selectedDate || !selectedSlot) {
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await appointmentService.book({
        slotId: Number(selectedSlot.id),
        serviceId: Number(selectedService.id),
        slotOccupied: selectedService.slotOccupied ?? 1,
        note: "",
        newPatient: {
          fullName: selectedPatient.fullName,
          phone: selectedPatient.phone,
        },
      });
      onSuccess();
    } catch (err) {
      if (err?.code === "SLOT_TAKEN") {
        setSelectedSlot(null);
        refetchSlots();
        setSubmitError(
          "Khung giờ này vừa được đặt bởi người dùng khác. Danh sách giờ trống đã được cập nhật — vui lòng chọn giờ khác.",
        );
      } else {
        setSubmitError(err?.message || "Đặt lịch thất bại. Vui lòng thử lại!");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedPatient,
    selectedService,
    selectedDentist,
    selectedDate,
    selectedSlot,
    refetchSlots,
    onSuccess,
  ]);

  return (
    <div
      className="bfc-modal__overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bfc-modal-title"
    >
      <div className="bfc-modal">
        <div className="bfc-modal__header">
          <div className="bfc-modal__title-row">
            <CalendarClock size={20} aria-hidden="true" className="bfc-modal__title-icon" />
            <h2 id="bfc-modal-title" className="bfc-modal__title">
              Đặt lịch hẹn từ yêu cầu tư vấn
            </h2>
          </div>
          <button className="bfc-modal__close" type="button" onClick={onClose} aria-label="Đóng">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="bfc-modal__patient-banner">
          <User size={16} aria-hidden="true" className="bfc-modal__patient-icon" />
          <span className="bfc-modal__patient-label">Bệnh nhân:</span>
          <span className="bfc-modal__patient-name">{selectedPatient.fullName}</span>
          <span className="bfc-modal__patient-sep">·</span>
          <span className="bfc-modal__patient-phone">{selectedPatient.phone}</span>
          <span className="bfc-modal__patient-badge">Khách mới</span>
        </div>

        {submitError && (
          <div className="bfc-modal__error" role="alert">
            {submitError}
          </div>
        )}

        <div className="bfc-modal__body">
          <div className="bfc-modal__form-col">
            <section className="bfc-modal__step-card">
              <BookingStepHeader step={1} title="Chọn dịch vụ" icon={Stethoscope} />
              {isServicesLoading && <Spinner />}
              {servicesError && (
                <p className="bfc-modal__locked-msg">Không thể tải danh sách dịch vụ. Vui lòng thử lại.</p>
              )}
              {!isServicesLoading && !servicesError && (
                <ServiceGrid services={services} selectedServiceId={selectedService?.id || null} onSelect={handleSelectService} />
              )}
            </section>

            <section
              className={`bfc-modal__step-card${!selectedService ? " bfc-modal__step-card--locked" : ""}`}
            >
              <BookingStepHeader step={2} title="Chọn nha sĩ" icon={UserCheck} />
              {isDentistsLoading && <Spinner />}
              {dentistsError && (
                <p className="bfc-modal__locked-msg">Không thể tải nha sĩ. Vui lòng thử lại.</p>
              )}
              {!isDentistsLoading && !dentistsError && (
                <DentistGrid dentists={dentists} selectedDentistId={selectedDentist?.id || null} onSelect={handleSelectDentist} />
              )}
            </section>

            <section
              className={`bfc-modal__step-card${!selectedDentist ? " bfc-modal__step-card--locked" : ""}`}
            >
              <BookingStepHeader step={3} title="Chọn ngày và giờ" icon={CalendarClock} />
              {!selectedDentist ? (
                <p className="bfc-modal__locked-msg">Vui lòng chọn nha sĩ trước để xem khung giờ trống.</p>
              ) : (
                <>
                  {isSlotsLoading && <Spinner />}
                  {slotsError && (
                    <p className="bfc-modal__locked-msg">Không thể tải khung giờ trống. Vui lòng thử lại.</p>
                  )}
                  {!isSlotsLoading && !slotsError && (
                    <DateTimePicker
                      selectedDate={selectedDate}
                      onSelectDate={handleSelectDate}
                      selectedSlotId={selectedSlot?.id || null}
                      onSelectSlot={handleSelectSlot}
                      slots={slots}
                      enforceTimingRule={false}
                      slotOccupied={selectedService?.slotOccupied ?? 1}
                    />
                  )}
                </>
              )}
            </section>
          </div>

          <div className="bfc-modal__sidebar-col">
            <BookingSummary
              patient={selectedPatient}
              service={selectedService}
              dentist={selectedDentist}
              date={selectedDate}
              slot={selectedSlot}
              onConfirm={handleConfirm}
              onCancel={onClose}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

BookingFromConsultationModal.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.string.isRequired,
    full_name: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default BookingFromConsultationModal;
