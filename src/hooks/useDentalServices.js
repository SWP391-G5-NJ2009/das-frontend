import { useCallback, useEffect, useMemo, useState } from "react";
import { dentalServiceService } from "../services/dentalService.service";

export function useOwnerDentalServices(filters = {}) {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const serializedFilters = useMemo(() => JSON.stringify(filters), [filters]);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await dentalServiceService.getOwnerCatalog(filters);
      setServices(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [serializedFilters]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return {
    error,
    isLoading,
    refetch: fetchServices,
    services,
  };
}
