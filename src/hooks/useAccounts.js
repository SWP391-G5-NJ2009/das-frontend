import { useState, useEffect, useCallback, useMemo } from "react";
import { accountService } from "../services/account.service";

export function useAccounts(filters = {}) {
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const serializedFilters = useMemo(() => JSON.stringify(filters), [filters]);

    const [total, setTotal] = useState(0);

    const fetchAccounts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await accountService.get(filters);
            setAccounts(data.items || []);
            setTotal(data.total || 0);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [serializedFilters]);

    useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

    return {accounts, total, isLoading, error, refetch: fetchAccounts };
}