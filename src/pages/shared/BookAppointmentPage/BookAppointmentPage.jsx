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
import { appointmentService } from "../../../services/appointment.service";
import PatientSearchSection from "../../../components/features/booking/PatientSearchSection/PatientSearchSection";
import ServiceGrid from "../../../components/features/booking/ServiceGrid/ServiceGrid";
import DentistGrid from "../../../components/features/booking/DentistGrid/DentistGrid";
import DateTimePicker from "../../../components/features/booking/DateTimePicker/DateTimePicker";
import BookingSummary from "../../../components/features/booking/BookingSummary/BookingSummary";
import BookingStepHeader from "../../../components/features/booking/BookingStepHeader/BookingStepHeader";
import AddPatientModal from "../../../components/features/booking/AddPatientModal/AddPatientModal";
import Spinner from "../../../components/common/Spinner/Spinner";

import "./BookAppointmentPage.css";

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
function BookAppointmentPage({ isReceptionist, Shell }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  /* ── Services from API ── */
  const {
    services,
    isLoading: isServicesLoading,
    error: servicesError,
  } = usePublicServices();

  /* ── Patient Search (receptionist only — real API) ── */
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

  /* Auto-fill patient info from logged-in user (patient role only) */
  useEffect(() => {
    if (!isReceptionist && user) {
      setSelectedPatient({
        id: user.profileId,
        fullName: user.fullName,
        phone: user.phone || "",
      });
    }
  }, [isReceptionist, user, setSelectedPatient]);

  /* ── Booking Step State ── */
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDentist, setSelectedDentist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);

  /* ── Dentists from API (re-fetches when service changes) ── */
  const {
    dentists,
    isLoading: isDentistsLoading,
    error: dentistsError,
  } = useDentistsByService(selectedService?.id ?? null);

  /* ── Available Slots from API (re-fetches when dentist or date changes) ── */
  const {
    slots,
    isLoading: isSlotsLoading,
    error: slotsError,
  } = useAvailableSlots(selectedDentist?.id ?? null, selectedDate ?? null);

  const phoneNumber = selectedPatient?.phone || "";

  /* ── Handlers ── */
  const handleSaveNewPatient = useCallback(
    (newPatient) => {
      setSelectedPatient({ id: `new-${Date.now()}`, ...newPatient });
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

  const handleSelectSlot = useCallback((slot) => {
    setSelectedSlot(slot);
  }, []);

  const handleCancel = useCallback(() => {
    if (isReceptionist) {
      navigate("/receptionist/dashboard");
    } else {
      navigate("/patient/dashboard");
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
        // receptionist must supply patientId; patient role ignored on BE
        ...(isReceptionist ? { patientId: Number(selectedPatient.id) } : {}),
      });
      alert(
        "Appointment booked successfully! A confirmation email has been sent to your inbox.",
      );
      if (isReceptionist) {
        navigate("/receptionist/appointments");
      } else {
        navigate("/patient/appointments");
      }
    } catch (err) {
      alert(err?.message || "Booking failed. Please try again!");
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
  ]);

  /* ── Render ── */
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
          Book new appointment
        </h1>
      </div>

      <div className="book-appointment__layout">
        {/* ── Main form column ── */}
        <div className="book-appointment__form-col">
          {/* Step 1 — Patient */}
          <section
            className="book-appointment__step-card"
            aria-labelledby="step-patient-label"
          >
            <BookingStepHeader
              step={1}
              title="Patient information"
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

          {/* Step 2 — Service */}
          <section
            className="book-appointment__step-card"
            aria-labelledby="step-service-label"
          >
            <BookingStepHeader
              step={2}
              title="Select service"
              icon={Stethoscope}
            />
            {isServicesLoading && <Spinner />}
            {servicesError && (
              <p className="book-appointment__locked-msg">
                The list of services could not be loaded. Please try again.
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

          {/* Step 3 — Dentist */}
          <section
            className={`book-appointment__step-card${!selectedService ? " book-appointment__step-card--locked" : ""}`}
            aria-labelledby="step-dentist-label"
          >
            <BookingStepHeader
              step={3}
              title="Select dentist"
              icon={UserCheck}
            />
            {isDentistsLoading && <Spinner />}
            {dentistsError && (
              <p className="book-appointment__locked-msg">
                Could not load dentists for this service. Please try again.
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

          {/* Step 4 — Date & Time */}
          <section
            className={`book-appointment__step-card${!selectedDentist ? " book-appointment__step-card--locked" : ""}`}
            aria-labelledby="step-datetime-label"
          >
            <BookingStepHeader
              step={4}
              title="Select date and time"
              icon={CalendarClock}
            />
            {!selectedDentist ? (
              <p className="book-appointment__locked-msg">
                Please select a dentist first to view available slots.
              </p>
            ) : (
              <>
                {isSlotsLoading && <Spinner />}
                {slotsError && (
                  <p className="book-appointment__locked-msg">
                    Could not load available slots. Please try again.
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
                  />
                )}
              </>
            )}
          </section>
        </div>

        {/* ── Sidebar ── */}
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

      {/* ── Add Patient Modal (Receptionist only) ── */}
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
