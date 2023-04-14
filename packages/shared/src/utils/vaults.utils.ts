import { ChainsConfig } from "../config";
import { IAddressRoleInVault, IEditedVaultDescription, IVaultDescription, IVaultStatusData, IVault, IVaultInfo } from "../types";
import { isAddressAMultisigMember } from "./gnosis.utils";

export const getAddressRoleOnVault = async (
  address: string | undefined,
  vaultData: IEditedVaultDescription | IVaultStatusData | IVaultDescription
): Promise<IAddressRoleInVault> => {
  const dataToUse = "description" in vaultData ? vaultData.description : vaultData;

  const vaultChainId = dataToUse?.committee.chainId;
  if (!address || !dataToUse || !vaultChainId) return "none";

  const govMultisig = ChainsConfig[Number(vaultChainId)].govMultisig;
  const committeeMultisig = dataToUse.committee["multisig-address"];

  const isCommitteeMultisig = committeeMultisig === address;
  const isCommitteeMultisigMember = await isAddressAMultisigMember(committeeMultisig, address, vaultChainId);
  const isGovMember = await isAddressAMultisigMember(govMultisig, address, vaultChainId);

  if (isCommitteeMultisigMember) return "committee";
  if (isCommitteeMultisig) return "committee-multisig";
  if (isGovMember) return "gov";
  return "none";
};

export const getVaultInfoFromVault = (vault: IVault): IVaultInfo => {
  return {
    version: vault.version,
    address: vault.id,
    chainId: vault.chainId as number,
    master: vault.master.address,
    pid: vault.pid,
  };
};
