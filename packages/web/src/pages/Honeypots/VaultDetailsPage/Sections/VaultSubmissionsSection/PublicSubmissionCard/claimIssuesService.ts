import { IClaimedIssue, IVault } from "@hats.finance/shared";
import { AxiosError } from "axios";
import { axiosClient } from "config/axiosClient";
import { BASE_SERVICE_URL } from "settings";

/**
 * Claims an issue for a vault
 */
export async function claimIssue(vault: IVault, issueNumber: number): Promise<IClaimedIssue | undefined> {
  try {
    const response = await axiosClient.post(`${BASE_SERVICE_URL}/submission-bonus-points/claim/${vault.id}`, {
      issueNumber,
    });
    return response.data.claimedIssue;
  } catch (error) {
    console.log(error);
    throw ((error as AxiosError).response?.data as any)?.error;
  }
}

/**
 * Gets claimed issues for a vault
 */
export async function getClaimedIssuesByVault(vault: IVault): Promise<IClaimedIssue[]> {
  const response = await axiosClient.get(`${BASE_SERVICE_URL}/submission-bonus-points/claim/${vault.id}`);
  return response.data.claimedIssues ?? [];
}

/**
 * Gets claimed issues for a vault and a claimed by
 */
export async function getClaimedIssuesByVaultAndClaimedBy(vault: IVault, claimedBy: string): Promise<IClaimedIssue[]> {
  const response = await axiosClient.get(`${BASE_SERVICE_URL}/submission-bonus-points/claim/${vault.id}/${claimedBy}`);
  return response.data.claimedIssues ?? [];
}
