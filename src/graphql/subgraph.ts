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

export const GET_STAKERS = gql`
  {
    stakers {
      id
      createdAt
      address
      amount
      rewardPaid
      vault {
        id
      }
    }
  }
`;

export const getStakerByAddress = (stakerAddress: string) => {
  return gql`
    {
      stakers (where: { address: "${stakerAddress}" }) {
        id
        createdAt
        amount
        rewardPaid
        vault {
          id
        }
      }
    }
  `;
}

export const getStakerByVaultID = (vaultID: string, stakerAddress: string) => {
  return gql`
    {
      stakers (where: { vault: "${vaultID}", address: "${stakerAddress}" }) {
        amount
      }
    }
  `;
}
