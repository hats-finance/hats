import { IPayoutData } from "./../../../../../shared/src/types/payout";
import { IPayoutResponse } from "@hats-finance/shared";
import { BASE_SERVICE_URL } from "settings";
import { axiosClient } from "config/axiosClient";

/**
 * Gets a payout by id
 * @param payoutId - The payout id to get
 */
export async function getPayoutData(payoutId: string): Promise<IPayoutResponse | undefined> {
  try {
    const res = await axiosClient.get(`${BASE_SERVICE_URL}/payouts/${payoutId}`);
    return res.status === 200 ? res.data.payout : undefined;
  } catch (error) {
    return undefined;
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
