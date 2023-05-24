import { IPayoutData, IPayoutResponse, IVaultInfo, PayoutType } from "@hats-finance/shared";
import { axiosClient } from "config/axiosClient";
import { BASE_SERVICE_URL } from "settings";

/**
 * Gets a payout by id
 * @param payoutId - The payout id to get
 */
export async function getPayoutById(payoutId?: string): Promise<IPayoutResponse> {
  const res = await axiosClient.get(`${BASE_SERVICE_URL}/payouts/${payoutId}`);
  return res.data.payout;
}

/**
 * Deletes a payout by id
 * @param payoutId - The payout id to delete
 */
export async function deletePayoutById(payoutId?: string): Promise<boolean> {
  const res = await axiosClient.delete(`${BASE_SERVICE_URL}/payouts/${payoutId}`);
  return res.status === 200 ? res.data.ok : false;
}

/**
 * Gets a list of all the payouts of the SiWe user
 */
export async function getAllPayoutsBySiweUser(): Promise<IPayoutResponse[]> {
  const res = await axiosClient.get(`${BASE_SERVICE_URL}/payouts/all/by-siwe-user`);
  return res.data.payouts;
}

/**
 * Gets a list of all the in progress payouts of a vault
 * @param vaultAddress - The vault address to create the payout
 * @param chainId - The vault chain id to create the payout
 *
 * @returns A list of in progress payouts
 */
export async function getInProgressPayoutsByVault(vaultInfo?: IVaultInfo): Promise<IPayoutResponse[]> {
  if (!vaultInfo) return [];

  const res = await axiosClient.get(`${BASE_SERVICE_URL}/payouts/in-progress`, {
    params: { vaultAddress: vaultInfo.address, chainId: vaultInfo.chainId },
  });
  return res.data.payouts;
}

/**
 * Creates a new payout
 * @param vaultInfo - The vault info to create the payout
 * @param type - The payout type to create
 *
 * @returns The id of the created payout
 */
export async function createDraftPayout(vaultInfo: IVaultInfo, type: PayoutType): Promise<string> {
  const res = await axiosClient.post(`${BASE_SERVICE_URL}/payouts`, {
    vaultAddress: vaultInfo.address,
    chainId: vaultInfo.chainId,
    type,
  });
  return res.data.upsertedId;
}

/**
 * Saves an existent payout
 * @param payoutId - The payout id to save
 * @param vaultInfo - The vault info to create the payout
 * @param payoutData - The payout data to save
 *
 * @returns The updated payout
 */
export async function savePayoutData(payoutId: string, vaultInfo: IVaultInfo, payoutData: IPayoutData): Promise<IPayoutResponse> {
  const res = await axiosClient.post(`${BASE_SERVICE_URL}/payouts/${payoutId}`, {
    vaultAddress: vaultInfo.address,
    chainId: vaultInfo.chainId,
    payoutData,
  });
  return res.data.payout;
}

/**
 * Locks a payout. This means, the payout is set to  "Peding" and a nonce is generated
 * @param payoutId - The payout id to lock
 *
 * @returns True if the payout was locked, false otherwise
 */
export async function lockPayout(payoutId: string): Promise<boolean> {
  const res = await axiosClient.post(`${BASE_SERVICE_URL}/payouts/lock/${payoutId}`);
  return res.status === 200 ? res.data.ok : false;
}

/**
 * Adds a new signature to a payout
 * @param payoutId - The payout id
 * @param signature - The signature to add
 *
 * @returns True if the signature was added, false otherwise
 */
export async function addSignature(payoutId: string, signature: string): Promise<boolean> {
  const res = await axiosClient.post(`${BASE_SERVICE_URL}/payouts/signatures/${payoutId}`, { signature });
  return res.status === 200 ? res.data.ok : false;
}

/**
 * Marks a payout as executed
 * @param payoutId - The payout id to mark as executed
 * @param payoutTxHash - The payout transaction hash
 * @param payoutClaimId - The payout claim id
 *
 * @returns True if the payout was marked as executed, false otherwise
 */
export async function markPayoutAsExecuted(payoutId: string, payoutTxHash: string, payoutClaimId: string): Promise<boolean> {
  const res = await axiosClient.post(`${BASE_SERVICE_URL}/payouts/executed/${payoutId}`, { payoutTxHash, payoutClaimId });
  return res.status === 200 ? res.data.ok : false;
}
