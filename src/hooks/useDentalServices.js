import { useCallback, useEffect, useMemo, useState } from "react";
import { dentalServiceService } from "../services/dentalService.service";

export function useManagerDentalServices(filters = {}) {
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

  const deleteService = useCallback(async (serviceId) => {
    await dentalServiceService.delete(serviceId);
    setServices((prevServices) =>
      prevServices.filter((service) => service.service_id !== serviceId),
    );
  }, []);

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

/**
 * Lightweight hook for the booking page.
 * Fetches all active dental services and maps DB fields to UI shape.
 *
 * Returned service shape:
 *   { id, name, duration, price, description, category }
 */
export function usePublicServices() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dentalServiceService.getPublic();
      const mapped = (data || []).map((s) => ({
        id: String(s.service_id),
        name: s.service_name,
        duration: s.duration_minutes || (s.slot_occupied || 1) * 30,
        price: s.price ?? s.unit_price,
        description: s.description || "",
        category: s.category_name || s.service_categories?.category_name || "",
        slotOccupied: s.slot_occupied ?? 1,
        treatmentMode: s.treatment_mode || "Single-Visit",
        process: s.process || "",
      }));
      setServices(mapped);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, isLoading, error, refetch: fetchServices };
}

/**
 * Fetches dentists qualified for a given service.
 * Re-fetches automatically when serviceId changes.
 *
 * Returned dentist shape:
 *   { id, fullName, specialization }
 */
export function useDentistsByService(serviceId) {
  const [dentists, setDentists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDentists = useCallback(async () => {
    if (!serviceId) {
      setDentists([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await dentalServiceService.getDentistsByService(serviceId);
      const mapped = (data || []).map((d) => ({
        id: String(d.dentist_id),
        fullName: d.full_name,
        specialization: d.specialization || "",
      }));
      setDentists(mapped);
    } catch (err) {
      setError(err);
      setDentists([]);
    } finally {
      setIsLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchDentists();
  }, [fetchDentists]);

  return { dentists, isLoading, error };
}
