import { useMutation } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { fetchAndStoreProfileFromToken, TokenPair, tokenPairFromResponse } from "../utils";
export interface QrAuthRequest {
  sessionId: string;
}

const useQrAuth = () => {
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
