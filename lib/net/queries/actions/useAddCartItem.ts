import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { buildCartItemsQueryKey, CartItem } from "./useGetCartItem";
import { getUserIdFromStorage } from "../utils";
import { CartItemParams } from "./type";

export default function useAddCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: CartItemParams) => {
      const id = getUserIdFromStorage();
      return client.post(`/users/id/${id}/vote-cart`, params);
    },
    onMutate: async (newItem: CartItemParams) => {
      await queryClient.cancelQueries({
        queryKey: buildCartItemsQueryKey(getUserIdFromStorage()),
      });
      const previousItems = queryClient.getQueryData<CartItem[]>(
        buildCartItemsQueryKey(getUserIdFromStorage())
      );
      // Create an optimistic cart item with a temporary ID and timestamps.
      const optimisticItem: CartItem = {
        ...newItem,
        id: "temp-id-" + new Date().getTime(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: Number(getUserIdFromStorage()),
        proposalType: "",
        postIndexOrHash: "",
        network: "",
        title: "",
      };
      queryClient.setQueryData<CartItem[]>(
        buildCartItemsQueryKey(getUserIdFromStorage()),
        (old) => (old ? [...old, optimisticItem] : [optimisticItem])
      );
      return { previousItems };
    },
    onError: (err, newItem, context: any) => {
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
