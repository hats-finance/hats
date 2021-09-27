import { gql } from "@apollo/client";

export const GET_VAULTS = gql`
  query getVaults {
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

export const getIncentives = (rewardToken: string, ended: boolean) => {
  return gql`
    query getIncentives {
      incentives (where: { rewardToken: "${rewardToken}", ended: ${ended} }) {
        id
        startTime
        pool
        startTime
        endTime
        refundee
        reward
      }
    }
  `;
}

export const getPositions = (owner: string) => {
  return gql`
    query getPositions {
      positions (where: { owner: "${owner}" }) {
        id
        tokenId
        owner
        staked
        oldOwner
        liquidity
        approved
      }
    }
  `;
}
