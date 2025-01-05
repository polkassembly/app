import { MMKV } from "react-native-mmkv";

export const KEY_ACCESS_TOKEN = "auth.access";
export const KEY_REFRESH_TOKEN = "auth.refresh";

export const storage = new MMKV({
  id: "primary",
  encryptionKey: process.env.EXPO_PUBLIC_MMKV_PRIVATE_KEY,
});
