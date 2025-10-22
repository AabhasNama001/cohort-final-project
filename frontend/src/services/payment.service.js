// Import the specific 'paymentApi' from your main api.js file
import { paymentApi } from "./api";

/**
 * Creates a payment session for a specific order.
 * @param {string} orderId - The ID of the order to pay for.
 */
export async function createPayment(orderId) {
  // Calls POST https://[your-payment-service-url].onrender.com/api/create/:orderId
  const res = await paymentApi.post(`/create/${orderId}`);
  return res.data;
}

/**
 * Verifies a payment after it has been processed.
 * @param {object} payload - The verification data (e.g., paymentId, signature)
 */
export async function verifyPayment(payload) {
  // Calls POST https://[your-payment-service-url].onrender.com/api/verify
  const res = await paymentApi.post("/verify", payload);
  return res.data;
}
