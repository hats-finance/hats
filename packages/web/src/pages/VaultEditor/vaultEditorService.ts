import { getContract, getProvider, readContracts } from "wagmi/actions";
import {
  HATSVaultsRegistry_abi,
  HATSVaultV2_abi,
  IEditedSessionResponse,
  IEditedVaultDescription,
  IVaultDescription,
} from "@hats-finance/shared";
import { getPath, setPath } from "utils/objects.utils";
import { isBlob } from "utils/files.utils";
import { axiosClient } from "config/axiosClient";
import { BASE_SERVICE_URL, appChains } from "settings";
import { ipfsTransformUri } from "utils";
import { IVaultStatusData } from "./VaultStatusPage/types";

/**
 * Gets an edit session data
 * @param editSessionId - The edit session id
 */
export async function getEditSessionData(editSessionId: string): Promise<IEditedSessionResponse> {
  const response = await axiosClient.get(`${BASE_SERVICE_URL}/edit-session/${editSessionId}`);
  const isExistingVault = response.data.vaultAddress !== undefined;

  // Get maxBountyPercentage from the vault if it's an existing vault
  if (isExistingVault) {
    const vaultContract = getContract({
      address: response.data.vaultAddress,
      abi: HATSVaultV2_abi,
      signerOrProvider: getProvider({ chainId: response.data.chainId }),
    });

    const maxBountyPercentage = await vaultContract.maxBounty();
    (response.data as IEditedSessionResponse).editedDescription.parameters.maxBountyPercentage = maxBountyPercentage / 100;
  }

  return response.data;
}

/**
 * Creates or update an edit session
 *
 * @param editSession - The edit session data (undefined for creation)
 * @param editSessionId - The edit session id (undefined for creation)
 * @param ipfsDescriptionHash - The ipfs description hash if you want to create a edit session from an existing ipfs (for v1)
 */
export async function upsertEditSession(
  editSession: IEditedVaultDescription | undefined,
  editSessionId: string | undefined,
  ipfsDescriptionHash?: string | undefined
): Promise<string | IEditedSessionResponse> {
  const iconsPaths = ["project-metadata.icon", "project-metadata.tokenIcon"];
  editSession?.committee.members.map((_, index) => iconsPaths.push(`committee.members.${index}.image-ipfs-link`));

  const formData = new FormData();

  for (const iconPath of iconsPaths) {
    const value = getPath(editSession, iconPath);

    if (typeof value !== "string") continue;
    if (isBlob(value)) {
      formData.append(iconPath, await (await fetch(value)).blob());
      setPath(editSession, iconPath, "");
    }
  }

  if (editSession) formData.append("editedDescription", JSON.stringify(editSession));
  if (ipfsDescriptionHash) formData.append("ipfsDescriptionHash", ipfsDescriptionHash);

  const response = await axiosClient.post(`${BASE_SERVICE_URL}/edit-session/${editSessionId ?? ""}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.headers["x-new-id"] ?? (response.data as IEditedSessionResponse);
}

/**
 * Set a editSession as submitted to creation
 *
 * @param editSessionId - The edit session id
 */
export async function setEditSessionSubmittedToCreation(editSessionId: string | undefined): Promise<boolean> {
  if (!editSessionId) throw new Error("Edit session id is required");

  const response = await axiosClient.get(`${BASE_SERVICE_URL}/edit-session/${editSessionId}/set-awaiting-creation`);

  return response.data.ok;
}

/**
 * Resends the verification email to and specific email
 *
 * @param editSessionId - The edit session id
 * @param email - The email to send the verification email
 */
export async function resendVerificationEmail(editSessionId: string, email: string): Promise<boolean> {
  try {
    const res = await axiosClient.get(
      `${BASE_SERVICE_URL}/edit-session/${editSessionId}/resend-verification-email?address=${email}`
    );
    return res.status === 200 ? true : false;
  } catch (error) {
    return false;
  }
}

/**
 * Put back to 'editing' a vault that was in 'pendingApproval' status
 *
 * @param editSessionId - The edit session id
 */
export async function cancelEditionApprovalRequest(editSessionId: string): Promise<IEditedSessionResponse | null> {
  try {
    const res = await axiosClient.get(`${BASE_SERVICE_URL}/edit-session/${editSessionId}/cancel-approval-request`);
    return res.status === 200 ? res.data : null;
  } catch (error) {
    return null;
  }
}

/**
 * Put in 'pendingApproval' a vault that was in 'editing' status
 *
 * @param editSessionId - The edit session id
 */
export async function sendEditionToGovApproval(editSessionId: string): Promise<IEditedSessionResponse | null> {
  try {
    const res = await axiosClient.get(`${BASE_SERVICE_URL}/edit-session/${editSessionId}/send-to-gov-approval`);
    return res.status === 200 ? res.data : null;
  } catch (error) {
    return null;
  }
}

/**
 * Gets all the information of a vault for showing it on the status page, includes off-chain and on-chain data
 *
 * @param vaultAddress - The vault address
 * @param chainId - The chain id of the vault
 */
export async function getVaultInformation(vaultAddress: string, chainId: number): Promise<IVaultStatusData> {
  const vaultContractInfo = {
    address: vaultAddress,
    abi: HATSVaultV2_abi,
    chainId,
  };

  const registryContractInfo = {
    address: appChains[chainId].vaultsCreatorContract ?? "",
    abi: HATSVaultsRegistry_abi,
    chainId,
  };

  const vaultContract = getContract({
    ...vaultContractInfo,
    signerOrProvider: getProvider({ chainId }),
  });

  const allDescriptionsHashesPromise = vaultContract.queryFilter(vaultContract.filters.SetVaultDescription(null));
  const allContractCallsPromises = readContracts({
    contracts: [
      { ...vaultContractInfo, functionName: "committee" }, // Committee multisig address
      { ...vaultContractInfo, functionName: "committeeCheckedIn" }, // Is committee checked in
      { ...registryContractInfo, functionName: "isVaultVisible", args: [vaultAddress as `0x${string}`] }, // Is registered
      { ...vaultContractInfo, functionName: "totalSupply" }, // Deposited amount
      { ...vaultContractInfo, functionName: "bountySplit" }, // bountySplit
      { ...vaultContractInfo, functionName: "getBountyHackerHATVested" }, // hatsRewardSplit
      { ...vaultContractInfo, functionName: "getBountyGovernanceHAT" }, // hatsGovernanceSplit
      { ...vaultContractInfo, functionName: "maxBounty" }, // maxBounty
      { ...vaultContractInfo, functionName: "asset" }, // asset
      { ...vaultContractInfo, functionName: "decimals" }, // tokenDecimals
    ],
  });

  const promisesData = await Promise.all([allDescriptionsHashesPromise, allContractCallsPromises]);

  const [descriptions, contractCalls] = promisesData;
  const [
    committeeMulsitigAddress,
    isCommitteeCheckedIn,
    isRegistered,
    depositedAmount,
    [bountySplitVested, bountySplitImmediate, bountySplitCommittee],
    hatsRewardSplit,
    hatsGovernanceSplit,
    maxBounty,
    assetToken,
    tokenDecimals,
  ] = contractCalls;

  const descriptionHash = descriptions[descriptions.length - 1].args?._descriptionHash;
  let description: IVaultDescription | undefined = undefined;

  try {
    const dataResponse = await fetch(ipfsTransformUri(descriptionHash));
    if (dataResponse.status === 200) {
      description = await dataResponse.json();
    }
  } catch (error) {
    console.log(error);
  }

  const vaultData: IVaultStatusData = {
    descriptionHash,
    description,
    committeeMulsitigAddress,
    isCommitteeCheckedIn,
    isRegistered,
    depositedAmount,
    assetToken,
    tokenDecimals,
    parameters: {
      bountySplitImmediate,
      bountySplitVested,
      bountySplitCommittee,
      maxBounty,
      committeeControlledSplit: 10000 - hatsRewardSplit - hatsGovernanceSplit,
      hatsGovernanceSplit,
      hatsRewardSplit,
    },
  };

  return vaultData;
}

/**
 * Creates a new edit session for an existing vault
 *
 * @param vaultAddress - The vault address
 * @param chainId - The chain id of the vault
 */
export async function createEditSessionOffChain(vaultAddress: string, chainId: number): Promise<string> {
  const response = await axiosClient.post(`${BASE_SERVICE_URL}/edit-session`, { vaultAddress, chainId });
  return response.headers["x-new-id"];
}

/**
 * Get the current valid edit session, the edit session associated to the vault descriptionHash
 *
 * @param descriptionHash - The vault description hash
 * @param chainId - The chain id of the vault
 */
export async function getCurrentValidEditSession(
  descriptionHash: string,
  vaultAddress: string,
  chainId: number
): Promise<IEditedSessionResponse> {
  const response = await axiosClient.get(
    `${BASE_SERVICE_URL}/edit-session/description-hash/${chainId}/${descriptionHash}/${vaultAddress}`
  );
  return response.data;
}

/**
 * Gets all the edit sessions that were created for editing an existing vault
 *
 * @param vaultAddress - The vault address
 * @param chainId - The chain id of the vault
 */
export async function getEditionEditSessions(vaultAddress: string, chainId: number): Promise<IEditedSessionResponse[]> {
  const response = await axiosClient.get(`${BASE_SERVICE_URL}/edit-session/all/${chainId}/${vaultAddress}`);
  return response.data ?? [];
}
