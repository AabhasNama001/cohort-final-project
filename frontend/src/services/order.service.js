// WRONG: import api from "./api";
// RIGHT: Import the specific 'orderApi'
import { orderApi } from "./api";

export async function getMyOrders() {
  // Use orderApi, not api
  const res = await orderApi.get("/orders/me");
  return res.data;
}

export async function createOrder(payload) {
  try {
    // Use orderApi, not api
    const res = await orderApi.post("/orders", payload);
    return res.data;
  } catch (err) {
    console.error("Order creation failed:", err);
    throw err;
  }
}

export async function getOrderById(id) {
  // Use orderApi, not api
  const res = await orderApi.get(`/orders/${id}`);
  return res.data;
}
