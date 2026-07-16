import { useEffect, useState, useCallback } from "react";
import { clinicScheduleManagementService } from "../services/clinicScheduleManagement.service";

export function useWorkingHour() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await clinicScheduleManagementService.getWorkingHour();
            setData(result);
        } catch (err) {
            setError(err);
            setData(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
}

