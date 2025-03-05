import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { buildCartItemsQueryKey, CartItem } from "./useGetCartItem";
import { CartItemParams } from "./type";
import { useProfileStore } from "@/lib/store/profileStore";

export default function useAddCartItem() {
  const queryClient = useQueryClient();
  const profile = useProfileStore((state) => state.profile);
  const id = profile?.id ? String(profile.id) : "";
  
  return useMutation({
    mutationFn: async (params: CartItemParams) => {
      return client.post(`/users/id/${id}/vote-cart`, params);
    },
    onMutate: async (newItem: CartItemParams) => {
      await queryClient.cancelQueries({
        queryKey: buildCartItemsQueryKey(id),
      });
      const previousItems = queryClient.getQueryData<CartItem[]>(
        buildCartItemsQueryKey(id)
      );
      // Create an optimistic cart item with a temporary ID and timestamps.
      const optimisticItem: CartItem = {
        ...newItem,
        id: "temp-id-" + new Date().getTime(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: Number(id),
        proposalType: "",
        postIndexOrHash: "",
        network: "",
        title: "",
      };
      queryClient.setQueryData<CartItem[]>(
        buildCartItemsQueryKey(id),
        (old) => (old ? [...old, optimisticItem] : [optimisticItem])
      );
      return { previousItems };
    },
    onError: (err, newItem, context: any) => {
      if (context?.previousItems) {
        queryClient.setQueryData(
          buildCartItemsQueryKey(id),
          context.previousItems
        );
      }
      console.error(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: buildCartItemsQueryKey(id),
      });
    },
  });
}
