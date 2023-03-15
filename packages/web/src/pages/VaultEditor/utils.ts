import { IEditedVaultDescription, isAddressAMultisigMember } from "@hats-finance/shared";
import { appChains } from "settings";
import { VaultEditorAddressRole } from "./types";
import { IVaultStatusData } from "./VaultStatusPage/types";

// Only committee members or gov multisig members can edit the vault
export async function checkIfAddressCanEditTheVault(
  address: string | undefined,
  editData: IEditedVaultDescription | IVaultStatusData
): Promise<{ canEditVault: boolean; role: VaultEditorAddressRole }> {
  const addressRole = await getAddressEditorRole(address, editData);
  return { canEditVault: addressRole !== "none" && addressRole !== "committee-multisig", role: addressRole };
}

export async function getAddressEditorRole(
  address: string | undefined,
  vaultData: IEditedVaultDescription | IVaultStatusData
): Promise<VaultEditorAddressRole> {
  const dataToUse = "description" in vaultData ? vaultData.description : vaultData;

  const vaultChainId = dataToUse?.committee.chainId;
  if (!address || !dataToUse || !vaultChainId) return "none";

  const govMultisig = appChains[Number(vaultChainId)].govMultisig;
  const committeeMultisig = dataToUse.committee["multisig-address"];

  const isCommitteeMultisig = committeeMultisig === address;
  const isCommitteeMultisigMember = await isAddressAMultisigMember(committeeMultisig, address, vaultChainId);
  const isGovMember = await isAddressAMultisigMember(govMultisig, address, vaultChainId);

  if (isGovMember) return "gov";
  if (isCommitteeMultisigMember) return "committee";
  if (isCommitteeMultisig) return "committee-multisig";
  return "none";
}

export function vaultEditorRoleToIntlKey(role: VaultEditorAddressRole): string {
  switch (role) {
    case "gov":
      return "addressRoleGov";
    case "committee":
      return "addressRoleCommittee";
    case "committee-multisig":
      return "addressRoleCommitteeMultisig";
    case "none":
      return "";
  }
}
