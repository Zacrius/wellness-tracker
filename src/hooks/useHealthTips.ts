import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchHealthTipsPaginated } from "@/services/api/healthApi";

export const useHealthTipsPaginated = () => {
  return useInfiniteQuery({
    queryKey: ["healthTipsPaginated"],
    queryFn: ({ pageParam = 1 }) => fetchHealthTipsPaginated(pageParam, 5),
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.hasMore) {
        return lastPageParam + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
