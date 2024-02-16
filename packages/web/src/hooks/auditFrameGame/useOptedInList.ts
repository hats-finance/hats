import { useQuery } from "@tanstack/react-query";
import * as AuditFrameGameService from "./auditFrameGameService";

export const useOptedInList = (editSessionIdOrAddress?: string) => {
  return useQuery<string[]>({
    queryKey: ["opted-in-list", editSessionIdOrAddress],
    queryFn: () => AuditFrameGameService.getAllOptedInOnAuditCompetition(editSessionIdOrAddress),
    enabled: !!editSessionIdOrAddress,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
