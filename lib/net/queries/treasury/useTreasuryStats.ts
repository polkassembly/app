import { ITreasuryStats } from "@/lib/types/meta";
import { useQuery } from "@tanstack/react-query";
import client from "../../client";
import { QueryHookOptions } from "@/lib/types/query";

const buildUseTreasuryStatsKey = () => ["treasury"];

const useTreasuryStats = (options?: QueryHookOptions<ITreasuryStats[]>) => {
    return useQuery<ITreasuryStats[], Error>({
        queryKey: buildUseTreasuryStatsKey(),
        queryFn: async () => {
            const res = await client.get<ITreasuryStats[]>(`meta/treasury-stats`)
            return res.data
        },
        ...options,
    });
}

export default useTreasuryStats;