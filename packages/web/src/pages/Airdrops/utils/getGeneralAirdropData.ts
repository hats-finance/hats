import { HATAirdrop_abi } from "@hats.finance/shared";
import { getContract, getProvider } from "wagmi/actions";
import { AirdropData } from "../types";
import { getAirdropDescriptionJSON } from "./getAirdropDescriptionJSON";

export const getGeneralAirdropData = async (address: string, chainId: number): Promise<AirdropData | undefined> => {
  try {
    const airdropDescription = await getAirdropDescriptionJSON({ address, chainId });

    const provider = getProvider({ chainId });
    const airdropContract = getContract({
      abi: HATAirdrop_abi,
      address: address,
      signerOrProvider: provider,
    });

    const [lockEndTime, deadline, token] = await Promise.all([
      airdropContract.lockEndTime(),
      airdropContract.deadline(),
      airdropContract.token(),
    ]);

    const lockEndTimeSeconds = lockEndTime.toString();
    const lockEndDate = new Date(+lockEndTimeSeconds * 1000);
    const deadlineDate = new Date(+deadline.toString() * 1000);
    const isLocked = lockEndDate.getTime() > Date.now();
    const isLive = deadlineDate.getTime() > Date.now();

    return {
      address,
      chainId,
      isLocked,
      lockEndDate,
      deadlineDate,
      isLive,
      token,
      descriptionData: airdropDescription,
    };
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
