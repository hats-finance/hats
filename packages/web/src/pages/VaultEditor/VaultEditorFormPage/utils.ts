import { IEditedVaultDescription } from "types";

export function checkIfAddressIsPartOfComitteOnForm(address: string | undefined, editData: IEditedVaultDescription): boolean {
  if (!address) return false;

  const isMultisig = address === editData.committee["multisig-address"];
  const isMember = editData.committee.members.map((member) => member.address).includes(address) ?? false;

  return isMultisig || isMember;
}
