import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const DEFAULT_NETWORK = "polkadot";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Network": DEFAULT_NETWORK,
  },
});

export default client;


