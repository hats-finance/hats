import { IEditedVaultDescription } from "types";

export function checkIfAddressIsPartOfComitteOnForm(address: string | undefined, editData: IEditedVaultDescription): boolean {
  if (!address || !editData) return false;

  console.log(editData);

  const isMultisig = address === editData.committee["multisig-address"];
  const isMember = editData.committee.members.map((member) => member.address).includes(address) ?? false;

  return isMultisig || isMember;
}
