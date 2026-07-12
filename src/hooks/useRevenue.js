import { useEffect, useState } from "react";
import { revenueService } from "../services/revenue.service";

export function useRevenue() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        let isMounted = true;

        async function fetchRevenue() {
            setIsLoading(true);
            setError(null);
            try {
                const result = await revenueService.get();
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

        fetchRevenue();
        return () => { isMounted = false; };
    }, []);

    return { data, isLoading, error };
}

export function useMonthlyRevenue() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        let isMounted = true;

        async function fetchRevenue() {
            setIsLoading(true);
            setError(null);
            try {
                const result = await revenueService.getMonthly();
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

        fetchRevenue();
        return () => { isMounted = false; };
    }, []);

    return { data, isLoading, error };
}