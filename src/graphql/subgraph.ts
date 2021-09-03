import { gql } from "apollo-boost";

export const GET_VAULTS = gql`
  {
    vaults {
      id
      name
      descriptionHash
      description
      bounty
      isGuest
      parentDescription
      parentVault {
        id
        pid
        stakingToken
        stakingTokenDecimals
        totalStaking
        honeyPotBalance
        totalReward
        totalRewardPaid
        committee
        allocPoint
        master {
          address
          numberOfSubmittedClaims
          withdrawPeriod
          safetyPeriod
          withdrawRequestEnablePeriod
          withdrawRequestPendingPeriod
        }
        numberOfApprovedClaims
        approvedClaims
        rewardsLevels
        totalRewardAmount
        liquidityPool
        registered
        withdrawRequests {
          id
          beneficiary
          withdrawEnableTime
          createdAt
          expiryTime
        }
        totalUsersShares
        descriptionHash
      }
    }
  }
`;

// rewardsToken is the HAT token
export const GET_MASTER_DATA = gql`
  {
    masters {
      rewardsToken
      withdrawPeriod
      safetyPeriod
    }
  }
`

export const getStakerData = (vaultID: string, stakerAddress: string) => {
  return gql`
    {
      stakers (where: { parentVault: "${vaultID}", address: "${stakerAddress}" }) {
        shares
        depositAmount
        withdrawAmount
      }
    }
  `;
}

export const getStakerAmounts = (stakerAddress: string) => {
  return gql`
    {
      stakers (where: { address: "${stakerAddress}" }) {
        shares
        depositAmount
        withdrawAmount
        parentVault {
          stakingToken
        }
      }
    }
  `;
}

export const getBeneficiaryWithdrawRequests = (pid: string, beneficiary: string) => {
  return gql`
    {
      parentVaults (where: { pid: "${pid}" }) {
        withdrawRequests(where: { beneficiary: "${beneficiary}" }) {
          id
          beneficiary
          withdrawEnableTime
          createdAt
          expiryTime
        }
      }
    }
  `;
}
