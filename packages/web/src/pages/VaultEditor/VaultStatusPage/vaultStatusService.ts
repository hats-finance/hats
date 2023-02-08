import { getContract, getProvider } from "wagmi/actions";
import { HATSVaultV2_abi } from "data/abis/HATSVaultV2_abi";
import { HATSVaultsRegistry_abi } from "data/abis/HATSVaultsRegistry_abi";
import { ChainsConfig } from "config/chains";
import { IVaultStatusData } from "./types";
import { ipfsTransformUri } from "utils";
import { IVaultDescription } from "@hats-finance/shared";

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
