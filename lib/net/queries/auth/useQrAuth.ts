import client from "@/lib/net/client";
import { MutationBuilder } from "../builder";
import { saveIdFromToken, TokenPair, tokenPairFromResponse } from "../utils";

export interface QrAuthRequest {
		sessionId: string;
}

const useQrAuth = new MutationBuilder<unknown, unknown, QrAuthRequest, TokenPair>(client)
	.method("POST")
	.url("auth/qr-session")
	.responseTransform((res) => {
		try {
			return tokenPairFromResponse(res)
		}catch(error){
			throw error
		}
	})
	.postProcess(({ accessToken }) => {
    if(!accessToken) throw new Error("access token not found")
		try{
			saveIdFromToken(accessToken);
		}catch(error){
			throw error;
		}
  }).build();

export default useQrAuth;