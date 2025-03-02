import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { buildCartItemsQueryKey, CartItem } from "./useGetCartItem";
import { useProfileStore } from "@/lib/store/profileStore";

interface DeleteCartItemParams {
  id: string;
}

export default function useDeleteCartItem() {
  const queryClient = useQueryClient();
  const profile = useProfileStore((state) => state.profile);
  const id = profile?.id ? String(profile.id) : "";

  return useMutation({
    mutationFn: async (params: DeleteCartItemParams) => {
      return client.delete(`/users/id/${id}/vote-cart`, { data: params });
    },
    onMutate: async (deletedItem: DeleteCartItemParams) => {
      await queryClient.cancelQueries({
        queryKey: buildCartItemsQueryKey(id),
      });
      const previousItems = queryClient.getQueryData<CartItem[]>(
        buildCartItemsQueryKey(id)
      );
      // Optimistically remove the cart item from cache
      queryClient.setQueryData<CartItem[]>(
        buildCartItemsQueryKey(id),
        (old) => (old ? old.filter((item) => item.id !== deletedItem.id) : [])
      );
      return { previousItems };
    },
    onError: (err, deletedItem, context: any) => {
      if (context?.previousItems) {
        queryClient.setQueryData(
          buildCartItemsQueryKey(id),
          context.previousItems
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: buildCartItemsQueryKey(id),
      });
    },
  });
}
