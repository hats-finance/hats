import { ISubmissionMessageObject } from "./submissions";

export interface IVaultInfo {
  version: IVault["version"];
  address: string;
  chainId: number;
  master: string;
  stakingToken: string;
  pid: string;
}

export type IVaultType = "normal" | "audit" | "grants" | "gamification";

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
  chainId: number;
  dateStatus: "on_time" | "upcoming" | "finished";
  userWithdrawRequest?: IWithdrawRequest[];
  activeClaim?: IVaultActiveClaim;
  // Computed values
  amountsInfo?: {
    showCompetitionIntendedAmount: boolean;
    tokenPriceUsd: number;
    maxRewardFactor: number;
    depositedAmount: {
      tokens: number;
      usd: number;
    };
    maxRewardAmount: {
      tokens: number;
      usd: number;
    };
    competitionIntendedAmount?: {
      deposited: {
        tokens: number;
        usd: number;
      };
      maxReward: {
        tokens: number;
        usd: number;
      };
    };
  };
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
    type?: IVaultType;
    isPrivateAudit?: boolean;
    isContinuousAudit?: boolean;
    whitelist: { address: string }[];
    endtime?: number;
    starttime?: number;
    oneLiner?: string;
    intendedCompetitionAmount?: number;
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
    description: string;
    codeLangs: string[];
    reposInformation: IVaultRepoInformation[];
    docsLink: string;
    outOfScope: string;
    protocolSetupInstructions?: IProtocolSetupInstructions;
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
  usingPointingSystem?: boolean;
}

export type IVaultDescription = IVaultDescriptionV1 | IVaultDescriptionV2;

export interface IProtocolSetupInstructions {
  tooling: "foundry" | "hardhat" | "other";
  instructions: string;
}

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
  prevAuditedCommitHash?: string;
  commitHash?: string;
  isMain: boolean;
}

export interface IBaseVulnerabilitySeverity {
  name: string;
  decryptSubmissions?: boolean;
  "contracts-covered": { [key: string]: string }[];
  contractsCoveredNew?: {
    link: string;
    linesOfCode: number;
    deploymentInfo: {
      contractAddress: string;
      chainId: string;
    }[];
  }[];
  "nft-metadata": INFTMetaData;
  description: string;
}

export interface IVulnerabilitySeverityV1 extends IBaseVulnerabilitySeverity {
  index: number;
}
export interface IVulnerabilitySeverityV2 extends IBaseVulnerabilitySeverity {
  percentage: number; // percentage of the whole vault allocated to this severity
  capAmount?: number;
  percentageCapPerPoint?: number; // Max percentage of the whole vault allocated to each point of this severity
  points?: { type: "fixed" | "range"; value: { first: number; second?: number } }; // Only when pointing system is used
}

export type IVulnerabilitySeverity = IVulnerabilitySeverityV1 | IVulnerabilitySeverityV2;

export interface INFTMetaData {
  name: string;
  description: string;
  animation_url: string;
  image: string;
  external_url: string;
  jsonMetadataIpfsHash?: string;
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
  timelock: string;
  totalRewardPaid: string;
  rewardPerBlock: string;
  startBlock: string;
  vaults: Array<IVault>;
  totalAllocPoints: string;
  createdAt: string;
  numberOfSubmittedClaims: string;
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

export interface ISubmittedSubmission {
  chainId?: number;
  id: string;
  txid: string;
  subId: string;
  submissionIdx: number;
  submissionHash: string;
  submissionData?: ISubmissionMessageObject;
  submissionDecrypted?: string;
  linkedVault?: IVault;
  submissionDataStructure?: {
    title: string;
    severity?: string;
    content: string;
    beneficiary: string;
    communicationChannel?: { type: string; value: string };
    githubUsername?: string;
    twitterUsername?: string;
  };
  submitter: string;
  createdAt: string;
  master: { id: string };
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
