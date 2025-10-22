// WRONG: import api from './api'
// RIGHT: Import the specific 'productApi'
import { productApi } from "./api";

export async function fetchProducts(params = {}) {
  // Use productApi, not api
  const res = await productApi.get("/products", { params });
  return res.data;
}

export async function fetchProductById(id) {
  // Use productApi, not api
  const res = await productApi.get(`/products/${id}`);
  return res.data;
}

export async function createProduct(formData) {
  // Use productApi, not api
  const res = await productApi.post("/products", formData);
  return res.data;
}
