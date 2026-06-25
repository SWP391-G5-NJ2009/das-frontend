import { useState, useCallback, useRef } from "react";
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
  const [selectedPatient, setSelectedPatient] = useState(null);
  const debounceRef = useRef(null);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);

    // Clear pending debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await patientService.search(query.trim());
        setSearchResults(results || []);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
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

  return {
    searchQuery,
    searchResults,
    isSearching,
    selectedPatient,
    setSelectedPatient,
    handleSearchChange,
    handleSelectPatient,
    handleClearPatient,
  };
}
