import { useEffect } from "react";
import { UseQueryResult, useQuery, useMutation, UseMutationResult } from "@tanstack/react-query";
import { IPayoutData, IPayoutResponse } from "@hats-finance/shared";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import * as PayoutsService from "./payoutsService.api";

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
