import { UseQueryOptions } from "@tanstack/react-query";

type QueryHookOptions<TData> = Partial<UseQueryOptions<TData, Error, TData>>;

export type { QueryHookOptions };