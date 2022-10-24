import { gql } from "@apollo/client";

export const GET_VAULTS = gql`
  query getVaults {
    masters {
      address
      governance
      numberOfSubmittedClaims
      withdrawPeriod
      safetyPeriod
      withdrawRequestEnablePeriod
      withdrawRequestPendingPeriod
      vestingHatDuration
      vestingHatPeriods
      rewardsToken
    }
    vaults {
      id
      version
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

export const GET_STAKER = gql`
   query getStaker($address: Bytes!) {
      stakers (where: {address: $address }) {
        pid
        master {
          address
        }
      }
    }
  `