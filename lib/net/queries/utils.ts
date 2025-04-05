import { KEY_ACCESS_TOKEN, KEY_REFRESH_TOKEN, KEY_ID, storage } from "@/lib/store";
import getIdFromToken from "@/lib/util/jwt";
import { AxiosResponse } from "axios";
import { getUserById } from "./profile";
import { useAuthStore } from "@/lib/store/authStore";
import { useProfileStore } from "@/lib/store/profileStore";

export interface TokenPair {
  accessToken?: string;
  refreshToken?: string;
}

/**
 * Extracts access and refresh tokens from an Axios response.
 * Throws an error if the tokens are missing or if storing them fails.
 * @param res - The Axios response containing cookies
 * @returns {TokenPair} The extracted access and refresh tokens
 * @throws {Error} If tokens are not found or storage fails
 */
function tokenPairFromResponse(res: AxiosResponse): TokenPair {
  const [accessTokenRaw, refreshTokenRaw] =
    res.headers["set-cookie"]?.[0].split(", ") ?? [];

  const accessToken = accessTokenRaw
    .split(";")
    ?.find((it) => it.startsWith("access_token"))
    ?.split("=")[1]
    ?.trim();

  const refreshToken = refreshTokenRaw
    .split(";")
    ?.find((it) => it.startsWith("refresh_token"))
    ?.split("=")[1]
    ?.trim();

  if (!accessToken || !refreshToken) {
    throw new Error("Token not found");
  }

  try {
    if (accessToken) {
      storage.setString(KEY_ACCESS_TOKEN, accessToken);
    }
    if (refreshToken) {
      storage.setString(KEY_REFRESH_TOKEN, refreshToken);
    }
  } catch (error) {
    console.error("Failed to save token:", error);
    throw error;
  }

  return {
    accessToken,
    refreshToken,
  };
}

/**
 * Extracts user ID from a token and stores it.
 * Throws an error if the ID is not found or if storage fails.
 * @param token - The access token
 * @throws {Error} If ID is not found or storage fails
 */
function saveIdFromToken(token: string): void {
  const id = getIdFromToken(token);

  if (!id) throw new Error("Id not found");

  try {
    storage.setString(KEY_ID, id);
  } catch (error) {
    console.error("Failed to save id:", error);
    throw error;
  }
}

const fetchAndStoreProfileFromToken = async (accessToken: string) => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setProfile = useProfileStore((state) => state.setProfile);
  
  if (!accessToken) {
    console.error("Access token not found");
    return;
  }

  const id = getIdFromToken(accessToken ?? "");
  if (!id ) {
    console.error("Failed to get ID from token");
    return;
  }

  const profile = await getUserById(id);
  if (!profile) {
    console.error("Failed to get profile");
    return;
  }

  setAccessToken(accessToken);
  setProfile(profile);
}

export { fetchAndStoreProfileFromToken, tokenPairFromResponse, saveIdFromToken };