import { IVault } from "@hats.finance/shared";
import { UseMutationResult, UseQueryResult, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAccount, useMutation } from "wagmi";
import * as messageSignaturesService from "./messageSignaturesService";
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

/**
 * Returns true if the user already collected the message signature
 */
export const useUserHasCollectedSignature = (vault: IVault | undefined): UseQueryResult<boolean> => {
  const { address: account } = useAccount();

  return useQuery({
    queryKey: ["vault-message-signatures", vault?.id, account],
    queryFn: async () => {
      if (!vault?.description?.["project-metadata"].requireMessageSignature) return false;

      try {
        const messageSignatures = await messageSignaturesService.getMessageSignatures(vault?.id);
        return messageSignatures.some((signature) => signature.address.toLowerCase() === account?.toLowerCase());
      } catch (error) {
        return [];
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!vault,
  });
};

export const useCollectMessageSignature = (): UseMutationResult<
  boolean,
  AxiosError,
  { vaultAddress: string; signature: string; expectedAddress: string },
  unknown
> => {
  return useMutation({
    mutationFn: ({ vaultAddress, signature, expectedAddress }) =>
      messageSignaturesService.collectMessageSignature(vaultAddress, signature, expectedAddress),
  });
};
