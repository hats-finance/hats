import { BigNumber } from "ethers";
import { getAddress } from "ethers/lib/utils.js";
import { AirdropDescriptionData } from "../types";

export type AirdropElegibility = AirdropDescriptionData["merkeltree"]["address"]["token_eligibility"] & {
  eligible: boolean;
  total: string;
};

export const getAirdropElegibility = async (
  address: string,
  airdropDescriptionData: AirdropDescriptionData
): Promise<AirdropElegibility | undefined> => {
  try {
    const addressInfo = airdropDescriptionData.merkeltree[getAddress(address)];

    const totalAllocatedToAddress = addressInfo
      ? Object.keys(addressInfo.token_eligibility)
          .reduce((acc, key) => acc.add(BigNumber.from(addressInfo.token_eligibility[key] ?? 0)), BigNumber.from(0))
          .toString()
      : "0";

    return {
      ...addressInfo?.token_eligibility,
      eligible: !!addressInfo,
      total: totalAllocatedToAddress,
    };
  } catch (error) {
    console.log("Error on getAirdropElegibility: ", error);
    return undefined;
  }
};
