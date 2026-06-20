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

import { usePublicServices, useDentistsByService } from "../../../hooks/useDentalServices";
import { useAuth } from "../../../context/AuthContext";
import PatientSearchSection from "../../../components/features/booking/PatientSearchSection/PatientSearchSection";
import ServiceGrid from "../../../components/features/booking/ServiceGrid/ServiceGrid";
import DentistGrid from "../../../components/features/booking/DentistGrid/DentistGrid";
import DateTimePicker from "../../../components/features/booking/DateTimePicker/DateTimePicker";
import BookingSummary from "../../../components/features/booking/BookingSummary/BookingSummary";
import BookingStepHeader from "../../../components/features/booking/BookingStepHeader/BookingStepHeader";
import AddPatientModal from "../../../components/features/booking/AddPatientModal/AddPatientModal";
import Spinner from "../../../components/common/Spinner/Spinner";

import "./BookAppointmentPage.css";


const MOCK_SLOTS = [
  { id: "t1", time: "08:00", status: "available" },
  { id: "t2", time: "08:30", status: "available" },
  { id: "t3", time: "09:00", status: "available" },
  { id: "t4", time: "09:30", status: "booked" },
  { id: "t5", time: "10:00", status: "available" },
  { id: "t6", time: "10:30", status: "booked" },
  { id: "t7", time: "11:00", status: "available" },
  { id: "t8", time: "11:30", status: "available" },
  { id: "t9", time: "13:30", status: "available" },
  { id: "t10", time: "14:00", status: "available" },
  { id: "t11", time: "14:30", status: "available" },
  { id: "t12", time: "15:00", status: "booked" },
];

const MOCK_PATIENTS = [
  { id: "p1", fullName: "Tran Van Nam", phone: "0901234567" },
  { id: "p2", fullName: "Nguyen Thi Lan", phone: "0912345678" },
  { id: "p3", fullName: "Le Quoc Bao", phone: "0923456789" },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
function BookAppointmentPage({ isReceptionist, Shell }) {
  const navigate = useNavigate();

  /* ── Services from API ── */
  const {
    services,
    isLoading: isServicesLoading,
    error: servicesError,
  } = usePublicServices();

  const { user } = useAuth();

  /* ── State ── */
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  /* Auto-fill patient info from logged-in user (patient role only) */
  useEffect(() => {
    if (!isReceptionist && user) {
      setSelectedPatient({
        id: user.profileId,
        fullName: user.fullName,
        phone: user.phone || "",
      });
    }
  }, [isReceptionist, user]);

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

  const slots = selectedDate && selectedDentist ? MOCK_SLOTS : [];
  const phoneNumber = selectedPatient?.phone || "";

  /* ── Handlers ── */
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    // Simulate async search
    setTimeout(() => {
      const q = query.toLowerCase();
      setSearchResults(
        MOCK_PATIENTS.filter(
          (p) => p.fullName.toLowerCase().includes(q) || p.phone.includes(q),
        ),
      );
      setIsSearching(false);
    }, 300);
  }, []);

  const handleSelectPatient = useCallback((patient) => {
    setSelectedPatient(patient);
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  const handleClearPatient = useCallback(() => {
    setSelectedPatient(null);
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  const handleSaveNewPatient = useCallback((newPatient) => {
    setSelectedPatient({ id: `new-${Date.now()}`, ...newPatient });
  }, []);

  const handlePhoneChange = useCallback((phone) => {
    setSelectedPatient((prev) => (prev ? { ...prev, phone } : prev));
  }, []);

  const handleSelectService = useCallback((service) => {
    setSelectedService(service);
    setSelectedDentist(null); // Reset dentist when service changes
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
      // TODO: call appointmentService.book(...)
      await new Promise((r) => setTimeout(r, 1000)); // fake delay
      alert(
        "Appointment booked successfully! A confirmation email has been sent to your inbox.",
      );
      if (isReceptionist) {
        navigate("/receptionist/appointments");
      } else {
        navigate("/patient/appointments");
      }
    } catch {
      alert("Appointment booked fail. Please retry!");
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
                isReceptionist
                  ? () => setIsAddPatientModalOpen(true)
                  : null
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
              <DateTimePicker
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                selectedSlotId={selectedSlot?.id || null}
                onSelectSlot={handleSelectSlot}
                slots={slots}
              />
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
