import { axiosClient } from "config/axiosClient";
import { BASE_SERVICE_URL } from "settings";

/**
 * Opt-In a user to an audit competition
 */
export async function optInToAuditCompetition(editSessionIdOrAddress: string): Promise<boolean> {
  try {
    const response = await axiosClient.post(`${BASE_SERVICE_URL}/edit-session/${editSessionIdOrAddress}/register-user`, {
      register: true,
    });
    return response.data.ok;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * Opt-Out a user from an audit competition
 */
export async function optOutToAuditCompetition(editSessionIdOrAddress: string): Promise<boolean> {
  try {
    const response = await axiosClient.post(`${BASE_SERVICE_URL}/edit-session/${editSessionIdOrAddress}/register-user`, {
      register: false,
    });
    return response.data.ok;
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * Get list of all the users opted in to an audit competition
 */
export async function getAllOptedInOnAuditCompetition(editSessionIdOrAddress?: string): Promise<string[]> {
  if (!editSessionIdOrAddress) return [];

  try {
    const response = await axiosClient.get(`${BASE_SERVICE_URL}/edit-session/${editSessionIdOrAddress}/list-opted-in-users`);
    return response.data.optedInUsers ?? [];
  } catch (error) {
    console.log(error);
    return [];
  }
}
