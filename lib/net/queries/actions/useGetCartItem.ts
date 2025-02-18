import { useQuery } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { storage } from "@/lib/store";
import { getUserIdFromStorage } from "../utils";

export interface CartItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  postIndexOrHash: string;
  proposalType: string;
  decision: "aye" | "nay" | "abstain";
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
	const userId = getUserIdFromStorage();
  return useQuery<CartItem[], Error>({
    queryKey: buildCartItemsQueryKey(userId),
    queryFn: async () => {
      const response = await client.get<{ voteCart: CartItem[] }>(`users/id/${userId}/vote-cart`);
      return response.data.voteCart;
    },
    refetchOnWindowFocus: true,
  });
};

export { useGetCartItems, buildCartItemsQueryKey };
