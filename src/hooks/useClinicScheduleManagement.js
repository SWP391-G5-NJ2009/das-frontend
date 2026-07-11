import { useEffect, useState, useCallback } from "react";
import { clinicScheduleManagementService } from "../services/clinicScheduleManagement.service";

export function useWorkingHour() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            setIsLoading(true);
            setError(null);
            try {
                const result = await clinicScheduleManagementService.getWorkingHour();
                if (isMounted) setData(result);
            } catch (err) {
                if (isMounted) {
                    setError(err);
                    setData(null);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchData();
        return () => { isMounted = false; };
    }, []);

    return { data, isLoading, error };
}

export function useClinicSetting() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            setIsLoading(true);
            setError(null);
            try {
                const result = await clinicScheduleManagementService.getClinicSetting();
                if (isMounted) setData(result);
            } catch (err) {
                if (isMounted) {
                    setError(err);
                    setData(null);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchData();
        return () => { isMounted = false; };
    }, []);

    return { data, isLoading, error };
}

export function useClinicClosures() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await clinicScheduleManagementService.getClosures();
            setData(result || []);
        } catch (err) {
            setError(err);
            setData([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
}