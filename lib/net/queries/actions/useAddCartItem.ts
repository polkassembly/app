import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { buildCartItemsQueryKey, CartItem } from "./useGetCartItem";
import { CartItemParams, ENetwork } from "./type";
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

      // Check if the item with the same proposal exists
      const existingItemIndex = previousItems?.findIndex(
        (item) => item.postIndexOrHash === newItem.postIndexOrHash
      );

      let updatedItems;
      let isUpdated = false;
      if (existingItemIndex !== undefined && existingItemIndex !== -1) {
        // If the proposal already exists, update it
        updatedItems = previousItems?.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                ...newItem,
                updatedAt: new Date().toISOString(),
              }
            : item
        );
        isUpdated = true;
      } else {
        // If no existing proposal, add new item
        const optimisticItem: CartItem = {
          ...newItem,
          id: "temp-id-" + new Date().getTime(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: Number(id),
          proposalType: newItem.proposalType,
          postIndexOrHash: newItem.postIndexOrHash,
          network: ENetwork.POLKADOT,
          title: newItem.postIndexOrHash,
        };
        updatedItems = previousItems ? [...previousItems, optimisticItem] : [optimisticItem];
      }

      // Set the updated list in the cache
      queryClient.setQueryData<CartItem[]>(
        buildCartItemsQueryKey(id),
        updatedItems
      );
      return { previousItems, isUpdated };
    },
    onError: (err, context: any) => {
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
