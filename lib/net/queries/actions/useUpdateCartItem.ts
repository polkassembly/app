import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { buildCartItemsQueryKey, CartItem } from "./useGetCartItem";
import { useProfileStore } from "@/lib/store/profileStore";

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
  const id = useProfileStore((state) => state.profile?.id) ? String(useProfileStore((state) => state.profile?.id)) : "";
  return useMutation({
    mutationFn: async (params: UpdateCartItemParams) => {
      return client.patch(`/users/id/${id}/vote-cart`, params);
    },
    onMutate: async (updatedItem: UpdateCartItemParams) => {
      await queryClient.cancelQueries({
        queryKey: buildCartItemsQueryKey(id),
      });
      const previousItems = queryClient.getQueryData<CartItem[]>(
        buildCartItemsQueryKey(id)
      );
      // Optimistically update the cart item in cache
      queryClient.setQueryData<CartItem[]>(
        buildCartItemsQueryKey(id),
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
