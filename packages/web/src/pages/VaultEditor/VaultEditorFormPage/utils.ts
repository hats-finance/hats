import { ChainsConfig } from "@hats-finance/shared";
import { isAddressAMultisigMember } from "utils/gnosis.utils";
import { IEditedVaultDescription } from "types";

// Only committee members or gov multisig members can edit the vault
export async function checkIfAddressCanEditTheVaultOnForm(
  address: string | undefined,
  editData: IEditedVaultDescription
): Promise<boolean> {
  const vaultChainId = editData.committee.chainId;
  if (!address || !editData || !vaultChainId) return false;
  const govMultisig = ChainsConfig[Number(vaultChainId)].govMultisig;
  const committeeMultisig = editData.committee["multisig-address"];

  const isCommitteeMultisigMember = isAddressAMultisigMember(committeeMultisig, address, vaultChainId);
  const isGovMember = isAddressAMultisigMember(govMultisig, address, vaultChainId);
  const isVaultMember = editData.committee.members.map((member) => member.address).includes(address) ?? false;

  return isGovMember || isVaultMember || isCommitteeMultisigMember;
}
