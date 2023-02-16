import { IEditedSessionResponse } from "types";
import axios from "axios";
import { getContract, getProvider } from "wagmi/actions";
import { IVaultDescription, HATSVaultV2_abi, HATSVaultsRegistry_abi } from "@hats-finance/shared";
import { ChainsConfig } from "config/chains";
import { BASE_SERVICE_URL } from "settings";
import { IVaultStatusData } from "./types";
import { ipfsTransformUri } from "utils";

/**
 * Gets all the information of a vault for showing it on the status page, includes off-chain and on-chain data
 *
 * @param vaultAddress - The vault address
 * @param chainId - The chain id of the vault
 */
export async function getVaultInformation(vaultAddress: string, chainId: number): Promise<IVaultStatusData> {
  const vaultContract = getContract({
    address: vaultAddress,
    abi: HATSVaultV2_abi,
    signerOrProvider: getProvider({ chainId }),
  });

  const registryContract = getContract({
    address: ChainsConfig[chainId].vaultsCreatorContract ?? "",
    abi: HATSVaultsRegistry_abi,
    signerOrProvider: getProvider({ chainId }),
  });

  const promisesData = await Promise.all([
    vaultContract.queryFilter(vaultContract.filters.SetVaultDescription(null)), // All the descriptionHashes
    vaultContract.committee(), // Committee multisig address
    vaultContract.committeeCheckedIn(), // Is committee checked in
    registryContract.isVaultVisible(vaultAddress as `0x${string}`), // Is registered
    vaultContract.totalSupply(), // Deposited amount
    vaultContract.bountySplit(), // bountySplit
    vaultContract.getBountyHackerHATVested(), // hatsRewardSplit
    vaultContract.getBountyGovernanceHAT(), // hatsGovernanceSplit
    vaultContract.maxBounty(), // maxBounty
    vaultContract.asset(), // asset
    vaultContract.decimals(), // asset
  ]);

  const [
    descriptions,
    committeeMulsitigAddress,
    isCommitteeCheckedIn,
    isRegistered,
    depositedAmount,
    [bountySplitVested, bountySplitImmediate, bountySplitCommittee],
    hatsRewardSplit,
    hatsGovernanceSplit,
    maxBounty,
    assetToken,
    tokenDecimals,
  ] = promisesData;

  const descriptionHash = descriptions[descriptions.length - 1].args?._descriptionHash;
  let description: IVaultDescription | undefined = undefined;

  try {
    const dataResponse = await fetch(ipfsTransformUri(descriptionHash));
    if (dataResponse.status === 200) {
      description = await dataResponse.json();
    }
  } catch (error) {
    console.log(error);
  }

  const vaultData: IVaultStatusData = {
    descriptionHash,
    description,
    committeeMulsitigAddress,
    isCommitteeCheckedIn,
    isRegistered,
    depositedAmount,
    assetToken,
    tokenDecimals,
    parameters: {
      bountySplitImmediate,
      bountySplitVested,
      bountySplitCommittee,
      maxBounty,
      committeeControlledSplit: 10000 - hatsRewardSplit - hatsGovernanceSplit,
      hatsGovernanceSplit,
      hatsRewardSplit,
    },
  };

  return vaultData;
}

/**
 * Creates a new edit session for an existing vault
 *
 * @param vaultAddress - The vault address
 * @param chainId - The chain id of the vault
 */
export async function createEditSessionOffChain(vaultAddress: string, chainId: number): Promise<string> {
  const response = await axios.post(`${BASE_SERVICE_URL}/edit-session`, { vaultAddress, chainId });
  return response.headers["x-new-id"];
}

/**
 * Gets all the edit sessions that were created for editing an existing vault
 *
 * @param vaultAddress - The vault address
 * @param chainId - The chain id of the vault
 */
export async function getEditionEditSessions(vaultAddress: string, chainId: number): Promise<IEditedSessionResponse[]> {
  const response = await axios.get(`${BASE_SERVICE_URL}/edit-sessions/${chainId}/${vaultAddress}`);
  return response.data;
}
