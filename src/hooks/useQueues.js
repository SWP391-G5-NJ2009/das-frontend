import { useCallback, useEffect, useMemo, useState } from "react";
import { queueService } from "../services/queue.service";

function sortByCheckInTime(rows) {
  return (rows || []).slice().sort((a, b) => {
    const first = a.checkInTime || "";
    const second = b.checkInTime || "";
    return first.localeCompare(second);
  });
}

export function useQueues(filters = {}, options = {}) {
  const [queues, setQueues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEnabled = options.enabled ?? true;
  const serializedFilters = useMemo(() => JSON.stringify(filters), [filters]);

  const fetchQueues = useCallback(
    async (isBackground = false) => {
      if (!isEnabled) {
        setQueues([]);
        setError(null);
        if (!isBackground) setIsLoading(false);
        return;
      }

      if (!isBackground) setIsLoading(true);
      setError(null);
      try {
        const data = await queueService.getAll(filters);
        setQueues(sortByCheckInTime(data));
      } catch (requestError) {
        if (!isBackground) setError(requestError);
      } finally {
        if (!isBackground) setIsLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [isEnabled, serializedFilters],
  );

  useEffect(() => {
    fetchQueues();
    const interval = setInterval(() => fetchQueues(true), 30000);
    const handleFocus = () => fetchQueues(true);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchQueues]);

  return {
    queues,
    isLoading,
    error,
    refetch: fetchQueues,
  };
}

export function useDentistQueue(filters = {}, options = {}) {
  const [queues, setQueues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEnabled = options.enabled ?? true;
  const serializedFilters = useMemo(() => JSON.stringify(filters), [filters]);

  const fetchQueues = useCallback(
    async (isBackground = false) => {
      if (!isEnabled) {
        setQueues([]);
        setError(null);
        if (!isBackground) setIsLoading(false);
        return;
      }

      if (!isBackground) setIsLoading(true);
      setError(null);
      try {
        const data = await queueService.getMine(filters);
        setQueues(sortByCheckInTime(data));
      } catch (requestError) {
        if (!isBackground) setError(requestError);
      } finally {
        if (!isBackground) setIsLoading(false);
      }
    },
    [isEnabled, serializedFilters],
  );

  useEffect(() => {
    fetchQueues();
    const interval = setInterval(() => fetchQueues(true), 30000);
    const handleFocus = () => fetchQueues(true);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchQueues]);

  return {
    queues,
    isLoading,
    error,
    refetch: fetchQueues,
  };
}
