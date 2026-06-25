import { useState, useEffect, useCallback, useMemo } from "react";
import { consultationService } from "../services/consultation.service";

export function useConsultationRequests(filters = {}) {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const serializedFilters = useMemo(() => JSON.stringify(filters), [filters]);

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await consultationService.get(filters);
            setRequests(data);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [serializedFilters]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    return {
        requests,
        isLoading,
        error,
        refetch: fetchRequests
    };
}