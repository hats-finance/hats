import { ChainsConfig, IEditedVaultDescription } from "@hats-finance/shared";
import { isAddressAMultisigMember } from "utils/gnosis.utils";
import { VaultEditorAddressRole } from "./types";
import { IVaultStatusData } from "./VaultStatusPage/types";

// Only committee members or gov multisig members can edit the vault
export async function checkIfAddressCanEditTheVault(
  address: string | undefined,
  editData: IEditedVaultDescription | IVaultStatusData
): Promise<boolean> {
  const addressRole = await getAddressEditorRole(address, editData);
  return addressRole !== "none";
}

export async function getAddressEditorRole(
  address: string | undefined,
  vaultData: IEditedVaultDescription | IVaultStatusData
): Promise<VaultEditorAddressRole> {
  const dataToUse = "description" in vaultData ? vaultData.description : vaultData;

  const vaultChainId = dataToUse?.committee.chainId;
  if (!address || !dataToUse || !vaultChainId) return "none";

  const govMultisig = ChainsConfig[Number(vaultChainId)].govMultisig;
  const committeeMultisig = dataToUse.committee["multisig-address"];

  const isCommitteeMultisigMember = await isAddressAMultisigMember(committeeMultisig, address, vaultChainId);
  const isGovMember = await isAddressAMultisigMember(govMultisig, address, vaultChainId);
  const isVaultMember = dataToUse.committee.members.map((member) => member.address).includes(address) ?? false;

  if (isGovMember) return "gov";
  if (isCommitteeMultisigMember) return "committee";
  if (isVaultMember) return "invited";
  return "none";
}
