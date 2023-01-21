import { INFTTokenMetadata } from "hooks/nft/types";
import { ICommitteeMember, IVulnerabilitySeverity, IVulnerabilitySeverityV1, IVulnerabilitySeverityV2 } from "@shared/types";
export interface IBaseVault {
  id: string;
  descriptionHash: string;
  pid: string;
  stakingToken: string;
  stakingTokenDecimals: string;
  stakingTokenSymbol: string;
  stakers: Array<IStaker>;
  honeyPotBalance: string;
  totalRewardPaid: string;
  committee: string;
  allocPoint?: string;
  master: IMaster;
  version: "v1" | "v2";
  arbitrator?: string;
  numberOfApprovedClaims: string;
  approvedClaims: Array<IApprovedClaims>;
  rewardsLevels?: Array<string>;
  liquidityPool: boolean;
  registered: boolean;
  withdrawRequests: Array<IPoolWithdrawRequest>;
  totalUsersShares: string;
  hackerVestedRewardSplit: string;
  hackerRewardSplit: string;
  committeeRewardSplit: string;
  swapAndBurnSplit: string;
  governanceHatRewardSplit: string;
  hackerHatRewardSplit: string;
  vestingDuration: string;
  vestingPeriods: string;
  depositPause: boolean;
  committeeCheckedIn: boolean;
  multipleVaults?: IVault[];
  description: IVaultDescription;
  chainId?: number;
  userWithdrawRequest?: IWithdrawRequest[];
}

export interface IVaultV1 extends IBaseVault {
  version: "v1";
  rewardsLevels: Array<string>;
  allocPoint: string;
  description: IVaultDescriptionV1;
}
export interface IVaultV2 extends IBaseVault {
  version: "v2";
  description: IVaultDescriptionV2;
  maxBounty: string; // percentage like 1000 (10%) or 8000 (80%)
  rewardControllers: IRewardController[];
}

export type IVault = IVaultV1 | IVaultV2;

export interface IWithdrawRequest {
  beneficiary: string;
  withdrawEnableTime: number;
  expiryTime: number;
  vault: { id: string };
}

export interface IUserNft {
  id: string;
  balance: string;
  nft: {
    id: string;
    tokenURI: string;
    tokenId: string;
  };
  chainId?: number;
  metadata?: INFTTokenMetadata;
}

interface IBaseVaultDescription {
  version: "v1" | "v2" | undefined;
  "project-metadata": {
    icon: string;
    website: string;
    name: string;
    tokenIcon: string;
    type?: string;
    endtime?: number;
    starttime?: number;
    emails: { address: string; status: "verified" | "unverified" | "verifying" }[];
  };
  "communication-channel": {
    "pgp-pk": string | string[];
  };
  committee: {
    "multisig-address": string;
    members: Array<ICommitteeMember>;
  };
  source: {
    name: string;
    url: string;
  };
  "additional-vaults"?: string[];
  severities: Array<IVulnerabilitySeverity>;
}

export interface IVaultDescriptionV1 extends IBaseVaultDescription {
  version: "v1" | undefined;
  severities: Array<IVulnerabilitySeverityV1>;
  indexArray?: number[];
}

export interface IVaultDescriptionV2 extends IBaseVaultDescription {
  version: "v2";
  severities: Array<IVulnerabilitySeverityV2>;
}

export type IVaultDescription = IVaultDescriptionV1 | IVaultDescriptionV2;

export interface IStaker {
  id: string;
  pid: string;
  createdAt: string;
  address: string;
  vault: IVault;
  rewardPaid: string;
  shares: string;
  depositAmount: string;
  master: IMaster;
}

export interface IRewardController {
  id: string;
  rewardToken: string;
  rewardTokenSymbol: string;
  rewardTokenDecimals: string;
  totalRewardPaid: string;
}

export interface IMaster {
  id: string;
  address: string;
  governance: string;
  totalRewardPaid: string;
  rewardPerBlock: string;
  startBlock: string;
  vaults: Array<IVault>;
  totalAllocPoints: string;
  createdAt: string;
  rewardsToken: string;
  numberOfSubmittedClaims: string;
  submittedClaim: Array<ISubmittedClaim>;
  withdrawPeriod: string;
  safetyPeriod: string;
  withdrawRequestEnablePeriod: string;
  withdrawRequestPendingPeriod: string;
  vestingHatDuration: string;
  vestingHatPeriods: string;
  chainId?: number;
}

export interface ISubmittedClaim {
  id: string;
  claim: string;
  claimer: string;
  createdAt: string;
  master: IMaster;
}

export interface IApprovedClaims {
  id: string;
  approver: string;
  vault: IVault;
  beneficiary: string;
  sevirity: string;
  hackerReward: string;
  approverReward: string;
  swapAndBurn: string;
  hackerHatReward: string;
  createdAt: string;
}

export interface IPoolWithdrawRequest {
  id: string;
  beneficiary: string;
  vault: IVault;
  withdrawEnableTime: string;
  createdAt: string;
  expiryTime: string;
}

export interface IWithdrawSafetyPeriod {
  isSafetyPeriod: boolean;
  safetyStartsAt: number;
  safetyEndsAt: number;
}

export type CoinGeckoPriceResponse = { [token: string]: undefined | {} | { usd?: number } };

export type VaultApys = { [token: string]: { apy: number | undefined; tokenSymbol: string } };
