import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { buildCartItemsQueryKey, CartItem } from "./useGetCartItem";
import { getUserIdFromStorage } from "../utils";

interface DeleteCartItemParams {
  id: string;
}

export default function useDeleteCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: DeleteCartItemParams) => {
      const id = getUserIdFromStorage();
      return client.delete(`/users/id/${id}/vote-cart`, { data: params });
    },
    onMutate: async (deletedItem: DeleteCartItemParams) => {
      await queryClient.cancelQueries({
        queryKey: buildCartItemsQueryKey(getUserIdFromStorage()),
      });
      const previousItems = queryClient.getQueryData<CartItem[]>(
        buildCartItemsQueryKey(getUserIdFromStorage())
      );
      // Optimistically remove the cart item from cache
      queryClient.setQueryData<CartItem[]>(
        buildCartItemsQueryKey(getUserIdFromStorage()),
        (old) => (old ? old.filter((item) => item.id !== deletedItem.id) : [])
      );
      return { previousItems };
    },
    onError: (err, deletedItem, context: any) => {
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
