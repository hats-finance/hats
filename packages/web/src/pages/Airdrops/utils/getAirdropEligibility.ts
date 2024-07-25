import { BigNumber } from "ethers";
import { DropDescriptionData } from "../types";

export type AirdropEligibility = DropDescriptionData["merkletree"]["address"]["token_eligibility"] & {
  eligible: boolean;
  total: string;
};

export const getAirdropEligibility = async (
  address: string,
  airdropDescriptionData: DropDescriptionData
): Promise<AirdropEligibility | undefined> => {
  try {
    const addressInfo = Object.entries(airdropDescriptionData.merkletree).find(
      ([add]) => add.toLowerCase() === address.toLowerCase()
    )?.[1];

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
    console.log("Error on getAirdropEligibility: ", error);
    return undefined;
  }
};
