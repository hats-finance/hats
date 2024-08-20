import { IHackerProfile } from "@hats.finance/shared";
import { UseMutationResult, useMutation, useQuery } from "@tanstack/react-query";
import { ISiweData } from "hooks/siwe/useSiweAuth";
import {
  IUpsertedProfileResult,
  createCuratorApplication,
  deleteProfile,
  getApprovedCurators,
  getProfileByAddress,
  getProfileByUsername,
  isUsernameAvailable,
  linkNewAddress,
  removeAddress,
  upsertProfile,
} from "./profilesService";

/**
 * Gets a profile by address
 */
export const useProfileByAddress = (address?: string) => {
  return useQuery<IHackerProfile | undefined>({
    queryKey: ["hacker-profile-address", address],
    queryFn: () => getProfileByAddress(address),
    enabled: !!address,
  });
};

/**
 * Gets a profile by username
 */
export const useProfileByUsername = (username?: string) => {
  return useQuery<IHackerProfile | undefined>({
    queryKey: ["hacker-profile-username", username],
    queryFn: () => getProfileByUsername(username),
    enabled: !!username,
  });
};

/**
 * Gets all approved curators
 */
export const useApprovedCurators = () => {
  return useQuery<IHackerProfile[]>({
    queryKey: ["approved-curators"],
    queryFn: () => getApprovedCurators(),
  });
};

/**
 * Gets the availability of a username
 */
export const useUsernameAvailability = (username?: string) => {
  return useQuery<boolean>({
    queryKey: ["hacker-profile-availability", username],
    queryFn: () => isUsernameAvailable(username),
    enabled: !!username,
  });
};

/**
 * Upserts a profile
 */
export const useUpsertProfile = (): UseMutationResult<
  IUpsertedProfileResult | undefined,
  string,
  { profile: IHackerProfile; username?: string },
  unknown
> => {
  return useMutation({
    mutationFn: ({ profile, username }) => upsertProfile(profile, username),
  });
};

/**
 * Creates a curator application
 */
export const useCreateCuratorApplication = (): UseMutationResult<
  IUpsertedProfileResult | undefined,
  string,
  { curatorForm: IHackerProfile["curatorApplication"]; username?: string },
  unknown
> => {
  return useMutation({
    mutationFn: ({ curatorForm, username }) => createCuratorApplication(curatorForm, username),
  });
};

/**
 * Deletes a profile
 */
export const useDeleteProfile = (): UseMutationResult<boolean, string, { username: string }, unknown> => {
  return useMutation({
    mutationFn: ({ username }) => deleteProfile(username),
  });
};

/**
 * Links a new address to a profile
 */
export const useLinkNewAddress = (): UseMutationResult<
  IUpsertedProfileResult | undefined,
  string,
  { username: string; profileOwnerSiwe: ISiweData },
  unknown
> => {
  return useMutation({
    mutationFn: ({ username, profileOwnerSiwe }) => linkNewAddress(username, profileOwnerSiwe),
  });
};

/**
 * Unlinks an address from a profile
 */
export const useUnlinkAddress = (): UseMutationResult<
  IUpsertedProfileResult | undefined,
  string,
  { username: string; addressToRemove: string },
  unknown
> => {
  return useMutation({
    mutationFn: ({ username, addressToRemove }) => removeAddress(username, addressToRemove),
  });
};
