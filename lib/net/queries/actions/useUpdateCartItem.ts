import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { buildCartItemsQueryKey } from "./useGetCartItem";
import { getUserIdFromStorage } from "../utils";

interface UpdateCartItemParams {
	id: string;
	decision: "aye" | "nay" | "abstain";
  amount: {
    aye?: string;
    nay?: string;
    abstain?: string;
  };
  conviction: number;
}

export default function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: UpdateCartItemParams) => {
      const id = getUserIdFromStorage();
      return client.patch(`/users/id/${id}/vote-cart`, params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: buildCartItemsQueryKey(getUserIdFromStorage())});
    },
  });
}
