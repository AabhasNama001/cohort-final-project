// WRONG: import api from './api';
// RIGHT: Import the specific 'cartApi'
import { cartApi } from "./api";

export async function getCart() {
  // Use cartApi, not api
  const res = await cartApi.get("/cart");
  return res.data;
}

export async function addToCart(item) {
  // Use cartApi, not api
  const res = await cartApi.post("/cart/items", item);
  return res.data;
}

export async function updateCartItem(itemId, data) {
  // Use cartApi, not api
  const res = await cartApi.patch(`/cart/items/${itemId}`, data);
  return res.data;
}
