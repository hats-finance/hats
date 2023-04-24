import { UseQueryResult, useQuery, useMutation, UseMutationResult } from "@tanstack/react-query";
import { IPayoutData, IPayoutResponse, IVaultInfo, getVaultInfoFromVault } from "@hats-finance/shared";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useUserVaults } from "hooks/vaults/useUserVaults";
import * as PayoutsService from "./payoutsService.api";

// ------------------------
// QUERIES
export const usePayout = (payoutId?: string): UseQueryResult<IPayoutResponse> => {
  const { isAuthenticated } = useSiweAuth();

  return useQuery({
    queryKey: ["payout", payoutId],
    queryFn: () => PayoutsService.getPayoutById(payoutId),
    enabled: isAuthenticated && !!payoutId,
    refetchOnWindowFocus: false,
  });
};

export const useVaultInProgressPayouts = (vaultInfo?: IVaultInfo): UseQueryResult<IPayoutResponse[]> => {
  const { isAuthenticated } = useSiweAuth();

  return useQuery({
    queryKey: ["in-progress-payouts", vaultInfo?.chainId, vaultInfo?.address],
    queryFn: () => PayoutsService.getInProgressPayoutsByVault(vaultInfo),
    enabled: isAuthenticated && !!vaultInfo,
    refetchOnWindowFocus: false,
  });
};

export const usePayoutsByVaults = (): UseQueryResult<IPayoutResponse[]> => {
  const { isAuthenticated } = useSiweAuth();
  const { userVaults, isLoading: isLoadingUserVaults } = useUserVaults("all");

  const vaultsIds = userVaults?.map((vault) => `${vault.chainId}-${vault.id}`) ?? [];
  const vaultsInfo: IVaultInfo[] = userVaults?.map((vault) => getVaultInfoFromVault(vault)) ?? [];

  const queryResult = useQuery({
    queryKey: ["payouts-by-vaults", ...vaultsIds],
    queryFn: () => PayoutsService.getPayoutsByVaults(vaultsInfo),
    enabled: isAuthenticated && userVaults && userVaults.length > 0,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    isLoading: queryResult.isLoading || isLoadingUserVaults,
  } as UseQueryResult<IPayoutResponse[]>;
};

// ------------------------
// MUTATIONS
export const useCreateDraftPayout = (): UseMutationResult<string, unknown, IVaultInfo, unknown> => {
  return useMutation({
    mutationFn: (vaultInfo) => PayoutsService.createDraftPayout(vaultInfo),
  });
};

export const useSavePayout = (): UseMutationResult<
  IPayoutResponse,
  unknown,
  { payoutId: string; vaultInfo: IVaultInfo; payoutData: IPayoutData },
  unknown
> => {
  return useMutation({
    mutationFn: ({ payoutId, vaultInfo, payoutData }) => PayoutsService.savePayoutData(payoutId, vaultInfo, payoutData),
  });
};

export const useLockPayout = (): UseMutationResult<boolean, unknown, { payoutId: string }, unknown> => {
  return useMutation({
    mutationFn: ({ payoutId }) => PayoutsService.lockPayout(payoutId),
  });
};

export const useAddSignature = (): UseMutationResult<boolean, unknown, { payoutId: string; signature: string }, unknown> => {
  return useMutation({
    mutationFn: ({ payoutId, signature }) => PayoutsService.addSignature(payoutId, signature),
  });
};

export const useDeletePayout = (): UseMutationResult<boolean, unknown, { payoutId: string }, unknown> => {
  return useMutation({
    mutationFn: ({ payoutId }) => PayoutsService.deletePayoutById(payoutId),
  });
};

export const useMarkPayoutAsExecuted = (): UseMutationResult<
  boolean,
  unknown,
  { payoutId: string; txHash: string; claimId: string },
  unknown
> => {
  return useMutation({
    mutationFn: ({ payoutId, txHash, claimId }) => PayoutsService.markPayoutAsExecuted(payoutId, txHash, claimId),
  });
};
