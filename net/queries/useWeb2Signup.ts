import client from "../client";
import { MutationBuilder } from "./builder";
import { saveIdFromToken, TokenPair, tokenPairFromResponse } from "./utils";

export interface Web2SignupRequest {
  email: string;
  username: string;
  password: string;
}

const useWeb2Signup = new MutationBuilder<unknown, unknown, Web2SignupRequest, TokenPair>(client)
  .method("POST")
  .url("auth/web2-auth/signup")
  .responseTransform(tokenPairFromResponse)
  .postProcess(({ accessToken }) => {
    if (accessToken) {
      saveIdFromToken(accessToken);
    }
  })
  .build();

export default useWeb2Signup;
