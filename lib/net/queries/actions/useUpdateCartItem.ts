import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { buildCartItemsQueryKey, CartItem } from "./useGetCartItem";
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
    onMutate: async (updatedItem: UpdateCartItemParams) => {
      await queryClient.cancelQueries({
        queryKey: buildCartItemsQueryKey(getUserIdFromStorage()),
      });
      const previousItems = queryClient.getQueryData<CartItem[]>(
        buildCartItemsQueryKey(getUserIdFromStorage())
      );
      // Optimistically update the cart item in cache
      queryClient.setQueryData<CartItem[]>(
        buildCartItemsQueryKey(getUserIdFromStorage()),
        (old) =>
          old
            ? old.map((item) =>
                item.id === updatedItem.id ? { ...item, ...updatedItem } : item
              )
            : []
      );
      return { previousItems };
    },
    onError: (err, updatedItem, context: any) => {
      if (context?.previousItems) {
        queryClient.setQueryData(
          buildCartItemsQueryKey(getUserIdFromStorage()),
          context.previousItems
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: buildCartItemsQueryKey(getUserIdFromStorage()),
      });
    },
  });
}
