export const GET_VAULTS = `
  query getVaults($account: String) {
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
      defaultHackerHatRewardSplit
      defaultGovernanceHatRewardSplit
    }
    userNfts: owners(where: { address: $account }) {
      id
      balance
      nft {
        id
        tokenURI
        tokenId
        nftMaster
      }
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
        defaultHackerHatRewardSplit
        defaultGovernanceHatRewardSplit
      }
      numberOfApprovedClaims
      rewardsLevels
      liquidityPool
      registered
      userWithdrawRequest: withdrawRequests( where: { beneficiary: $account }) {
        id
        beneficiary
        withdrawEnableTime
        createdAt
        expiryTime
      }
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
      rewardControllers {
        id
        rewardToken
        rewardTokenSymbol
        rewardTokenDecimals
        totalRewardPaid
      }
    }
  }
`;

export const GET_STAKER = `
  query getStaker($address: Bytes!) {
    stakers(where: { address: $address }) {
      pid
      master {
        address
      }
    }
  }
`;
