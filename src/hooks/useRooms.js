import { useCallback, useEffect, useState } from "react";
import { roomService } from "../services/room.service";

export function useRooms() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await roomService.getAll();
      setRooms(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRoom = useCallback(
    async (payload) => {
      const room = await roomService.create(payload);
      await fetchRooms();
      return room;
    },
    [fetchRooms],
  );

  const updateRoom = useCallback(
    async (roomId, payload) => {
      const room = await roomService.update(roomId, payload);
      await fetchRooms();
      return room;
    },
    [fetchRooms],
  );

  const deleteRoom = useCallback(async (roomId) => {
    await roomService.delete(roomId);
    setRooms((prevRooms) =>
      prevRooms.filter((room) => room.room_id !== roomId),
    );
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return {
    createRoom,
    deleteRoom,
    error,
    isLoading,
    refetch: fetchRooms,
    rooms,
    updateRoom,
  };
}
