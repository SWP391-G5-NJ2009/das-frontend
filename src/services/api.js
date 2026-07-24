const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function request(method, endpoint, data = null) {
  const token = localStorage.getItem("token");
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
  };

  let response;

  try {
    response = await fetch(`${API_BASE}${endpoint}`, options);
  } catch {
    throw new Error("Không thể kết nối tới máy chủ.");
  }

  const json = await response.json();

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  if (!response.ok) {
    const error = new Error(json.message || "Request failed");
    error.code = json.code;
    error.details = json.details;
    throw error;
  }

  return json.data;
}

export const api = {
  get: (endpoint) => request("GET", endpoint),
  post: (endpoint, data) => request("POST", endpoint, data),
  put: (endpoint, data) => request("PUT", endpoint, data),
  patch: (endpoint, data) => request("PATCH", endpoint, data),
  delete: (endpoint) => request("DELETE", endpoint),
};
