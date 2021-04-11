export interface IVault {
  id: string,
  pid: string,
  name: string,
  stakingToken: string,
  stakers: Array<IStaker>,
  totalStaking: string,
  totalReward: string,
  totalRewardPaid: string,
  approvers: Array<string>,
  allocPoint: string,
  master: IMaster
}

export interface IStaker {
  id: string,
  pid: string,
  createdAt: string,
  address: string,
  vault: IVault,
  amount: string,
  rewardPaid: string
}

export interface IMaster {
  id: string,
  address: string,
  governance: string,
  owner: string,
  totalStaking: string,
  totalReward: string,
  totalRewardPaid: string,
  rewardPerBlock: string,
  startBlock: string,
  vaults: Array<IVault>,
  totalAllocPoints: string,
  createdAt: string,
  rewardsToken: string
}
