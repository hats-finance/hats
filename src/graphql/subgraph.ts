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

// rewardsToken is the HAT token
export const GET_MASTER_DATA = gql`
  query getMaster {
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
      stakers (where: { vault: "${vaultID}", address: "${stakerAddress}" }) {
        shares
        depositAmount
      }
    }
  `;
}

export const getBeneficiaryWithdrawRequests = (pid: string, beneficiary: string) => {
  return gql`
    {
      vaults (where: { pid: "${pid}" }) {
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
