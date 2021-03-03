export interface IVault {
  id: string,
  address: string,
  name: string,
  stakingToken: string,
  rewardsToken: string,
  governance: string,
  owner: string,
  stakers: Array<IStaker>,
  totalStaking: string,
  totalReward: string,
  rewardRate: string,
  rewardsDuration: string,
  periodFinish: string
}

export interface IStaker {
  id: string,
  createdAt: string,
  address: string,
  vault: IVault,
  amount: string
}
