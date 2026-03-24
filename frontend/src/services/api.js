import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20_000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("stke_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getApiErrorMessage(err) {
  if (!err) return "Something went wrong. Please try again.";
  if (typeof err === "string") return err;

  const status = err?.response?.status;
  const msg = err?.response?.data?.message || err?.message;

  if (status === 401) return msg || "You’re not logged in. Please sign in and try again.";
  if (status === 403) return msg || "You don’t have permission to do that.";
  if (status === 404) return msg || "We couldn’t find what you requested.";
  if (status >= 500) return "Server error. Please try again in a moment.";

  if (err.code === "ECONNABORTED") return "Request timed out. Check your connection and try again.";
  if (msg) return msg;

  return "Something went wrong. Please try again.";
}

