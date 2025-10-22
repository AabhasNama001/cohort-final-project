// WRONG: import api from "./api";
// RIGHT: Import the specific 'authApi'
import { authApi } from "./api";

export async function login(credentials) {
  // Use authApi, not api
  return authApi.post("/auth/login", credentials);
}

export async function register(data) {
  // Use authApi, not api
  return authApi.post("/auth/register", data);
}

export async function me() {
  // Use authApi, not api
  return authApi.get("/auth/me");
}

export async function logout() {
  // Use authApi, not api
  const res = await authApi.get("/auth/logout");
  return res.data;
}
