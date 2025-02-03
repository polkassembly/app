import client from "../client";
import { MutationBuilder } from "./builder";
import { saveProfileFromToken, TokenPair, tokenPairFromResponse } from "./utils";

export interface Web2LoginRequest {
  emailOrUsername: string;
  password: string;
}

const useWeb2Login = new MutationBuilder<Web2LoginRequest, TokenPair>(client)
  .method("POST")
  .url("auth/actions/web2-login")
  .responseTransform(tokenPairFromResponse)
  .postProcess(({ accessToken }) => {
    if (accessToken) {
      saveProfileFromToken(accessToken);
    }
  })
  .build();

export default useWeb2Login;
