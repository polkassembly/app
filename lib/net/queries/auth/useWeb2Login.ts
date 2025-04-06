import { useMutation } from "@tanstack/react-query";
import client from "../../client";
import { TokenPair, tokenPairFromResponse, fetchAndStoreProfileFromToken } from "../utils";


export interface Web2LoginRequest {
  emailOrUsername: string;
  password: string;
}

const useWeb2Login = () => {
	return useMutation<TokenPair, Error, Web2LoginRequest>({
		mutationFn: async (params) => {
			try {
				const response = await client.post("auth/web2-auth/login", params);
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

export default useWeb2Login;