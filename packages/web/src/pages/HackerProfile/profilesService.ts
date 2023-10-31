import { IHackerProfile } from "@hats-finance/shared";
import { AxiosError } from "axios";
import { axiosClient } from "config/axiosClient";
import { BASE_SERVICE_URL } from "settings";
import * as FilesService from "../../utils/filesService.api";

export type IUpsertedProfileResult = {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
  upsertedCount: number;
  upsertedId: string;
};

/**
 * Creates or updates a profile by username
 */
export async function upsertProfile(profile: IHackerProfile, username?: string): Promise<IUpsertedProfileResult | undefined> {
  try {
    // Pin avatar file in IPFS
    if (profile.avatar && profile.avatar.startsWith("blob:")) {
      const blob = await fetch(profile.avatar).then((r) => r.blob());
      const file = new File([blob], `avatar_${profile.username}.png`, { type: "image/png" });
      const fileUploaded = await FilesService.uploadFileToDB(file, true);
      profile.avatar = `ipfs://${fileUploaded.ipfsHash}`;
    }

    const response = await axiosClient.post(`${BASE_SERVICE_URL}/profile/${username ?? ""}`, profile);
    return response.data.profile;
  } catch (error) {
    console.log(error);
    throw ((error as AxiosError).response?.data as any)?.error;
  }
}

/**
 * Deletes a profile by username
 */
export async function deleteProfile(username: string): Promise<boolean> {
  try {
    const response = await axiosClient.delete(`${BASE_SERVICE_URL}/profile/${username}`);
    return response.status === 200;
  } catch (error) {
    console.log(error);
    throw ((error as AxiosError).response?.data as any)?.error;
  }
}

/**
 * Gets a profile by username
 */
export async function getProfileByUsername(username?: string): Promise<IHackerProfile | undefined> {
  try {
    if (!username) return undefined;

    const response = await axiosClient.get(`${BASE_SERVICE_URL}/profile/by-username/${username}`);
    return response.data.profile;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

/**
 * Gets a profile by address
 */
export async function getProfileByAddress(address?: string): Promise<IHackerProfile | undefined> {
  try {
    if (!address) return undefined;

    const response = await axiosClient.get(`${BASE_SERVICE_URL}/profile/by-address/${address}`);
    return response.data.profile;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

/**
 * Gets the availability of a username
 */
export async function isUsernameAvailable(username?: string): Promise<boolean> {
  try {
    if (!username) return false;

    const dataInStorage = JSON.parse(sessionStorage.getItem(`profileUsernameAvailability-${username.toLowerCase()}`) ?? "null");
    if (dataInStorage !== null) return dataInStorage;

    const response = await axiosClient.get(`${BASE_SERVICE_URL}/profile/availability/${username}`);
    const isAvailable = !response.data.isUsed;
    sessionStorage.setItem(`profileUsernameAvailability-${username.toLowerCase()}`, JSON.stringify(isAvailable));

    return isAvailable;
  } catch (error) {
    console.log(error);
    return false;
  }
}
