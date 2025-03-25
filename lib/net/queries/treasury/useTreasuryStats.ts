import { ITreasuryStats } from "@/lib/types/meta";
import { useQuery } from "@tanstack/react-query";
import client from "../../client";

const buildUseTreasuryStatsKey = () => ["treasury"];

const useTreasuryStats = () => {
    return useQuery<ITreasuryStats[], Error>({
        queryKey: buildUseTreasuryStatsKey(),
        queryFn: async () => {
            const res = await client.get<ITreasuryStats[]>(`meta/treasury-stats`)
            return res.data
        },
    });
}

export default useTreasuryStats;