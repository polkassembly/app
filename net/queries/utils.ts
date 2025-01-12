import { KEY_ACCESS_TOKEN, KEY_REFRESH_TOKEN, PROFILE_DATA, storage } from "@/store";
import getProfileDataFromToken from "@/util/jwt";
import { AxiosResponse } from "axios";

export interface TokenPair {
  accessToken?: string;
  refreshToken?: string;
}

export function tokenPairFromResponse(res: AxiosResponse): TokenPair {
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

  if (accessToken) storage.setString(KEY_ACCESS_TOKEN, accessToken);
  if (refreshToken) storage.setString(KEY_REFRESH_TOKEN, refreshToken);

  return {
    accessToken,
    refreshToken,
  };
}

export function saveProfileFromToken(token: string): void {
  const profile = getProfileDataFromToken(token);

  if (profile) {
    storage.setObject(PROFILE_DATA, profile);
  }
}