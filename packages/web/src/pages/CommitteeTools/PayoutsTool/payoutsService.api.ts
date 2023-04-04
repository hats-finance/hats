import { IPayoutResponse, IPayoutData } from "@hats-finance/shared";
import { BASE_SERVICE_URL } from "settings";
import { axiosClient } from "config/axiosClient";

/**
 * Gets a payout by id
 * @param payoutId - The payout id to get
 */
export async function getPayoutById(payoutId?: string): Promise<IPayoutResponse> {
  try {
    const res = await axiosClient.get(`${BASE_SERVICE_URL}/payouts/${payoutId}`);
    return res.data.payout;
  } catch (error) {
    throw new Error(`Unknown error: ${error}`);
  }
}

/**
 * Gets a list of all the payouts of a vaults list
 * @param vaultsList: { chainId: number; vaultAddress: string }[] - The list of vaults to get the payouts from
 */
export async function getPayoutsListByVault(vaultsList: { chainId: number; vaultAddress: string }[]): Promise<IPayoutResponse[]> {
  try {
    const res = await axiosClient.get(`${BASE_SERVICE_URL}/payouts/all/vaultsList`, {
      params: { vaults: JSON.stringify(vaultsList) },
    });
    return res.status === 200 ? res.data.payouts : [];
  } catch (error) {
    return [];
  }
}

/**
 * Gets a list of all the active payouts of a vault
 * @param vaultAddress - The vault address to create the payout
 * @param chainId - The vault chain id to create the payout
 *
 * @returns A list of active payouts
 */
export async function getActivePayoutsByVault(chainId?: number, vaultAddress?: string): Promise<IPayoutResponse[]> {
  try {
    const res = await axiosClient.get(`${BASE_SERVICE_URL}/payouts/active/${chainId}/${vaultAddress}`);
    return res.data.payouts;
  } catch (error) {
    throw new Error(`Unknown error: ${error}`);
  }
}

/**
 * Creates a new payout
 * @param vaultAddress - The vault address to create the payout
 * @param chainId - The vault chain id to create the payout
 *
 * @returns The id of the created payout
 */
export async function createNewPayout(chainId: number, vaultAddress: string): Promise<string | undefined> {
  try {
    const res = await axiosClient.post(`${BASE_SERVICE_URL}/payouts/${chainId}/${vaultAddress}`);
    return res.status === 201 ? res.data.upsertedId : undefined;
  } catch (error) {
    return undefined;
  }
}

/**
 * Creates a new payout
 * @param vaultAddress - The vault address to create the payout
 * @param chainId - The vault chain id to create the payout
 *
 * @returns The id of the created payout
 */
export async function savePayoutData(
  payoutId: string,
  chainId: number,
  vaultAddress: string,
  payoutData: IPayoutData
): Promise<IPayoutResponse | undefined> {
  try {
    const res = await axiosClient.post(`${BASE_SERVICE_URL}/payouts/${chainId}/${vaultAddress}/${payoutId}`, { ...payoutData });
    return res.status === 200 ? res.data.payout : undefined;
  } catch (error) {
    return undefined;
  }
}

/**
 * Locks a payout. This means, the payout is set to  "Peding" and a nonce is generated
 * @param payoutId - The payout id to lock
 *
 * @returns True if the payout was locked, false otherwise
 */
export async function lockPayout(payoutId: string): Promise<boolean> {
  try {
    const res = await axiosClient.post(`${BASE_SERVICE_URL}/payouts/lock/${payoutId}`);
    return res.status === 200 ? res.data.ok : false;
  } catch (error) {
    return false;
  }
}
