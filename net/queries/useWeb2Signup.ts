import client from "../client";
import { MutationBuilder } from "./builder";
import { saveProfileFromToken, TokenPair, tokenPairFromResponse } from "./utils";

export interface Web2SignupRequest {
  email: string;
  username: string;
  password: string;
}

const useWeb2Signup = new MutationBuilder<Web2SignupRequest, TokenPair>(client)
  .method("POST")
  .url("auth/actions/web2-signup")
  .responseTransform(tokenPairFromResponse)
  .postProcess(({ accessToken }) => {
    if (accessToken) {
      saveProfileFromToken(accessToken);
    }
  })
  .build();

export default useWeb2Signup;
