import client from "../client";
import { MutationBuilder } from "./builder";
import { saveIdFromToken, TokenPair, tokenPairFromResponse } from "./utils";

export interface Web2LoginRequest {
    emailOrUsername: string;
    password: string;
}

const useWeb2Login = new MutationBuilder< unknown, unknown, Web2LoginRequest, TokenPair>(client)
  .method("POST")
  .url("auth/web2-auth/login")
  .responseTransform(tokenPairFromResponse)
  .postProcess(({ accessToken }) => {
    if (accessToken) {
      saveIdFromToken(accessToken);
    }
  })
  .build();

export default useWeb2Login;
