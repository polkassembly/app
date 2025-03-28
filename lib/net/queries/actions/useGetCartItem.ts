import { useQuery } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { useProfileStore } from "@/lib/store/profileStore";
import { Vote } from "@/lib/types/voting";
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

const useGetCartItems = () => {
	const userId = useProfileStore((state) => state.profile?.id) ? String(useProfileStore((state) => state.profile?.id)) : "";
  return useQuery<CartItem[], Error>({
    queryKey: buildCartItemsQueryKey(userId),
    queryFn: () => getCartItemsFunction({ userId }),
    refetchOnWindowFocus: true,
  });
};

const getCartItemsFunction = async ({ userId } : { userId: string}) => {
  const response = await client.get<{ voteCart: CartItem[] }>(`users/id/${userId}/vote-cart`);
  return response.data.voteCart;
}

export { useGetCartItems, buildCartItemsQueryKey, getCartItemsFunction };
