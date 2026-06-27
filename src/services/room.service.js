import { api } from "./api";

export const roomService = {
  getAll: () => api.get("/rooms"),
  create: (payload) => api.post("/rooms", payload),
  update: (roomId, payload) => api.put(`/rooms/${roomId}`, payload),
  delete: (roomId) => api.delete(`/rooms/${roomId}`),
};
