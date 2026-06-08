import { useState, useEffect, useCallback } from "react";
import { consultationService } from "../services/consultation.service";

export function useConsultationRequests() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await consultationService.getAll();
            setRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchRequests(); }, [fetchRequests]);

    return {requests, isLoading, error, refetch: fetchRequests };
}