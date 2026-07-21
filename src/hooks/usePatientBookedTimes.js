import { useState, useEffect, useCallback } from "react";
import { appointmentService } from "../services/appointment.service";

export function usePatientBookedTimes(isPatient = false, patientId = null) {
  const [bookedTimeSet, setBookedTimeSet] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookedTimes = useCallback(async () => {
    // Patient self-booking
    if (isPatient) {
      setIsLoading(true);
      try {
        const data = await appointmentService.getMyBookedTimes();
        const set = new Set(
          (data || []).map((t) => `${t.date}|${t.startTime}`),
        );
        setBookedTimeSet(set);
      } catch {
        setBookedTimeSet(new Set());
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Receptionist booking for a specific patient
    if (patientId && !String(patientId).startsWith("new-")) {
      setIsLoading(true);
      try {
        const data = await appointmentService.getPatientBookedTimes(patientId);
        const set = new Set(
          (data || []).map((t) => `${t.date}|${t.startTime}`),
        );
        setBookedTimeSet(set);
      } catch {
        setBookedTimeSet(new Set());
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // No applicable case (no patient selected yet, or new patient)
    setBookedTimeSet(new Set());
  }, [isPatient, patientId]);

  useEffect(() => {
    fetchBookedTimes();
  }, [fetchBookedTimes]);

  return { bookedTimeSet, isLoading, refetch: fetchBookedTimes };
}
