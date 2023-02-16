import axios from "axios";
import { getContract, getProvider } from "wagmi/actions";
import { HATSVaultV2_abi } from "@hats-finance/shared";
import { getPath, setPath } from "utils/objects.utils";
import { isBlob } from "utils/files.utils";
import { BASE_SERVICE_URL } from "settings";
import { IEditedSessionResponse, IEditedVaultDescription, IVaultEditionStatus } from "types";

/**
 * Gets an edit session data
 * @param editSessionId - The edit session id
 */
export async function getEditSessionData(editSessionId: string): Promise<IEditedSessionResponse> {
  const response = await axios.get(`${BASE_SERVICE_URL}/edit-session/${editSessionId}`);
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
 * @param vaultEditionStatus - The vault edition status, if you are editing an exising vault and want to change the edition status
 */
export async function upsertEditSession(
  editSession: IEditedVaultDescription | undefined,
  editSessionId: string | undefined,
  ipfsDescriptionHash?: string | undefined,
  vaultEditionStatus?: IVaultEditionStatus
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
  if (vaultEditionStatus) formData.append("vaultEditionStatus", vaultEditionStatus);

  const response = await axios.post(`${BASE_SERVICE_URL}/edit-session/${editSessionId ?? ""}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.headers["x-new-id"] ?? (response.data as IEditedSessionResponse);
}

/**
 * Resends the verification email to and specific email
 *
 * @param editSessionId - The edit session id
 * @param email - The email to send the verification email
 */
export async function resendVerificationEmail(editSessionId: string, email: string): Promise<boolean> {
  try {
    const res = await axios.get(`${BASE_SERVICE_URL}/edit-session/${editSessionId}/resend-verification-email?address=${email}`);
    return res.status === 200 ? true : false;
  } catch (error) {
    return false;
  }
}

export async function onVaultCreated(txHash: string, chainId: number): Promise<{ vaultAddress: string } | null> {
  console.error("This method is deprecated, please change the implementation");
  return null;
}

/**
 * Put back to 'editing' a vault that was in 'pendingApproval' status
 *
 * @param editSessionId - The edit session id
 */
export async function cancelEditionApprovalRequest(editSessionId: string): Promise<IEditedSessionResponse | null> {
  try {
    const res = await axios.get(`${BASE_SERVICE_URL}/edit-session/${editSessionId}/cancel-approval-request`);
    console.log(res);
    return res.status === 200 ? res.data : null;
  } catch (error) {
    return null;
  }
}
