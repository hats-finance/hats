import { IClaimedIssue, IVault } from "@hats.finance/shared";
import { useMutation } from "@tanstack/react-query";
import { UseMutationResult, useQuery } from "@tanstack/react-query";
import { claimIssue, getClaimedIssuesByVault, getClaimedIssuesByVaultAndClaimedBy } from "./claimIssuesService";

/**
 * Gets claimed issues for a vault
 */
export const useClaimedIssuesByVault = (vault?: IVault) => {
  return useQuery<IClaimedIssue[]>({
    queryKey: ["claimed-issues-by-vault", vault?.id, vault?.chainId],
    queryFn: () => getClaimedIssuesByVault(vault!),
    enabled: !!vault,
  });
};

/**
 * Gets claimed issues for a vault and a claimed by
 */
export const useClaimedIssuesByVaultAndClaimedBy = (vault?: IVault, claimedBy?: string) => {
  return useQuery<IClaimedIssue[]>({
    queryKey: ["claimed-issues-by-vault-and-claimed-by", vault?.id, vault?.chainId, claimedBy],
    queryFn: () => getClaimedIssuesByVaultAndClaimedBy(vault!, claimedBy!),
    enabled: !!vault && !!claimedBy,
  });
};

/**
 * Upserts a profile
 */
export const useClaimIssue = (): UseMutationResult<
  IClaimedIssue | undefined,
  string,
  { vault: IVault; issueNumber: number },
  unknown
> => {
  return useMutation({
    mutationFn: ({ vault, issueNumber }) => claimIssue(vault, issueNumber),
  });
};
