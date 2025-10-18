import axios from "axios";

// Base URL handling
const API_BASE = import.meta.env.DEV
  ? "" // During dev, use Vite proxy
  : import.meta.env.VITE_API_BASE || "https://cohort-final-project-auth.onrender.com";

const api = axios.create({
  baseURL: API_BASE + "/api",
  withCredentials: true,
});

// Attach token on every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle unauthorized globally without breaking page behavior
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem("token");
        // Only redirect if user is NOT already on auth page
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/auth")
        ) {
          window.history.pushState({}, "", "/auth");
          window.dispatchEvent(new Event("popstate")); // trigger router change
        }
      } catch (e) {
        console.error("Auth redirect error:", e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
