import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { useProfileStore } from "@/lib/store/profileStore";
import { buildCartItemsQueryKey, CartItem } from "../useGetCartItem";

export default function useClearCart() {
  const queryClient = useQueryClient();
  const profile = useProfileStore((state) => state.profile);
  const id = profile?.id ? String(profile.id) : "";

  return useMutation<unknown, unknown, void, { previousItems?: CartItem[] }>({
    mutationFn: async () => {
      await client.delete(`/users/id/${id}/vote-cart/clear`);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: buildCartItemsQueryKey(id),
      });

      const previousItems = queryClient.getQueryData<CartItem[]>(
        buildCartItemsQueryKey(id)
      );

      queryClient.setQueryData<CartItem[]>(buildCartItemsQueryKey(id), []);

      return { previousItems };
    },
    onError: (_error, _vars, context) => {
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
