import axios from "axios";

/**
 * =================================================================
 * REUSABLE INTERCEPTORS
 * We can share these with all of our API clients
 * =================================================================
 */

// This interceptor attaches the auth token to every request
const attachToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// This interceptor handles 401 (Unauthorized) errors from ANY service
const handleUnauthorized = (error) => {
  if (error?.response?.status === 401) {
    try {
      localStorage.removeItem("token");
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
};

/**
 * =================================================================
 * API CLIENT FACTORY
 * A function that creates a new Axios instance for a specific service
 * =================================================================
 */

const createApiClient = (baseURL) => {
  const api = axios.create({
    baseURL: baseURL + "/api", // Appends /api to the service URL
    withCredentials: true,
  });

  // Apply our global interceptors
  api.interceptors.request.use(attachToken);
  api.interceptors.response.use(
    (response) => response, // Pass through successful responses
    handleUnauthorized // Handle errors
  );

  return api;
};

/**
 * =================================================================
 * EXPORT ONE CLIENT PER MICROSERVICE
 * This is the part you must configure.
 * =================================================================
 */

// We create and export a separate, named client for each service.
// These VITE_ variables are pulled from your .env file (for local)
// or from your Netlify environment variables (for production).

export const authApi = createApiClient(import.meta.env.VITE_AUTH_API_URL);
export const productApi = createApiClient(import.meta.env.VITE_PRODUCT_API_URL);
export const cartApi = createApiClient(import.meta.env.VITE_CART_API_URL);
export const orderApi = createApiClient(import.meta.env.VITE_ORDER_API_URL);
export const paymentApi = createApiClient(import.meta.env.VITE_PAYMENT_API_URL);
export const aiBuddyApi = createApiClient(
  import.meta.env.VITE_AI_BUDDY_API_URL
);
export const notificationApi = createApiClient(
  import.meta.env.VITE_NOTIFICATION_API_URL
);
export const sellerApi = createApiClient(import.meta.env.VITE_SELLER_API_URL);
