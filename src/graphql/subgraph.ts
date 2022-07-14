import { gql } from "@apollo/client";

export const GET_VAULTS = gql`
  query getVaults {
    vaults {
      id
      descriptionHash
      pid
      stakingToken
      stakingTokenDecimals
      stakingTokenSymbol
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
        vestingHatDuration
        vestingHatPeriods
        rewardsToken
      }
      numberOfApprovedClaims
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
      hackerVestedRewardSplit
      hackerRewardSplit
      committeeRewardSplit
      swapAndBurnSplit
      governanceHatRewardSplit
      hackerHatRewardSplit
      vestingDuration
      vestingPeriods
      depositPause
      committeeCheckedIn
    }
  }
`;

export const GET_GENERAL_PARAMETERS = gql`
  query getRewardsToken {
    masters {
      rewardsToken
    }
  }
`
