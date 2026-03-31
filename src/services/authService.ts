import { apiFetch, setToken, removeToken } from "./api";
import { AuthResponse, LoginPayload, RegisterPayload, UserInfoResponse } from "../types/auth";

export async function loginUser(payload: LoginPayload) {
  const res = await apiFetch<AuthResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setToken(res.data.token);
  return res;
}

export async function registerUser(payload: RegisterPayload) {
  await apiFetch<{ data: string }>("/users/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  // Register hanya return { data: "Ok" }, tidak ada token
}

export async function logoutUser() {
  await apiFetch<{ data: string }>("/users/logout", {
    method: "POST",
  });
  removeToken();
}

export async function getUserInfo() {
  const res = await apiFetch<UserInfoResponse>("/users/info");
  return res.data;
}
