import { HATSVaultV2_abi, HATSVaultsRegistry_abi, ChainsConfig } from "@hats-finance/shared";
import { getContract, getProvider, readContracts } from "wagmi/actions";
import axios from "axios";
import { IEditedSessionResponse, IVaultDescription } from "types";
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
  const vaultContractInfo = {
    address: vaultAddress,
    abi: HATSVaultV2_abi,
    chainId,
  };

  const registryContractInfo = {
    address: ChainsConfig[chainId].vaultsCreatorContract ?? "",
    abi: HATSVaultsRegistry_abi,
    chainId,
  };

  const vaultContract = getContract({
    ...vaultContractInfo,
    signerOrProvider: getProvider({ chainId }),
  });

  const allDescriptionsHashesPromise = vaultContract.queryFilter(vaultContract.filters.SetVaultDescription(null));
  const allContractCallsPromises = readContracts({
    contracts: [
      { ...vaultContractInfo, functionName: "committee" }, // Committee multisig address
      { ...vaultContractInfo, functionName: "committeeCheckedIn" }, // Is committee checked in
      { ...registryContractInfo, functionName: "isVaultVisible", args: [vaultAddress as `0x${string}`] }, // Is registered
      { ...vaultContractInfo, functionName: "totalSupply" }, // Deposited amount
      { ...vaultContractInfo, functionName: "bountySplit" }, // bountySplit
      { ...vaultContractInfo, functionName: "getBountyHackerHATVested" }, // hatsRewardSplit
      { ...vaultContractInfo, functionName: "getBountyGovernanceHAT" }, // hatsGovernanceSplit
      { ...vaultContractInfo, functionName: "maxBounty" }, // maxBounty
      { ...vaultContractInfo, functionName: "asset" }, // asset
      { ...vaultContractInfo, functionName: "decimals" }, // tokenDecimals
    ],
  });

  const promisesData = await Promise.all([allDescriptionsHashesPromise, allContractCallsPromises]);

  const [descriptions, contractCalls] = promisesData;
  const [
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
  ] = contractCalls;

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
 * Get the current valid edit session, the edit session associated to the vault descriptionHash
 *
 * @param descriptionHash - The vault description hash
 * @param chainId - The chain id of the vault
 */
export async function getCurrentValidEditSession(
  descriptionHash: string,
  vaultAddress: string,
  chainId: number
): Promise<IEditedSessionResponse> {
  const response = await axios.get(
    `${BASE_SERVICE_URL}/edit-session/description-hash/${chainId}/${descriptionHash}/${vaultAddress}`
  );
  console.log(response.data);
  return response.data;
}

/**
 * Gets all the edit sessions that were created for editing an existing vault
 *
 * @param vaultAddress - The vault address
 * @param chainId - The chain id of the vault
 */
export async function getEditionEditSessions(vaultAddress: string, chainId: number): Promise<IEditedSessionResponse[]> {
  const response = await axios.get(`${BASE_SERVICE_URL}/edit-sessions/${chainId}/${vaultAddress}`);
  return response.data ?? [];
}
