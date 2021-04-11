import { gql } from "apollo-boost";

export const GET_VAULTS = gql`
  {
    vaults {
      id
      pid
      name
      stakingToken
      totalStaking
      totalReward
      totalRewardPaid
      approvers
      allocPoint
      master {
        address
      }
    }
  }
`;

export const GET_STAKERS = gql`
  {
    stakers {
      id
      pid
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

// This is the HAT token
export const GET_REWARDS_TOKEN = gql`
  {
    masters {
      rewardsToken
    }
  }
`

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

export const getStakerAmountByVaultID = (vaultID: string, stakerAddress: string) => {
  return gql`
    {
      stakers (where: { vault: "${vaultID}", address: "${stakerAddress}" }) {
        amount
      }
    }
  `;
}

export const getStakerAmounts = (stakerAddress: string) => {
  return gql`
    {
      stakers (where: { address: "${stakerAddress}" }) {
        amount
      }
    }
  `;
}
