import { ChainsConfig } from "@hats-finance/shared";
import { isAddressAMultisigMember } from "utils/gnosis.utils";
import { IVaultStatusData } from "./types";

// Only committee members or gov multisig members can edit the vault
export async function checkIfAddressCanEditTheVaultOnStatusPage(
  address: string | undefined,
  vaultData: IVaultStatusData
): Promise<boolean> {
  const vaultChainId = vaultData.description?.committee.chainId;
  if (!address || !vaultData || !vaultChainId) return false;
  const govMultisig = ChainsConfig[Number(vaultChainId)].govMultisig;
  const committeeMultisig = vaultData.description?.committee["multisig-address"];

  const isCommitteeMultisigMember = isAddressAMultisigMember(committeeMultisig, address, vaultChainId);
  const isGovMember = isAddressAMultisigMember(govMultisig, address, vaultChainId);
  const isVaultMember = vaultData.description?.committee.members.map((member) => member.address).includes(address) ?? false;

  return isGovMember || isVaultMember || isCommitteeMultisigMember;
}
