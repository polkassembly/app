import { useMutation } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { fetchAndStoreProfileFromToken, TokenPair, tokenPairFromResponse } from "../utils";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "expo-router";
import getIdFromToken from "@/lib/util/jwt";
import { useProfileStore } from "@/lib/store/profileStore";
import { getUserById } from "../profile";

export interface QrAuthRequest {
  sessionId: string;
}

const useQrAuth = () => {
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setProfile = useProfileStore((state) => state.setProfile);

  return useMutation<TokenPair, Error, QrAuthRequest>({
    mutationFn: async (params) => {
      try {
        const response = await client.post("auth/qr-session", params);
        const tokenPair = tokenPairFromResponse(response);
        if (!tokenPair.accessToken) throw new Error("Access token not found");
        return tokenPair;
      } catch (error) {
        console.error("Failed to authenticate", error);
        throw new Error("Failed to authenticate");
      }
    },
    onSuccess: async (data) => {
      if (!data.accessToken) {
        console.error("Access token not found");
        return;
      }

      await fetchAndStoreProfileFromToken(data.accessToken)
    },
    retry: 1,
  });
};

export default useQrAuth;
