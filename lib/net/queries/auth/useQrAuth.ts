import { useMutation } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { saveIdFromToken, TokenPair, tokenPairFromResponse } from "../utils";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "expo-router";

export interface QrAuthRequest {
  sessionId: string;
}

const useQrAuth = () => {
  const router = useRouter();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

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
    onSuccess: (data) => {
      // Update the auth store with the access token
      setAccessToken(data.accessToken ?? null);
    },
    retry: 3,
  });
};

export default useQrAuth;
