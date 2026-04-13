import { useQuery } from "@tanstack/react-query";
import { fetchTipOfTheDay } from "@/services/api/healthApi";

export const useTipOfTheDay = () => {
  return useQuery({
    queryKey: ["tipOfTheDay"],
    queryFn: fetchTipOfTheDay,
    staleTime: 1000 * 60 * 10,
  });
};

