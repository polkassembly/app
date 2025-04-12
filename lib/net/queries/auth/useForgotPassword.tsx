import { useMutation } from "@tanstack/react-query";
import client from "../../client";

export interface ForgotPassword {
  email: string;
}

const useForgotPassword = () => {
  return useMutation<{ message: string }, Error, ForgotPassword>({
    mutationFn: async (params) => {
      const response = await client.post<{ message: string }>(
        "auth/send-reset-password-email",
        params
      );
      return response.data;
    },
    retry: 1,
  });
};

export default useForgotPassword;
