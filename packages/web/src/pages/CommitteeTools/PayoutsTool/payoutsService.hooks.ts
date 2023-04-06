import { useEffect } from "react";
import { UseQueryResult, useQuery, useMutation, UseMutationResult } from "@tanstack/react-query";
import { IPayoutData, IPayoutResponse, IVault } from "@hats-finance/shared";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import * as PayoutsService from "./payoutsService.api";

// ------------------------
// QUERIES
export const usePayout = (payoutId?: string): UseQueryResult<IPayoutResponse> => {
  const { tryAuthentication, isAuthenticated } = useSiweAuth();

  useEffect(() => {
    tryAuthentication();
  }, [tryAuthentication]);

  return useQuery({
    queryKey: ["payout", payoutId],
    queryFn: () => PayoutsService.getPayoutById(payoutId),
    enabled: isAuthenticated && !!payoutId,
    refetchOnWindowFocus: false,
  });
};

export const useVaultActivePayouts = (chainId?: number, vaultAddress?: string): UseQueryResult<IPayoutResponse[]> => {
  const { tryAuthentication, isAuthenticated } = useSiweAuth();

  useEffect(() => {
    tryAuthentication();
  }, [tryAuthentication]);

  return useQuery({
    queryKey: ["active-payouts", chainId, vaultAddress],
    queryFn: () => PayoutsService.getActivePayoutsByVault(chainId, vaultAddress),
    enabled: isAuthenticated && !!chainId && !!vaultAddress,
    refetchOnWindowFocus: false,
  });
};

export const usePayoutsByVaults = (vaultsList: IVault[]): UseQueryResult<IPayoutResponse[]> => {
  const { tryAuthentication, isAuthenticated } = useSiweAuth();

  useEffect(() => {
    tryAuthentication();
  }, [tryAuthentication]);

  const vaultsIds = vaultsList.map((vault) => `${vault.chainId}-${vault.id}`);
  const vaultsInfo = vaultsList.map((vault) => ({ chainId: vault.chainId as number, vaultAddress: vault.id }));

  return useQuery({
    queryKey: ["payouts-by-vaults", ...vaultsIds],
    queryFn: () => PayoutsService.getPayoutsByVaults(vaultsInfo),
    enabled: isAuthenticated && vaultsList.length > 0,
    refetchOnWindowFocus: false,
  });
};

// ------------------------
// MUTATIONS
export const useCreateDraftPayout = (): UseMutationResult<
  string,
  unknown,
  { chainId: number; vaultAddress: string },
  unknown
> => {
  return useMutation({
    mutationFn: ({ chainId, vaultAddress }) => PayoutsService.createDraftPayout(chainId, vaultAddress),
  });
};

export const useSavePayout = (): UseMutationResult<
  IPayoutResponse,
  unknown,
  { payoutId: string; chainId: number; vaultAddress: string; payoutData: IPayoutData },
  unknown
> => {
  return useMutation({
    mutationFn: ({ payoutId, chainId, vaultAddress, payoutData }) =>
      PayoutsService.savePayoutData(payoutId, chainId, vaultAddress, payoutData),
  });
};

export const useLockPayout = (): UseMutationResult<boolean, unknown, { payoutId: string }, unknown> => {
  return useMutation({
    mutationFn: ({ payoutId }) => PayoutsService.lockPayout(payoutId),
  });
};

export const useDeletePayout = (): UseMutationResult<boolean, unknown, { payoutId: string }, unknown> => {
  return useMutation({
    mutationFn: ({ payoutId }) => PayoutsService.deletePayoutById(payoutId),
  });
};
