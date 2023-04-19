import { ChainsConfig } from "../config";
import { IAddressRoleInVault, IVault, IVaultInfo } from "../types";
import { isAddressAMultisigMember } from "./gnosis.utils";

export const getAddressRoleOnVault = async (
  address: string | undefined,
  vaultChainId: string | number | undefined,
  vaultCommittee: string | undefined
): Promise<IAddressRoleInVault> => {
  if (!address || !vaultCommittee || !vaultChainId) return "none";

  const govMultisig = ChainsConfig[Number(vaultChainId)].govMultisig;
  const committeeMultisig = vaultCommittee;

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
