import { useCallback, useState } from "react";
import { staffService } from "../services/staff.service";

export function useCreateDentistProfile() {
  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const fetchAvailableAccounts = useCallback(async () => {
    setIsLoadingAccounts(true);
    setError(null);
    try {
      const data = await staffService.getAvailableStaffAccounts();
      setAvailableAccounts(data || []);
    } catch (err) {
      setError(err);
      setAvailableAccounts([]);
    } finally {
      setIsLoadingAccounts(false);
    }
  }, []);

  const createProfile = useCallback(async (payload) => {
    setIsCreating(true);
    setError(null);
    try {
      return await staffService.createStaffProfile(payload);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return {
    availableAccounts,
    isLoadingAccounts,
    isCreating,
    error,
    fetchAvailableAccounts,
    createProfile,
  };
}
