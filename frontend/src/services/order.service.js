import api from "./api";

export async function getMyOrders() {
  const res = await api.get("/orders/me");
  return res.data;
}

export async function createOrder(payload) {
  try {
    const res = await api.post("/orders", payload);
    return res.data;
  } catch (err) {
    console.error("Order creation failed:", err);
    throw err;
  }
}

export async function getOrderById(id) {
  const res = await api.get(`/orders/${id}`);
  return res.data;
}
