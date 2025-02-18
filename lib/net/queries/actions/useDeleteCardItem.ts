import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { buildCartItemsQueryKey } from "./useGetCartItem";
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
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: buildCartItemsQueryKey(getUserIdFromStorage()) });
		},
	});
}
