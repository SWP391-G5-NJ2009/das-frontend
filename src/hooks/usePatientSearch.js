import { useState, useCallback, useEffect, useRef } from "react";
import { patientService } from "../services/patient.service";

/**
 * Hook for patient search with 300ms debounce.
 * Used by receptionist on the Book Appointment page.
 *
 * Returns:
 *  - searchQuery: string (controlled input value)
 *  - searchResults: Array<{ id, fullName, phone }>
 *  - isSearching: boolean
 *  - handleSearchChange(query): update query + trigger debounced API call
 *  - handleSelectPatient(patient): set selected patient, clear results
 *  - handleClearPatient(): reset all search state
 *  - selectedPatient: object | null
 */
export function usePatientSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      requestIdRef.current += 1;
    },
    [],
  );

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    setSearchError("");
    setHasSearched(false);

    // Clear pending debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const requestId = ++requestIdRef.current;

    if (query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await patientService.search(query.trim());
        if (requestId !== requestIdRef.current) return;
        setSearchResults(Array.isArray(results) ? results : []);
        setHasSearched(true);
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        setSearchResults([]);
        setHasSearched(true);
        setSearchError(
          error?.message || "Không thể tìm bệnh nhân. Vui lòng thử lại.",
        );
      } finally {
        if (requestId === requestIdRef.current) setIsSearching(false);
      }
    }, 300);
  }, []);

  const handleSelectPatient = useCallback((patient) => {
    requestIdRef.current += 1;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSelectedPatient(patient);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
    setSearchError("");
    setHasSearched(false);
  }, []);

  const handleClearPatient = useCallback(() => {
    requestIdRef.current += 1;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSelectedPatient(null);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
    setSearchError("");
    setHasSearched(false);
  }, []);

  return {
    searchQuery,
    searchResults,
    isSearching,
    searchError,
    hasSearched,
    selectedPatient,
    setSelectedPatient,
    handleSearchChange,
    handleSelectPatient,
    handleClearPatient,
  };
}
