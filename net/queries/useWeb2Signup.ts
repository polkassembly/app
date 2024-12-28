import client from "../client";
import { MutationBuilder } from "./builder";
import { TokenPair, tokenPairFromResponse } from "./utils";

export interface Web2SignupRequest {
  email: string;
  username: string;
  password: string;
}

const useWeb2Signup = new MutationBuilder<Web2SignupRequest, TokenPair>(client)
  .method("POST")
  .url("auth/actions/web2Signup")
  .responseTransform(tokenPairFromResponse)
  .build();

export default useWeb2Signup;
