import client from "../client";
import { MutationBuilder } from "./builder";

export interface Web2LoginRequest {
  emailOrUsername: string;
  password: string;
}

const useWeb2Login = new MutationBuilder<Web2LoginRequest>(client)
  .method("POST")
  .url("auth/actions/web2Login")
  .build();

export default useWeb2Login;
