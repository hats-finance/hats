export interface IVault {
  id: string
  pid: string
  name: string
  stakingToken: string
  stakers: Array<IStaker>
  totalStaking: string
  totalReward: string
  totalRewardPaid: string
  committee: Array<string>
  allocPoint: string
  master: IMaster
  numberOfApprovedClaims: string
  approvedClaims: Array<IApprovedClaims>
  rewardsLevels: Array<string>
  rewardsSplit: Array<string>
  descriptionHash: string
  description: IVaultDescription
  apy: number
  totalRewardAmount: string
  liquidityPool: boolean
  tokenPrice: number
  honeyPotBalance: string
  registered: boolean
}

export interface IVaultDescription {
  "Project-metadata": {
    icon: string
    website: string
  }
  "communication-channel": {
    "committee-bot": string
    "pgp-pk": string
  }
  "committee": {
    "multisig-address": string
    "members": Array<ICommitteeMember>
  }
  "severities": Array<ISeverity>
}

export interface ICommitteeMember {
  "name": string
  "address": string
  "twitter-link": string
}

export interface ISeverity {
  "name": string
  "index": number
  "contracts-covered": Array<string>
  "nft-metadata": INFTMetaData
  "reward-for": string
}

export interface INFTMetaData {
  name: string
  description: string
  animation_url: string
  image: string
  external_url: string
}

export interface IStaker {
  id: string
  pid: string
  createdAt: string
  address: string
  vault: IVault
  amount: string
  rewardPaid: string
}

export interface IMaster {
  id: string
  address: string
  governance: string
  totalStaking: string
  totalReward: string
  totalRewardPaid: string
  rewardPerBlock: string
  startBlock: string
  vaults: Array<IVault>
  totalAllocPoints: string
  createdAt: string
  rewardsToken: string
  numberOfSubmittedClaims: string
  submittedClaim: Array<ISubmittedClaim>
}

export interface ISubmittedClaim {
  id: string
  claim: string
  claimer: string
  createdAt: string
  master: IMaster
}

export interface IApprovedClaims {
  id: string
  approver: string
  vault: IVault
  beneficiary: string
  sevirity: string
  hackerReward: string
  approverReward: string
  swapAndBurn: string
  hackerHatReward: string
  createdAt: string
}
