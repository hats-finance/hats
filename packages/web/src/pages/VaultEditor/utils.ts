import { IAddressRoleInVault, getAddressRoleOnVault } from "@hats-finance/shared";

// Only committee members or gov multisig members can edit the vault
export async function checkIfAddressCanEditTheVault(
  address: string | undefined,
  vaultChainId: string | number | undefined,
  vaultCommittee: string | undefined
): Promise<{ canEditVault: boolean; role: IAddressRoleInVault }> {
  const addressRole = await getAddressRoleOnVault(address, vaultChainId, vaultCommittee);
  return { canEditVault: addressRole !== "none" && addressRole !== "committee-multisig", role: addressRole };
}

export function vaultEditorRoleToIntlKey(role: IAddressRoleInVault): string {
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
