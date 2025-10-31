import { cartApi } from "./api";

export async function getCart() {
  const res = await cartApi.get("/cart");
  return res.data;
}

export async function addToCart(item) {
  const res = await cartApi.post("/cart/items", item);
  return res.data;
}

export async function updateCartItem(itemId, data) {
  const res = await cartApi.patch(`/cart/items/${itemId}`, data);
  return res.data;
}

export async function removeCartItem(itemId) {
  const res = await cartApi.delete(`/cart/items/${itemId}`);
  return res.data;
}
