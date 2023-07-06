export const GET_VAULTS = `
  query getVaults($account: String) {
    masters(first: 1000) {
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
    userNfts: nftowners(where: { address: $account }) {
      id
      balance
      nft {
        id
        tokenURI
        tokenId
        nftMaster
      }
    }
    vaults(first: 1000) {
      id
      version
      descriptionHash
      pid
      name
      stakingToken
      stakingTokenDecimals
      stakingTokenSymbol
      honeyPotBalance
      totalRewardPaid
      committee
      allocPoints
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
        timelock: governance
      }
      numberOfApprovedClaims
      rewardsLevels
      liquidityPool
      registered
      maxBounty
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
      activeClaim {
        id
        claim
      }
    }
    payouts: claims(first: 1000) {
      id
      vault {
        id
      }
      payoutDataHash: claim
      beneficiary: claimer
      approvedAt
      dismissedAt
      bountyPercentage
      severityIndex: severity
      hackerReward
      hackerVestedReward
      governanceHatReward
      hackerHatReward
      committeeReward
      isChallenged
    }
  }
`;

export const GET_SUBMISSIONS = `
  query getSubmissions($batch: Int, $skip: Int) {
    submissions: loggedClaims(first: $batch, skip: $skip) {
      id
      submissionHash: claim
      submitter: claimer
      createdAt
      master {
        id
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
