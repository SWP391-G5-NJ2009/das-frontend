import { useState, useEffect, useCallback } from "react";
import { accountService } from "../services/account.service";

export function useAccounts() {
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAccounts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await accountService.getAll();
            setAccounts(data);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

    return {accounts, isLoading, error, refetch: fetchAccounts };
}