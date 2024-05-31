import { useQuery } from "@tanstack/react-query";
import { getPointsDataByUser } from "./pointsService";

export const usePointsDataByUser = (username?: string) => {
  return useQuery({
    queryKey: ["points-data", username],
    queryFn: () => getPointsDataByUser(username),
    enabled: !!username,
  });
};
