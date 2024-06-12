import { AirdropFactoryConfig, HATAirdrop_abi } from "@hats.finance/shared";
import { getContract, getProvider } from "wagmi/actions";
import { DropData } from "../types";
import { getAirdropDescriptionJSON } from "./getAirdropDescriptionJSON";

export const getGeneralAirdropData = async (
  address: string,
  factoryInfo: AirdropFactoryConfig
): Promise<DropData | undefined> => {
  try {
    const airdropDescription = await getAirdropDescriptionJSON({ address, chainId: factoryInfo.chain.id });

    const provider = getProvider({ chainId: factoryInfo.chain.id });
    const airdropContract = getContract({
      abi: HATAirdrop_abi,
      address: address,
      signerOrProvider: provider,
    });

    const [lockEndTime, deadline, token, startTime] = await Promise.all([
      airdropContract.lockEndTime(),
      airdropContract.deadline(),
      airdropContract.token(),
      airdropContract.startTime(),
    ]);

    const lockEndTimeSeconds = lockEndTime.toString();
    const lockEndDate = new Date(+lockEndTimeSeconds * 1000);
    const deadlineDate = new Date(+deadline.toString() * 1000);
    const startTimeDate = new Date(+startTime.toString() * 1000);
    const isLocked = lockEndDate.getTime() > Date.now();
    const isLive = deadlineDate.getTime() > Date.now();

    return {
      factory: factoryInfo.address,
      chainId: factoryInfo.chain.id,
      address,
      isLocked,
      lockEndDate,
      deadlineDate,
      startTimeDate,
      isLive,
      token,
      descriptionData: airdropDescription,
    };
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
