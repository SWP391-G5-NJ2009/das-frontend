import { useEffect, useState } from "react";
import { patientAnalyticsService } from "../services/patientAnalytics.service";

export function usePatientAnalytics() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        let isMounted = true;

        async function fetchRevenue() {
            setIsLoading(true);
            setError(null);
            try {
                const result = await patientAnalyticsService.getNewPatient();
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

export function useNoShowRate() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        let isMounted = true;

        async function fetchRevenue() {
            setIsLoading(true);
            setError(null);
            try {
                const result = await patientAnalyticsService.getNoShowRate();
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

export function useReturningPatient() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        let isMounted = true;

        async function fetchRevenue() {
            setIsLoading(true);
            setError(null);
            try {
                const result = await patientAnalyticsService.getReturningPatient();
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

export function useMonthlyNewPatient() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        let isMounted = true;

        async function fetchRevenue() {
            setIsLoading(true);
            setError(null);
            try {
                const result = await patientAnalyticsService.getMonthlyNewPatient();
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

export function useMonthlyReturningPatient() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        let isMounted = true;

        async function fetchRevenue() {
            setIsLoading(true);
            setError(null);
            try {
                const result = await patientAnalyticsService.getMonthlyReturningPatient();
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

export function useMonthlyNoShowRate() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        let isMounted = true;

        async function fetchRevenue() {
            setIsLoading(true);
            setError(null);
            try {
                const result = await patientAnalyticsService.getMonthlyNoShowRate();
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