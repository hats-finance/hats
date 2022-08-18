import { gql } from "@apollo/client";
import moment from "moment";

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

export const GET_CLAIM = gql`
query getClaim($descriptionHash: String) {
  submittedClaims(where: { claim: $descriptionHash}) {
    id
    claim
    claimer
    createdAt
    master {
      address
    }
  }
}
`