import client from "../client";
import { MutationBuilder } from "./builder";

export interface Web2SignupRequest {
  email: string;
  username: string;
  password: string;
}

const useWeb2Signup = new MutationBuilder<Web2SignupRequest>(client)
  .method("POST")
  .url("auth/actions/web2Signup")
  .build();

export default useWeb2Signup;
