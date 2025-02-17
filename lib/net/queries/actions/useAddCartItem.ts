import { KEY_ID, storage } from "@/lib/store";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import client from "../../client";

export interface Params {
  postIndexOrHash: string;
  proposalType: string;
  decision: "aye" | "nay" | "abstain";
  amount: {
    aye?: string;
    nay?: string;
    abstain?: string;
  };
  conviction: number;
}

function getUserId() {
  try {
    const id = storage.getString(KEY_ID);

    if (!id) {
      throw new Error("User ID not present in store.");
    }

    return id;
  } catch (e) {
    console.error("Unable to read user's ID: ", e);
    throw e;
  }
}

export default function useAddCartItem() {
  return useMutation({
    mutationFn: async (params: Params) => {
      const id = getUserId();
      return client.post(`/users/id/${id}/vote-cart`, params);
    },
  });
}
