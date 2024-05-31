import { axiosClient } from "config/axiosClient";
import { BASE_SERVICE_URL } from "settings";
import { UserPointsData } from "./types";

export async function getPointsDataByUser(username?: string): Promise<UserPointsData | undefined> {
  if (!username) return undefined;
  const response = await axiosClient.get(`${BASE_SERVICE_URL}/points/points-data/${username}`);
  return response.data.data ?? undefined;
}
