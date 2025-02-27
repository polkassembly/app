import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { storage, KEY_COOKIE, KEY_ACCESS_TOKEN } from "@/lib/store";
import { Alert } from "react-native";
import { navigate } from "@/lib/navigation";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const DEFAULT_NETWORK = "polkadot";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Network": DEFAULT_NETWORK,
  },
  withCredentials: true,
});

// Attach the stored cookie to each request
function attachCookie(config: InternalAxiosRequestConfig) {
  const cookie = storage.getString(KEY_COOKIE);
  if (cookie) {
    config.headers.Cookie = cookie;
  }
  return config;
}

// Extract and store cookie(s) from the response
function storeCookie(response: AxiosResponse) {
  const setCookieHeader =
    response.headers["set-cookie"] || response.headers["Set-Cookie"];

  if (!setCookieHeader) return response;

  let cookieValue: string;

  if (Array.isArray(setCookieHeader)) {
    // If there's only one element that includes a comsplit it into separate cookies.
    if (setCookieHeader.length === 1 && setCookieHeader[0].includes(",")) {
      cookieValue = setCookieHeader[0]
        .split(",")
        .map((cookieStr: string) => cookieStr.trim().split(";")[0])
        .join("; ");
    } else {
      // Multiple Set-Cookie headers: extract name/value from each.
      cookieValue = setCookieHeader
        .map((cookieStr: string) => cookieStr.split(";")[0])
        .join("; ");
    }
  } else {
    // setCookieHeader is a string; check if it contains a comma.
    if (setCookieHeader.includes(",")) {
      cookieValue = setCookieHeader
        .split(",")
        .map((cookieStr: string) => cookieStr.trim().split(";")[0])
        .join("; ");
    } else {
      cookieValue = setCookieHeader.split(";")[0];
    }
  }
  
  storage.setString(KEY_COOKIE, cookieValue);
  return response;
}

// Handle 401 Unauthorized
async function handleUnauthorized(error: any) {
  if (error.response && error.response.status === 401) {
    await logoutUser();
  }
  return Promise.reject(error);
}

// Logout user and navigate to login screen
async function logoutUser() {
  storage.deleteString(KEY_COOKIE); // Clear stored cookie
  storage.deleteString(KEY_ACCESS_TOKEN); // Clear access token
  Alert.alert("Session Expired", "Your session has expired. Please log in again.", [
    { text: "OK", onPress: () => navigate("/auth") },
  ]);
}

// Attach interceptors
client.interceptors.request.use(attachCookie);
client.interceptors.response.use(storeCookie, handleUnauthorized);

export default client;
