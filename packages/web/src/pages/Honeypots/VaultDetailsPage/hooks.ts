import { IVault } from "@hats.finance/shared";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import * as savedSubmissionsService from "./savedSubmissionsService";
import { IGithubIssue } from "./types";

/**
 * Returns all saved submissions for a vault
 */
export const useSavedSubmissions = (vault: IVault | undefined): UseQueryResult<IGithubIssue[]> => {
  return useQuery({
    queryKey: ["github-issues", vault?.id],
    queryFn: () => savedSubmissionsService.getSavedSubmissions(vault?.id),
    refetchOnWindowFocus: false,
    enabled: !!vault,
  });
};

/**
 * Returns the repo name created for a vault
 */
export const useVaultRepoName = (vault: IVault | undefined): UseQueryResult<string> => {
  return useQuery({
    queryKey: ["github-repo-name", vault?.id],
    queryFn: () => savedSubmissionsService.getVaultRepoName(vault?.id),
    refetchOnWindowFocus: false,
    enabled: !!vault,
  });
};
