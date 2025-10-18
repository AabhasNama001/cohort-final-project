import api from "./api";

export async function login(credentials) {
  return api.post("/auth/login", credentials);
}

export async function register(data) {
  return api.post("/auth/register", data);
}

export async function me() {
  return api.get("/auth/me");
}

export async function logout() {
  const res = await api.get("/auth/logout");
  return res.data;
}
