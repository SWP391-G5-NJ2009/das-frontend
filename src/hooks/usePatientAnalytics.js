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

export function useMonthlyNewPatient(mOffset = 0) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const mCurrent = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

    useEffect(() => {
        let isMounted = true;

        async function fetchRevenue() {
            setIsLoading(true);
            setError(null);
            try {
                const result = await patientAnalyticsService.getMonthlyNewPatient(mCurrent, mOffset);
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
    }, [mCurrent, mOffset]);

    return { data, isLoading, error };
}

export function useMonthlyReturningPatient(mOffset = 0) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const mCurrent = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

    useEffect(() => {
        let isMounted = true;

        async function fetchRevenue() {
            setIsLoading(true);
            setError(null);
            try {
                const result = await patientAnalyticsService.getMonthlyReturningPatient(mCurrent, mOffset);
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
    }, [mCurrent, mOffset]);

    return { data, isLoading, error };
}

export function useMonthlyNoShowRate(mOffset = 0) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const mCurrent = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

    useEffect(() => {
        let isMounted = true;

        async function fetchRevenue() {
            setIsLoading(true);
            setError(null);
            try {
                const result = await patientAnalyticsService.getMonthlyNoShowRate(mCurrent, mOffset);
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
    }, [mCurrent, mOffset]);

    return { data, isLoading, error };
}