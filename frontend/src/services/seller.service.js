// Import the specific 'sellerApi' from your main api.js file
import { sellerApi } from "./api";

/**
 * Fetches seller-specific metrics.
 */
export async function getSellerMetrics() {
  // THE FIX: Added the full path to match your backend route
  const res = await sellerApi.get("/seller/dashboard/metrics");
  return res.data;
}

/**
 * Fetches orders for the seller.
 */
export async function getSellerOrders() {
  // THE FIX: Added the full path to match your backend route
  const res = await sellerApi.get("/seller/dashboard/orders");
  return res.data;
}

/**
 * Fetches products belonging to the seller.
 */
export async function getSellerProducts() {
  // THE FIX: Added the full path to match your backend route
  const res = await sellerApi.get("/seller/dashboard/products");
  return res.data;
}
