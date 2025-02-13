import { KEY_ACCESS_TOKEN, storage } from "@/lib/store";
import axios, { InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const DEFAULT_NETWORK = "polkadot";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Network": DEFAULT_NETWORK,
  },
});

function authenticate(config: InternalAxiosRequestConfig) {

  try {
    const token = storage.getString(KEY_ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Failed to authenticate request:", error);
  }

  return config;
}

client.interceptors.request.use(authenticate);

export default client;
