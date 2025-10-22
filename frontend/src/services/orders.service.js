// Import the specific 'orderApi' from your main api.js file
import { orderApi } from "./api";

/**
 * Creates a new order.
 * @param {object} payload - The order data (e.g., items, address)
 */
export async function createOrder(payload) {
  // Calls POST https://[your-order-service-url].onrender.com/api/
  const res = await orderApi.post("/", payload);
  return res.data;
}

/**
 * Fetches all orders for the currently logged-in user.
 */
export async function getMyOrders() {
  // Calls GET https://[your-order-service-url].onrender.com/api/me
  const res = await orderApi.get("/me");
  return res.data;
}

/**
 * Cancels a specific order.
 * @param {string} id - The ID of the order to cancel.
 */
export async function cancelOrderById(id) {
  // Calls POST https://[your-order-service-url].onrender.com/api/:id/cancel
  const res = await orderApi.post(`/${id}/cancel`);
  return res.data;
}

/**
 * Updates the shipping address for a specific order.
 * @param {string} id - The ID of the order to update.
 * @param {object} payload - The new address data.
 */
export async function updateOrderAddress(id, payload) {
  // Calls PATCH https://[your-order-service-url].onrender.com/api/:id/address
  const res = await orderApi.patch(`/${id}/address`, payload);
  return res.data;
}

/**
 * Fetches a single order by its ID.
 * @param {string} id - The ID of the order.
 */
export async function getOrderById(id) {
  // Calls GET https://[your-order-service-url].onrender.com/api/:id
  const res = await orderApi.get(`/${id}`);
  return res.data;
}
