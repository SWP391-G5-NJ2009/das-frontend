import { useCallback, useEffect, useMemo, useState } from "react";
import { staffService } from "../services/staff.service";

export function useStaff(filters = {}) {
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const serializedFilters = JSON.stringify(filters);

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await staffService.getAll(filters);
      setStaff(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [serializedFilters]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return {
    staff,
    isLoading,
    error,
    refetch: fetchStaff,
  };
}