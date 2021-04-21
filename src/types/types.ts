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
  apy: number
  totalRewardAmount: string
  liquidityPool: boolean
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
