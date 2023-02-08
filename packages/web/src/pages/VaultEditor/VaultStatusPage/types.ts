import { IVaultDescription } from "@hats-finance/shared";
import { BigNumber } from "ethers";

export interface IVaultStatusData {
  descriptionHash: string;
  description: IVaultDescription | undefined;
  committeeMulsitigAddress: string;
  isCommitteeCheckedIn: boolean;
  isRegistered: boolean;
  depositedAmount: BigNumber;
  parameters: {
    bountySplitImmediate: number;
    bountySplitVested: number;
    bountySplitCommittee: number;
    maxBounty: number;
    committeeControlledSplit: number;
    hatsGovernanceSplit: number;
    hatsRewardSplit: number;
  };
}
