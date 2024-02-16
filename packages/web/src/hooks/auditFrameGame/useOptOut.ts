import { UseMutationResult, useMutation } from "@tanstack/react-query";
import * as AuditFrameGameService from "./auditFrameGameService";

export const useOptOut = (): UseMutationResult<boolean, string, { editSessionIdOrAddress: string }, unknown> => {
  return useMutation({
    mutationFn: ({ editSessionIdOrAddress }) => AuditFrameGameService.optOutToAuditCompetition(editSessionIdOrAddress),
  });
};
