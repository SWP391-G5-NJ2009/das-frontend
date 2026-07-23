import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Stethoscope,
  UserCheck,
  CalendarClock,
  PlusCircle,
} from "lucide-react";
import PropTypes from "prop-types";

import {
  usePublicServices,
  useDentistsByService,
} from "../../../hooks/useDentalServices";
import { useAuth } from "../../../context/AuthContext";
import { usePatientSearch } from "../../../hooks/usePatientSearch";
import { useAvailableSlots } from "../../../hooks/useAvailableSlots";
import { usePatientBookedTimes } from "../../../hooks/usePatientBookedTimes";
import { appointmentService } from "../../../services/appointment.service";
import PatientSearchSection from "../../../components/features/booking/PatientSearchSection/PatientSearchSection";
import ServiceGrid from "../../../components/features/booking/ServiceGrid/ServiceGrid";
import DentistGrid from "../../../components/features/booking/DentistGrid/DentistGrid";
import DateTimePicker from "../../../components/features/booking/DateTimePicker/DateTimePicker";
import BookingSummary from "../../../components/features/booking/BookingSummary/BookingSummary";
import BookingStepHeader from "../../../components/features/booking/BookingStepHeader/BookingStepHeader";
import AddPatientModal from "../../../components/features/patient/AddPatientModal/AddPatientModal";
import Spinner from "../../../components/common/Spinner/Spinner";

import "./BookAppointmentPage.css";

function BookAppointmentPage({ isReceptionist, Shell }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    services,
    isLoading: isServicesLoading,
    error: servicesError,
  } = usePublicServices();

  const {
    searchQuery,
    searchResults,
    isSearching,
    selectedPatient,
    setSelectedPatient,
    handleSearchChange,
    handleSelectPatient,
    handleClearPatient,
  } = usePatientSearch();

  useEffect(() => {
    if (!isReceptionist && user) {
      setSelectedPatient({
        id: user.profileId,
        fullName: user.fullName,
        phone: user.phone || "",
      });
    }
  }, [isReceptionist, user, setSelectedPatient]);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

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

  const { bookedTimeSet, refetch: refetchBookedTimes } = usePatientBookedTimes(
    !isReceptionist,
    isReceptionist ? selectedPatient?.id ?? null : null,
  );

  const phoneNumber = selectedPatient?.phone || "";

  const handleSaveNewPatient = useCallback(
    (newPatient) => {
      // newPatient đã có id thật từ server (walk-in đã được lưu vào DB)
      setSelectedPatient(newPatient);
    },
    [setSelectedPatient],
  );

  const handlePhoneChange = useCallback(
    (phone) => {
      setSelectedPatient((prev) => (prev ? { ...prev, phone } : prev));
    },
    [setSelectedPatient],
  );

  const handleSelectService = useCallback((service) => {
    setSelectedService(service);
    setSelectedDentist(null);
    setSelectedDate(null);
    setSelectedSlot(null);
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

  const handleCancel = useCallback(() => {
    if (isReceptionist) {
      navigate("/receptionist/appointments");
    } else {
      navigate("/patient/appointments");
    }
  }, [navigate, isReceptionist]);

  const handleConfirm = useCallback(async () => {
    if (
      !selectedPatient ||
      !selectedService ||
      !selectedDentist ||
      !selectedDate ||
      !selectedSlot
    ) {
      return;
    }
    setIsSubmitting(true);
    try {
      await appointmentService.book({
        slotId: Number(selectedSlot.id),
        serviceId: Number(selectedService.id),
        note: "",
        slotOccupied: selectedService.slotOccupied ?? 1,
        ...(isReceptionist ? { patientId: Number(selectedPatient.id) } : {}),
      });
      alert("Đặt lịch hẹn thành công!");
      if (isReceptionist) {
        navigate("/receptionist/appointments");
      } else {
        navigate("/patient/appointments");
      }
    } catch (err) {
      if (err?.code === "SLOT_TAKEN") {
        setSelectedSlot(null);
        refetchSlots();
        alert(
          "Khung giờ này vừa được đặt bởi người dùng khác.\n" +
            "Danh sách giờ trống đã được cập nhật — vui lòng chọn giờ khác.",
        );
      } else if (err?.code === "DUPLICATE_SLOT_BOOKING") {
        setSelectedSlot(null);
        refetchSlots();
        refetchBookedTimes();
        alert(
          "Bệnh nhân vừa có một lịch hẹn được đặt vào khung giờ này.\n" +
            "Danh sách giờ đã được cập nhật — vui lòng chọn giờ khác.",
        );
      } else {
        alert(err?.message || "Đặt lịch thất bại. Vui lòng thử lại!");
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
    navigate,
    isReceptionist,
    refetchSlots,
    refetchBookedTimes,
  ]);

  const content = (
    <div className="book-appointment">
      <div className="book-appointment__heading-row">
        <PlusCircle
          size={22}
          className="book-appointment__heading-icon"
          aria-hidden="true"
        />
        <h1
          id="book-appointment-title"
          className="book-appointment__page-title"
        >
          Đặt lịch hẹn mới
        </h1>
      </div>

      <div className="book-appointment__layout">
        <div className="book-appointment__form-col">
          <section
            className="book-appointment__step-card"
            aria-labelledby="step-patient-label"
          >
            <BookingStepHeader
              step={1}
              title="Thông tin bệnh nhân"
              icon={User}
            />
            <PatientSearchSection
              isReceptionist={isReceptionist}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              searchResults={searchResults}
              selectedPatient={selectedPatient}
              onSelectPatient={handleSelectPatient}
              onClearPatient={handleClearPatient}
              onAddNewPatient={
                isReceptionist ? () => setIsAddPatientModalOpen(true) : null
              }
              isSearching={isSearching}
              phoneNumber={phoneNumber}
              onPhoneChange={!isReceptionist ? handlePhoneChange : undefined}
            />
          </section>

          <section
            className="book-appointment__step-card"
            aria-labelledby="step-service-label"
          >
            <BookingStepHeader
              step={2}
              title="Chọn dịch vụ"
              icon={Stethoscope}
            />
            {isServicesLoading && <Spinner />}
            {servicesError && (
              <p className="book-appointment__locked-msg">
                Không thể tải danh sách dịch vụ. Vui lòng thử lại.
              </p>
            )}
            {!isServicesLoading && !servicesError && (
              <ServiceGrid
                services={services}
                selectedServiceId={selectedService?.id || null}
                onSelect={handleSelectService}
              />
            )}
          </section>

          <section
            className={`book-appointment__step-card${!selectedService ? " book-appointment__step-card--locked" : ""}`}
            aria-labelledby="step-dentist-label"
          >
            <BookingStepHeader step={3} title="Chọn nha sĩ" icon={UserCheck} />
            {isDentistsLoading && <Spinner />}
            {dentistsError && (
              <p className="book-appointment__locked-msg">
                Không thể tải nha sĩ cho dịch vụ này. Vui lòng thử lại.
              </p>
            )}
            {!isDentistsLoading && !dentistsError && (
              <DentistGrid
                dentists={dentists}
                selectedDentistId={selectedDentist?.id || null}
                onSelect={handleSelectDentist}
              />
            )}
          </section>

          <section
            className={`book-appointment__step-card${!selectedDentist ? " book-appointment__step-card--locked" : ""}`}
            aria-labelledby="step-datetime-label"
          >
            <BookingStepHeader
              step={4}
              title="Chọn ngày và giờ"
              icon={CalendarClock}
            />
            {!selectedDentist ? (
              <p className="book-appointment__locked-msg">
                Vui lòng chọn nha sĩ trước để xem khung giờ trống.
              </p>
            ) : (
              <>
                {isSlotsLoading && <Spinner />}
                {slotsError && (
                  <p className="book-appointment__locked-msg">
                    Không thể tải khung giờ trống. Vui lòng thử lại.
                  </p>
                )}
                {!isSlotsLoading && !slotsError && (
                  <DateTimePicker
                    selectedDate={selectedDate}
                    onSelectDate={handleSelectDate}
                    selectedSlotId={selectedSlot?.id || null}
                    onSelectSlot={handleSelectSlot}
                    slots={slots}
                    enforceTimingRule={!isReceptionist}
                    slotOccupied={selectedService?.slotOccupied ?? 1}
                    bookedTimeSet={bookedTimeSet}
                  />
                )}
              </>
            )}
          </section>
        </div>

        <div className="book-appointment__sidebar-col">
          <BookingSummary
            patient={selectedPatient}
            service={selectedService}
            dentist={selectedDentist}
            date={selectedDate}
            slot={selectedSlot}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>

      {isReceptionist && (
        <AddPatientModal
          isOpen={isAddPatientModalOpen}
          onClose={() => setIsAddPatientModalOpen(false)}
          onSave={handleSaveNewPatient}
        />
      )}
    </div>
  );

  return <Shell contentLabelledBy="book-appointment-title">{content}</Shell>;
}

BookAppointmentPage.propTypes = {
  isReceptionist: PropTypes.bool,
  Shell: PropTypes.elementType.isRequired,
};

BookAppointmentPage.defaultProps = {
  isReceptionist: false,
};

export default BookAppointmentPage;
