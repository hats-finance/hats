import { IVaultStatusData } from "./types";

export function checkIfAddressIsPartOfComitteOnStatus(address: string | undefined, vaultData: IVaultStatusData): boolean {
  if (!address) return false;

  const isMultisig = address === vaultData.committeeMulsitigAddress;
  const isMember = vaultData.description?.committee.members.map((member) => member.address).includes(address) ?? false;

  return isMultisig || isMember;
}
