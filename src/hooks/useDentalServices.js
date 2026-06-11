import { useCallback, useEffect, useMemo, useState } from "react";
import { dentalServiceService } from "../services/dentalService.service";

export function useOwnerDentalServices(filters = {}) {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const serializedFilters = useMemo(() => JSON.stringify(filters), [filters]);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await dentalServiceService.getAll(filters);
      setServices(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [serializedFilters]);

  const fetchCategories = useCallback(async () => {
    const data = await dentalServiceService.getCategories();
    setCategories(data || []);
    return data || [];
  }, []);

  const fetchCatalogData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [serviceData, categoryData] = await Promise.all([
        dentalServiceService.getAll(filters),
        dentalServiceService.getCategories(),
      ]);

      setServices(serviceData || []);
      setCategories(categoryData || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [serializedFilters]);

  const createService = useCallback(
    async (payload) => {
      const service = await dentalServiceService.create(payload);
      await fetchServices();
      return service;
    },
    [fetchServices],
  );

  const updateService = useCallback(
    async (serviceId, payload) => {
      const service = await dentalServiceService.update(serviceId, payload);
      await fetchServices();
      return service;
    },
    [fetchServices],
  );

  const deleteService = useCallback(
    async (serviceId) => {
      await dentalServiceService.delete(serviceId);
      setServices((prevServices) =>
        prevServices.filter((service) => service.service_id !== serviceId),
      );
    },
    [],
  );

  useEffect(() => {
    fetchCatalogData();
  }, [fetchCatalogData]);

  return {
    categories,
    createService,
    deleteService,
    error,
    fetchCategories,
    isLoading,
    refetch: fetchCatalogData,
    services,
    updateService,
  };
}
