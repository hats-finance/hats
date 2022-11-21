import { gql } from "@apollo/client";

export const GET_VAULTS = `
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
      honeyPotBalance
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
      rewardController {
        id
        rewardToken
        rewardTokenSymbol
        rewardTokenDecimals
        totalRewardPaid
      }
    }
  }
`;

export const GET_STAKER = gql`
  query getStaker($address: Bytes!) {
    stakers(where: { address: $address }) {
      pid
      master {
        address
      }
    }
  }
`;
