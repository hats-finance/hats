import { IPayoutData, IPayoutResponse, IVaultInfo, PayoutType } from "@hats.finance/shared";
import { UseMutationResult, UseQueryResult, useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import * as PayoutsService from "./payoutsService.api";

// ------------------------
// QUERIES
export const usePayout = (payoutId?: string): UseQueryResult<IPayoutResponse, AxiosError> => {
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

export const usePayoutsBySiweUser = (): UseQueryResult<IPayoutResponse[]> => {
  const { isAuthenticated, profileData } = useSiweAuth();

  const queryResult = useQuery({
    queryKey: ["payouts-by-siwe-user", profileData.address],
    queryFn: () => PayoutsService.getAllPayoutsBySiweUser(),
    enabled: isAuthenticated && !!profileData.address,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    isLoading: queryResult.isLoading,
  } as UseQueryResult<IPayoutResponse[]>;
};

// ------------------------
// MUTATIONS
export const useCreateDraftPayout = (): UseMutationResult<
  string,
  unknown,
  { vaultInfo: IVaultInfo; type: PayoutType; payoutData: IPayoutData },
  unknown
> => {
  return useMutation({
    mutationFn: ({ vaultInfo, type, payoutData }) => PayoutsService.createDraftPayout(vaultInfo, type, payoutData),
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
