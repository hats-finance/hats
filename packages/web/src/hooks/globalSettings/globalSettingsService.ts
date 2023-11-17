import { axiosClient } from "config/axiosClient";
import { BASE_SERVICE_URL } from "settings";

/**
 * Gets all the excluded finished competitions ids
 */
export async function getExcludedFinishedCompetitions(): Promise<string[]> {
  try {
    const response = await axiosClient.get(`${BASE_SERVICE_URL}/global-settings/excluded-finished-competitions`);
    return response.data.vaultsIds;
  } catch (error) {
    console.log(error);
    return [];
  }
}
