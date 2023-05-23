export interface IVaultInfo {
  version: IVault["version"];
  address: string;
  chainId: number;
  master: string;
  pid: string;
}

export interface IBaseVault {
  id: string;
  name: string;
  descriptionHash: string;
  pid: string;
  stakingToken: string;
  stakingTokenDecimals: string;
  stakingTokenSymbol: string;
  stakers: Array<IStaker>;
  honeyPotBalance: string;
  totalRewardPaid: string;
  committee: string;
  allocPoints?: string[];
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
  description?: IVaultDescription;
  chainId?: number;
  userWithdrawRequest?: IWithdrawRequest[];
  activeClaim?: IVaultActiveClaim;
}

export interface IVaultV1 extends IBaseVault {
  version: "v1";
  rewardsLevels: Array<string>;
  allocPoints: string[];
  maxBounty: null;
  description?: IVaultDescriptionV1;
}
export interface IVaultV2 extends IBaseVault {
  version: "v2";
  description?: IVaultDescriptionV2;
  maxBounty: string; // percentage like 1000 (10%) or 8000 (80%)
  rewardControllers: (IRewardController | undefined)[];
}

export type IVault = IVaultV1 | IVaultV2;

export interface IWithdrawRequest {
  beneficiary: string;
  withdrawEnableTime: number;
  expiryTime: number;
  vault: { id: string };
}

export interface IVaultActiveClaim {
  id: string;
  claim: string;
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
  };
  "communication-channel": {
    "pgp-pk": string | string[];
  };
  committee: {
    "multisig-address": string;
    members: Array<ICommitteeMember>;
    chainId?: string;
  };
  scope?: {
    reposInformation: IVaultRepoInformation[];
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

export interface ICommitteeMember {
  name: string;
  address: string;
  "twitter-link": string;
  "image-ipfs-link"?: string;
  linkedMultisigAddress?: string;
  "pgp-keys": Array<{ publicKey: string }>;
}

export interface IVaultRepoInformation {
  url: string;
  commitHash: string;
  isMain: boolean;
}

export interface IBaseVulnerabilitySeverity {
  name: string;
  "contracts-covered": { [key: string]: string }[];
  "nft-metadata": INFTMetaData;
  description: string;
}

export interface IVulnerabilitySeverityV1 extends IBaseVulnerabilitySeverity {
  index: number;
}
export interface IVulnerabilitySeverityV2 extends IBaseVulnerabilitySeverity {
  percentage: number; // percentage like 1000 (10%) or 8000 (80%)
}

export type IVulnerabilitySeverity = IVulnerabilitySeverityV1 | IVulnerabilitySeverityV2;

export interface INFTMetaData {
  name: string;
  description: string;
  animation_url: string;
  image: string;
  external_url: string;
}

export interface INFTTokenMetadata {
  name: string;
  description: string;
  image: string;
  animation_url: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

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
  numberOfSubmittedClaims: string;
  submittedClaim: Array<ISubmittedClaim>;
  withdrawPeriod: string;
  safetyPeriod: string;
  withdrawRequestEnablePeriod: string;
  withdrawRequestPendingPeriod: string;
  vestingHatDuration: string;
  vestingHatPeriods: string;
  chainId?: number;
  defaultHackerHatRewardSplit: string;
  defaultGovernanceHatRewardSplit: string;
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
  nextSafetyStartsAt: number;
  ongoingSafetyEndsAt: number;
  safetyPeriod: number;
  withdrawPeriod: number;
}

export type TokenPriceResponse = { [token: string]: undefined | {} | { usd?: number } };

export type VaultApys = { [token: string]: { apy: number | undefined; tokenSymbol: string } };
