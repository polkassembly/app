import client from "@/net/client";
import { MutationBuilder } from "../builder";
import { saveIdFromToken, TokenPair, tokenPairFromResponse } from "../utils";

export interface QrAuthRequest {
		sessionId: string;
}

const useQrAuth = new MutationBuilder<unknown, unknown, QrAuthRequest, TokenPair>(client)
	.method("POST")
	.url("auth/qr-session")
	.responseTransform(tokenPairFromResponse)
	.postProcess(({ accessToken }) => {
    if (accessToken) {
      saveIdFromToken(accessToken);
    }
  }).build();

export default useQrAuth;