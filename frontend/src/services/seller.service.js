// Import the specific 'sellerApi' from your main api.js file
import { sellerApi } from "./api";

/**
 * Fetches seller-specific metrics.
 */
export async function getSellerMetrics() {
  const res = await sellerApi.get("/metrics");
  return res.data;
}

/**
 * Fetches orders for the seller.
 */
export async function getSellerOrders() {
  const res = await sellerApi.get("/orders");
  return res.data;
}

/**
 * Fetches products belonging to the seller.
 */
export async function getSellerProducts() {
  const res = await sellerApi.get("/products");
  return res.data;
}
