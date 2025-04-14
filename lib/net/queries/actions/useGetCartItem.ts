import { useQuery } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { useProfileStore } from "@/lib/store/profileStore";
import { Vote } from "@/lib/types/voting";
import { QueryHookOptions } from "@/lib/types/query";
export interface CartItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  postIndexOrHash: string;
  proposalType: string;
  decision: Vote;
  amount: {
    aye?: string;
    nay?: string;
    abstain?: string;
  };
  conviction: number;
  network: string;
  title: string;
}

const buildCartItemsQueryKey = (userId: string) => ["cart-items", userId];

const useGetCartItems = (options?: QueryHookOptions<CartItem[]>) => {
  const userProfile = useProfileStore((state) => state.profile);
  const userId = String(userProfile?.id) || ""

  return useQuery<CartItem[], Error>({
    queryKey: buildCartItemsQueryKey(userId),
    queryFn: () => getCartItemsFunction({ userId }),
    enabled: !!userProfile,
    ...options,
  });
};

const getCartItemsFunction = async ({ userId }: { userId: string }) => {
  const response = await client.get<{ voteCart: CartItem[] }>(`users/id/${userId}/vote-cart`);
  return response.data.voteCart;
}

export { useGetCartItems, buildCartItemsQueryKey, getCartItemsFunction };
