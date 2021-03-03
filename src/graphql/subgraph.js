import { gql } from "apollo-boost";

export const GET_VAULTS = gql`
  {
    vaults {
      id
      address
      name
      stakingToken
      rewardsToken
      governance
      owner
      totalStaking
      totalReward
      rewardRate
      rewardsDuration
      periodFinish
    }
  }
`;
