import { useState, useEffect, useCallback, useMemo } from "react";
import { consultationService } from "../services/consultation.service";

export function useConsultationRequests(filters = {}) {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const serializedFilters = useMemo(() => JSON.stringify(filters), [filters]);

    const [total, setTotal] = useState(0);

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await consultationService.get(filters);
            setRequests(data.items || []);
            setTotal(data.total || 0);
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
        total,
        isLoading,
        error,
        refetch: fetchRequests
    };
}