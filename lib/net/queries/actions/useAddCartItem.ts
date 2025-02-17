import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { buildCartItemsQueryKey } from "./useGetCartItem";
import { getUserIdFromStorage } from "../utils";
import { CartItemParams } from "./type";

export default function useAddCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: CartItemParams) => {
      const id = getUserIdFromStorage();
      return client.post(`/users/id/${id}/vote-cart`, params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: buildCartItemsQueryKey(getUserIdFromStorage())});
    },
  });
}
