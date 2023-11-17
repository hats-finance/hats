import { useQuery } from "@tanstack/react-query";
import { getExcludedFinishedCompetitions } from "./globalSettingsService";

export const useExcludedFinishedCompetitions = () => {
  return useQuery<string[]>({
    queryKey: ["excluded-finished-competitions"],
    queryFn: () => getExcludedFinishedCompetitions(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
