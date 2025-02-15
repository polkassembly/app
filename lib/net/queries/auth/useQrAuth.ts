import { useMutation } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { saveIdFromToken, TokenPair, tokenPairFromResponse } from "../utils";

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

        saveIdFromToken(tokenPair.accessToken);
        return tokenPair;
      } catch (error) {
        console.error("Failed to authenticate", error);
				throw new Error("Failed to authenticate");
      }
    },
    retry: 3,
  });
};

export default useQrAuth;