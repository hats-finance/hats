import { HATAirdrop_abi } from "@hats.finance/shared";
import { BigNumber } from "ethers";
import { getAddress } from "ethers/lib/utils.js";
import { getContract, getProvider } from "wagmi/actions";
import { AirdropMerkeltree } from "../types";
import { getAirdropMerkleTreeJSON } from "./getAirdropMerkelTreeJSON";

export type AirdropElegibility = AirdropMerkeltree["address"]["token_eligibility"] & {
  eligible: boolean;
  total: string;
  info: {
    isLocked: boolean;
    lockEndDate: Date;
    isLive: boolean;
    deadlineDate: Date;
    tokenAddress: `0x${string}`;
  };
};

export const getAirdropElegibility = async (
  address: string,
  airdropData: { address: string; chainId: number }
): Promise<AirdropElegibility | undefined> => {
  try {
    const merkelTreeJson = await getAirdropMerkleTreeJSON(airdropData);
    const addressInfo = merkelTreeJson[getAddress(address)];

    const totalAllocatedToAddress = addressInfo
      ? Object.keys(addressInfo.token_eligibility)
          .reduce((acc, key) => acc.add(BigNumber.from(addressInfo.token_eligibility[key] ?? 0)), BigNumber.from(0))
          .toString()
      : "0";

    const airdropContractAddress = airdropData.address;
    const chainId = airdropData.chainId;
    const provider = getProvider({ chainId });
    if (!airdropContractAddress) {
      alert(`Airdrop contract not found on chain ${chainId}`);
      throw new Error("Airdrop contract not found");
    }

    const airdropContract = getContract({
      abi: HATAirdrop_abi,
      address: airdropData.address,
      signerOrProvider: provider,
    });

    const [lockEndTime, tokenAddress, deadline] = await Promise.all([
      airdropContract.lockEndTime(),
      airdropContract.token(),
      airdropContract.deadline(),
    ]);

    const lockEndTimeSeconds = lockEndTime.toString();
    const lockEndDate = new Date(+lockEndTimeSeconds * 1000);
    const deadlineDate = new Date(+deadline.toString() * 1000);
    const isLocked = lockEndDate.getTime() > Date.now();
    const isLive = deadlineDate.getTime() > Date.now();

    return {
      ...addressInfo?.token_eligibility,
      eligible: !!addressInfo,
      total: totalAllocatedToAddress,
      info: {
        isLocked,
        lockEndDate,
        tokenAddress,
        deadlineDate,
        isLive,
      },
    };
  } catch (error) {
    console.log("Error on getAirdropElegibility: ", error);
    return undefined;
  }
};
