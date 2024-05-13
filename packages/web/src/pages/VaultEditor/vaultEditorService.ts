import {
  HATSVaultV2_abi,
  HATSVaultV3ClaimsManager_abi,
  HATSVaultV3_abi,
  HATSVaultsRegistryV2_abi,
  HATSVaultsRegistryV3_abi,
  IEditedSessionResponse,
  IEditedVaultDescription,
  IVault,
  IVaultDescription,
  IVaultStatusData,
  getVaultDescriptionHash,
} from "@hats.finance/shared";
import { axiosClient } from "config/axiosClient";
import { BASE_SERVICE_URL } from "settings";
import { ipfsTransformUri } from "utils";
import { isBlob } from "utils/files.utils";
import { getPath, setPath } from "utils/objects.utils";
import { getContract, getProvider, readContracts } from "wagmi/actions";

/**
 * Gets an edit session data
 * @param editSessionId - The edit session id
 */
export async function getEditSessionData(editSessionId: string): Promise<IEditedSessionResponse> {
  const response = await axiosClient.get(`${BASE_SERVICE_URL}/edit-session/${editSessionId}`);
  const editSession = response.data as IEditedSessionResponse;
  const isExistingVault = editSession.vaultAddress !== undefined;

  // Get maxBountyPercentage from the vault if it's an existing vault
  if (isExistingVault) {
    const vaultContract = getContract({
      address: editSession.editedDescription.version === "v2" ? editSession.vaultAddress ?? "" : editSession.claimsManager ?? "",
      abi: (editSession.editedDescription.version === "v2" ? HATSVaultV2_abi : HATSVaultV3ClaimsManager_abi) as any,
      signerOrProvider: getProvider({ chainId: editSession.chainId }),
    });

    try {
      const maxBountyPercentage = await vaultContract.maxBounty();
      (editSession as IEditedSessionResponse).editedDescription.parameters.maxBountyPercentage = maxBountyPercentage / 100;
    } catch (error) {
      console.log(error);
    }
  }

  return editSession;
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

  const response = await axiosClient.post(`${BASE_SERVICE_URL}/edit-session/${editSessionId}/set-awaiting-creation`);

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
export async function getVaultInformation(vault: IVault | undefined): Promise<IVaultStatusData | undefined> {
  if (!vault) return undefined;
  if (vault.version === "v1") return undefined;
  if (vault.version === "v3" && !vault?.claimsManager) return undefined;

  const vaultContractInfo = {
    address: vault.id as `0x${string}`,
    abi: vault.version === "v2" ? HATSVaultV2_abi : HATSVaultV3_abi,
    chainId: vault.chainId,
  };

  const registryContractInfo = {
    address: vault.master.address as `0x${string}`,
    abi: vault.version === "v2" ? HATSVaultsRegistryV2_abi : HATSVaultsRegistryV3_abi,
    chainId: vault.chainId,
  };

  const claimsManagerContractInfo = {
    address: vault.claimsManager as `0x${string}`,
    abi: HATSVaultV3ClaimsManager_abi,
    chainId: vault.chainId,
  };

  const descriptionHashPromise = getVaultDescriptionHash(vault.id, vault.chainId);
  const allContractCallsPromises = readContracts({
    contracts:
      vault.version === "v2"
        ? ([
            { ...vaultContractInfo, functionName: "committee" }, // Committee multisig address
            { ...vaultContractInfo, functionName: "committeeCheckedIn" }, // Is committee checked in
            { ...registryContractInfo, functionName: "isVaultVisible", args: [vault.id as `0x${string}`] }, // Is registered
            { ...vaultContractInfo, functionName: "totalAssets" }, // Deposited amount
            { ...vaultContractInfo, functionName: "bountySplit" }, // bountySplit
            { ...vaultContractInfo, functionName: "getBountyHackerHATVested" }, // hatsRewardSplit
            { ...vaultContractInfo, functionName: "getBountyGovernanceHAT" }, // hatsGovernanceSplit
            { ...vaultContractInfo, functionName: "maxBounty" }, // maxBounty
            { ...vaultContractInfo, functionName: "asset" }, // asset
            { ...vaultContractInfo, functionName: "decimals" }, // tokenDecimals
          ] as any)
        : ([
            { ...claimsManagerContractInfo, functionName: "committee" }, // Committee multisig address
            { ...claimsManagerContractInfo, functionName: "committeeCheckedIn" }, // Is committee checked in
            { ...registryContractInfo, functionName: "isVaultVisible", args: [vault.id as `0x${string}`] }, // Is registered
            { ...vaultContractInfo, functionName: "totalAssets" }, // Deposited amount
            { ...claimsManagerContractInfo, functionName: "bountySplit" }, // bountySplit
            { ...claimsManagerContractInfo, functionName: "getBountyHackerHATVested" }, // hatsRewardSplit
            { ...claimsManagerContractInfo, functionName: "getBountyGovernanceHAT" }, // hatsGovernanceSplit
            { ...claimsManagerContractInfo, functionName: "maxBounty" }, // maxBounty
            { ...vaultContractInfo, functionName: "asset" }, // asset
            { ...vaultContractInfo, functionName: "decimals" }, // tokenDecimals
            { ...claimsManagerContractInfo, functionName: "getArbitrator" }, // arbitrator
            { ...claimsManagerContractInfo, functionName: "arbitratorCanChangeBounty" }, // arbitratorCanChangeBounty
            { ...claimsManagerContractInfo, functionName: "arbitratorCanChangeBeneficiary" }, // arbitratorCanChangeBeneficiary
            { ...claimsManagerContractInfo, functionName: "arbitratorCanSubmitClaims" }, // arbitratorCanSubmitClaims
            { ...claimsManagerContractInfo, functionName: "isTokenLockRevocable" }, // isTokenLockRevocable
          ] as any),
  }) as Promise<any[]>;

  const promisesData = await Promise.all([descriptionHashPromise, allContractCallsPromises]);

  const [descriptionHash, contractCalls] = promisesData;
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
    arbitrator,
    arbitratorCanChangeBounty,
    arbitratorCanChangeBeneficiary,
    arbitratorCanSubmitClaims,
    isTokenLockRevocable,
  ] = contractCalls;

  if (!descriptionHash) throw new Error("Description hash not found");

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
    arbitrator,
    arbitratorCanChangeBounty,
    arbitratorCanChangeBeneficiary,
    arbitratorCanSubmitClaims,
    isTokenLockRevocable,
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
  const response = await axiosClient.get(`${BASE_SERVICE_URL}/edit-session/all/edition/${chainId}/${vaultAddress}`);
  return response.data ?? [];
}

/**
 * Gets all the edit sessions that were created for a vault (creation and editing)
 *
 * @param vaultAddress - The vault address
 * @param chainId - The chain id of the vault
 */
export async function getAllEditSessions(vaultAddress: string, chainId: number): Promise<IEditedSessionResponse[]> {
  const response = await axiosClient.get(`${BASE_SERVICE_URL}/edit-session/all/${chainId}/${vaultAddress}`);
  return response.data ?? [];
}

/**
 * Sets the edit session as clicked to create the new vault on-chain
 *
 * @param editSessionId - The edit session id
 */
export async function setLastCreationOnChainRequest(editSessionId: string): Promise<boolean[]> {
  const response = await axiosClient.post(`${BASE_SERVICE_URL}/edit-session/${editSessionId}/set-last-creation-onchain-request`);
  return response.data ?? [];
}

/**
 * Generates NFTs assets
 *
 * @param editSessionId - The edit session id
 */
export async function generateNftsAssets(editSessionId: string): Promise<boolean> {
  const response = await axiosClient.get(`${BASE_SERVICE_URL}/edit-session/${editSessionId}/generate-nft-assets`);
  return response.status === 200 ? true : false;
}

/**
 * Publish the audit editSession as draft
 *
 * @param editSessionId - The edit session id
 */
export async function publishAuditDraft(editSessionId: string): Promise<IEditedSessionResponse | null> {
  try {
    const res = await axiosClient.post(`${BASE_SERVICE_URL}/edit-session/${editSessionId}/publish-audit-draft`);
    return res.status === 200 ? res.data : null;
  } catch (error) {
    return null;
  }
}

/**
 * Verify if an editSession has a published audit draft
 *
 * @param editSessionId - The edit session id
 */
export async function hasEditSessionAuditDraftPublished(editSessionId: string): Promise<boolean> {
  try {
    const response = await axiosClient.get(`${BASE_SERVICE_URL}/edit-session/${editSessionId}/audit-draft`);
    const existsDraft = !!response.data;
    return existsDraft;
  } catch (error) {
    return false;
  }
}

/**
 * Delete the audit editSession draft
 *
 * @param editSessionId - The edit session id
 */
export async function deleteAuditDraft(editSessionId: string): Promise<boolean> {
  try {
    await axiosClient.delete(`${BASE_SERVICE_URL}/edit-session/${editSessionId}/audit-draft`);
    return true;
  } catch (error) {
    return false;
  }
}
