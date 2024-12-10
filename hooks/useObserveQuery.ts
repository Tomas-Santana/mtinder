import { useQuery, QueryKey } from "@tanstack/react-query";

export const useObserveQuery = <TData>(queryKey: QueryKey) => {
  return useQuery<TData>({
    queryKey,
    enabled: false,
  });
}