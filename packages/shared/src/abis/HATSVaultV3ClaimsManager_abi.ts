export const HATSVaultV3ClaimsManager_abi = [
  {
    inputs: [],
    name: "ActiveClaimExists",
    type: "error",
  },
  {
    inputs: [],
    name: "BountyPercentageHigherThanMaxBounty",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotSetToPerviousRewardController",
    type: "error",
  },
  {
    inputs: [],
    name: "ChallengePeriodEnded",
    type: "error",
  },
  {
    inputs: [],
    name: "ChallengedClaimCanOnlyBeApprovedByArbitratorUntilChallengeTimeoutPeriod",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimAlreadyChallenged",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimExpired",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimIdIsNotActive",
    type: "error",
  },
  {
    inputs: [],
    name: "CommitteeAlreadyCheckedIn",
    type: "error",
  },
  {
    inputs: [],
    name: "CommitteeBountyCannotBeMoreThanMax",
    type: "error",
  },
  {
    inputs: [],
    name: "DelayPeriodForSettingMaxBountyHadNotPassed",
    type: "error",
  },
  {
    inputs: [],
    name: "MaxBountyCannotBeMoreThanMaxBountyLimit",
    type: "error",
  },
  {
    inputs: [],
    name: "NoActiveClaimExists",
    type: "error",
  },
  {
    inputs: [],
    name: "NoPendingMaxBounty",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEnoughFeePaid",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEnoughUserBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "NotSafetyPeriod",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyArbitratorOrRegistryOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyCallableByArbitratorOrAfterChallengeTimeOutPeriod",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyCallableIfChallenged",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyCommittee",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyRegistryOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "PayoutMustBeUpToMaxBountyLimitOrHundredPercent",
    type: "error",
  },
  {
    inputs: [],
    name: "SafetyPeriod",
    type: "error",
  },
  {
    inputs: [],
    name: "SetSharesArraysMustHaveSameLength",
    type: "error",
  },
  {
    inputs: [],
    name: "SystemInEmergencyPause",
    type: "error",
  },
  {
    inputs: [],
    name: "TotalSplitPercentageShouldBeHundredPercent",
    type: "error",
  },
  {
    inputs: [],
    name: "UnchallengedClaimCanOnlyBeApprovedAfterChallengePeriod",
    type: "error",
  },
  {
    inputs: [],
    name: "VestingDurationSmallerThanPeriods",
    type: "error",
  },
  {
    inputs: [],
    name: "VestingDurationTooLong",
    type: "error",
  },
  {
    inputs: [],
    name: "VestingPeriodsCannotBeZero",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "_claimId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_committee",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_approver",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_beneficiary",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_bountyPercentage",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_tokenLock",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "hacker",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "hackerVested",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "committee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "hackerHatVested",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "governanceHat",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct IHATClaimsManager.ClaimBounty",
        name: "_claimBounty",
        type: "tuple",
      },
    ],
    name: "ApproveClaim",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "_claimId",
        type: "bytes32",
      },
    ],
    name: "ChallengeClaim",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "CommitteeCheckedIn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "_claimId",
        type: "bytes32",
      },
    ],
    name: "DismissClaim",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_arbitrator",
        type: "address",
      },
    ],
    name: "SetArbitrator",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "_arbitratorCanChangeBounty",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_arbitratorCanChangeBeneficiary",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_arbitratorCanSubmitClaims",
        type: "bool",
      },
    ],
    name: "SetArbitratorOptions",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "uint16",
            name: "hackerVested",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "hacker",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "committee",
            type: "uint16",
          },
        ],
        indexed: false,
        internalType: "struct IHATClaimsManager.BountySplit",
        name: "_bountySplit",
        type: "tuple",
      },
    ],
    name: "SetBountySplit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_challengePeriod",
        type: "uint256",
      },
    ],
    name: "SetChallengePeriod",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_challengeTimeOutPeriod",
        type: "uint256",
      },
    ],
    name: "SetChallengeTimeOutPeriod",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_committee",
        type: "address",
      },
    ],
    name: "SetCommittee",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_bountyGovernanceHAT",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_bountyHackerHATVested",
        type: "uint256",
      },
    ],
    name: "SetHATBountySplit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_maxBounty",
        type: "uint256",
      },
    ],
    name: "SetMaxBounty",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_maxBounty",
        type: "uint256",
      },
    ],
    name: "SetPendingMaxBounty",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_duration",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_periods",
        type: "uint256",
      },
    ],
    name: "SetVestingParams",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "_claimId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_committee",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_submitter",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_beneficiary",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_bountyPercentage",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_descriptionHash",
        type: "string",
      },
    ],
    name: "SubmitClaim",
    type: "event",
  },
  {
    inputs: [],
    name: "HUNDRED_PERCENT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "HUNDRED_PERCENT_SQRD",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_BOUNTY_LIMIT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_COMMITTEE_BOUNTY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NULL_ADDRESS",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NULL_UINT16",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NULL_UINT32",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "VERSION",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "activeClaim",
    outputs: [
      {
        internalType: "bytes32",
        name: "claimId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "beneficiary",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "bountyPercentage",
        type: "uint16",
      },
      {
        internalType: "address",
        name: "committee",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "createdAt",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "challengedAt",
        type: "uint32",
      },
      {
        internalType: "uint256",
        name: "bountyGovernanceHAT",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bountyHackerHATVested",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "arbitrator",
        type: "address",
      },
      {
        internalType: "uint32",
        name: "challengePeriod",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "challengeTimeOutPeriod",
        type: "uint32",
      },
      {
        internalType: "bool",
        name: "arbitratorCanChangeBounty",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "arbitratorCanChangeBeneficiary",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_claimId",
        type: "bytes32",
      },
      {
        internalType: "uint16",
        name: "_bountyPercentage",
        type: "uint16",
      },
      {
        internalType: "address",
        name: "_beneficiary",
        type: "address",
      },
    ],
    name: "approveClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "arbitratorCanChangeBeneficiary",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "arbitratorCanChangeBounty",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "arbitratorCanSubmitClaims",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bountySplit",
    outputs: [
      {
        internalType: "uint16",
        name: "hackerVested",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "hacker",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "committee",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_claimId",
        type: "bytes32",
      },
    ],
    name: "challengeClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "committee",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "committeeCheckIn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "committeeCheckedIn",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_claimId",
        type: "bytes32",
      },
    ],
    name: "dismissClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getActiveClaim",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "claimId",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "beneficiary",
            type: "address",
          },
          {
            internalType: "uint16",
            name: "bountyPercentage",
            type: "uint16",
          },
          {
            internalType: "address",
            name: "committee",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "createdAt",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "challengedAt",
            type: "uint32",
          },
          {
            internalType: "uint256",
            name: "bountyGovernanceHAT",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "bountyHackerHATVested",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "arbitrator",
            type: "address",
          },
          {
            internalType: "uint32",
            name: "challengePeriod",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "challengeTimeOutPeriod",
            type: "uint32",
          },
          {
            internalType: "bool",
            name: "arbitratorCanChangeBounty",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "arbitratorCanChangeBeneficiary",
            type: "bool",
          },
        ],
        internalType: "struct IHATClaimsManager.Claim",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getArbitrator",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBountyGovernanceHAT",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBountyHackerHATVested",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getChallengePeriod",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getChallengeTimeOutPeriod",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IHATVault",
        name: "_vault",
        type: "address",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "vestingDuration",
            type: "uint32",
          },
          {
            internalType: "uint32",
            name: "vestingPeriods",
            type: "uint32",
          },
          {
            internalType: "uint16",
            name: "maxBounty",
            type: "uint16",
          },
          {
            components: [
              {
                internalType: "uint16",
                name: "hackerVested",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "hacker",
                type: "uint16",
              },
              {
                internalType: "uint16",
                name: "committee",
                type: "uint16",
              },
            ],
            internalType: "struct IHATClaimsManager.BountySplit",
            name: "bountySplit",
            type: "tuple",
          },
          {
            internalType: "uint16",
            name: "bountyGovernanceHAT",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "bountyHackerHATVested",
            type: "uint16",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "address",
            name: "committee",
            type: "address",
          },
          {
            internalType: "address",
            name: "arbitrator",
            type: "address",
          },
          {
            internalType: "bool",
            name: "arbitratorCanChangeBounty",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "arbitratorCanChangeBeneficiary",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "arbitratorCanSubmitClaims",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isTokenLockRevocable",
            type: "bool",
          },
        ],
        internalType: "struct IHATClaimsManager.ClaimsManagerInitParams",
        name: "_params",
        type: "tuple",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "isTokenLockRevocable",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxBounty",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingMaxBounty",
    outputs: [
      {
        internalType: "uint16",
        name: "maxBounty",
        type: "uint16",
      },
      {
        internalType: "uint32",
        name: "timestamp",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "registry",
    outputs: [
      {
        internalType: "contract IHATVaultsRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_arbitrator",
        type: "address",
      },
    ],
    name: "setArbitrator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_arbitratorCanChangeBounty",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_arbitratorCanChangeBeneficiary",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_arbitratorCanSubmitClaims",
        type: "bool",
      },
    ],
    name: "setArbitratorOptions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint16",
            name: "hackerVested",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "hacker",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "committee",
            type: "uint16",
          },
        ],
        internalType: "struct IHATClaimsManager.BountySplit",
        name: "_bountySplit",
        type: "tuple",
      },
    ],
    name: "setBountySplit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_challengePeriod",
        type: "uint32",
      },
    ],
    name: "setChallengePeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_challengeTimeOutPeriod",
        type: "uint32",
      },
    ],
    name: "setChallengeTimeOutPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_committee",
        type: "address",
      },
    ],
    name: "setCommittee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_bountyGovernanceHAT",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "_bountyHackerHATVested",
        type: "uint16",
      },
    ],
    name: "setHATBountySplit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "setMaxBounty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_maxBounty",
        type: "uint16",
      },
    ],
    name: "setPendingMaxBounty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "_duration",
        type: "uint32",
      },
      {
        internalType: "uint32",
        name: "_periods",
        type: "uint32",
      },
    ],
    name: "setVestingParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_beneficiary",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "_bountyPercentage",
        type: "uint16",
      },
      {
        internalType: "string",
        name: "_descriptionHash",
        type: "string",
      },
    ],
    name: "submitClaim",
    outputs: [
      {
        internalType: "bytes32",
        name: "claimId",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenLockFactory",
    outputs: [
      {
        internalType: "contract ITokenLockFactory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "vault",
    outputs: [
      {
        internalType: "contract IHATVault",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "vestingDuration",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "vestingPeriods",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
