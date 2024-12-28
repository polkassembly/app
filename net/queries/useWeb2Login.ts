import client from "../client";
import { MutationBuilder } from "./builder";
import { TokenPair, tokenPairFromResponse } from "./utils";

export interface Web2LoginRequest {
  emailOrUsername: string;
  password: string;
}

const useWeb2Login = new MutationBuilder<Web2LoginRequest, TokenPair>(client)
  .method("POST")
  .url("auth/actions/web2Login")
  .responseTransform(tokenPairFromResponse)
  .build();

export default useWeb2Login;
