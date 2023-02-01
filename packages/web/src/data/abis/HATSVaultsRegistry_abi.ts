export const HATSVaultsRegistry_abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_hatVaultImplementation",
        type: "address",
      },
      {
        internalType: "address",
        name: "_hatGovernance",
        type: "address",
      },
      {
        internalType: "address",
        name: "_HAT",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_bountyGovernanceHAT",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_bountyHackerHATVested",
        type: "uint256",
      },
      {
        internalType: "contract ITokenLockFactory",
        name: "_tokenLockFactory",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AmountSwappedLessThanMinimum",
    type: "error",
  },
  {
    inputs: [],
    name: "AmountToSwapIsZero",
    type: "error",
  },
  {
    inputs: [],
    name: "ChallengePeriodTooLong",
    type: "error",
  },
  {
    inputs: [],
    name: "ChallengePeriodTooShort",
    type: "error",
  },
  {
    inputs: [],
    name: "ChallengeTimeOutPeriodTooLong",
    type: "error",
  },
  {
    inputs: [],
    name: "ChallengeTimeOutPeriodTooShort",
    type: "error",
  },
  {
    inputs: [],
    name: "DelayTooShort",
    type: "error",
  },
  {
    inputs: [],
    name: "HatVestingDurationSmallerThanPeriods",
    type: "error",
  },
  {
    inputs: [],
    name: "HatVestingDurationTooLong",
    type: "error",
  },
  {
    inputs: [],
    name: "HatVestingPeriodsCannotBeZero",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEnoughFeePaid",
    type: "error",
  },
  {
    inputs: [],
    name: "SafetyPeriodTooLong",
    type: "error",
  },
  {
    inputs: [],
    name: "SwapFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "TotalHatsSplitPercentageShouldBeUpToMaxHATSplit",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawPeriodTooShort",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawRequestEnabledPeriodTooLong",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawRequestEnabledPeriodTooShort",
    type: "error",
  },
  {
    inputs: [],
    name: "WithdrawRequestPendingPeriodTooLong",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_claimer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_descriptionHash",
        type: "string",
      },
    ],
    name: "LogClaim",
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
        indexed: false,
        internalType: "uint256",
        name: "_fee",
        type: "uint256",
      },
    ],
    name: "SetClaimFee",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_defaultArbitrator",
        type: "address",
      },
    ],
    name: "SetDefaultArbitrator",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "_defaultArbitratorCanChangeBounty",
        type: "bool",
      },
    ],
    name: "SetDefaultArbitratorCanChangeBounty",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_defaultChallengePeriod",
        type: "uint256",
      },
    ],
    name: "SetDefaultChallengePeriod",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_defaultChallengeTimeOutPeriod",
        type: "uint256",
      },
    ],
    name: "SetDefaultChallengeTimeOutPeriod",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_defaultBountyGovernanceHAT",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_defaultBountyHackerHATVested",
        type: "uint256",
      },
    ],
    name: "SetDefaultHATBountySplit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "_isEmergencyPaused",
        type: "bool",
      },
    ],
    name: "SetEmergencyPaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_feeSetter",
        type: "address",
      },
    ],
    name: "SetFeeSetter",
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
    name: "SetHatVestingParams",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_delay",
        type: "uint256",
      },
    ],
    name: "SetMaxBountyDelay",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_vault",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bool",
        name: "_visible",
        type: "bool",
      },
    ],
    name: "SetVaultVisibility",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_withdrawRequestPendingPeriod",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_withdrawRequestEnablePeriod",
        type: "uint256",
      },
    ],
    name: "SetWithdrawRequestParams",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_withdrawPeriod",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_safetyPeriod",
        type: "uint256",
      },
    ],
    name: "SetWithdrawSafetyPeriod",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_beneficiary",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amountSwapped",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amountSent",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_tokenLock",
        type: "address",
      },
    ],
    name: "SwapAndSend",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_vault",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_committee",
        type: "address",
      },
      {
        indexed: false,
        internalType: "contract IRewardController",
        name: "_rewardController",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_maxBounty",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "hackerVested",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "hacker",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "committee",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct IHATVault.BountySplit",
        name: "_bountySplit",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_descriptionHash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_bountyVestingDuration",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_bountyVestingPeriods",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "_isPaused",
        type: "bool",
      },
    ],
    name: "VaultCreated",
    type: "event",
  },
  {
    inputs: [],
    name: "HAT",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
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
    name: "MAX_HAT_SPLIT",
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
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "address",
        name: "_hacker",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_hackersHatReward",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_governanceHatReward",
        type: "uint256",
      },
    ],
    name: "addTokensToSwap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_committee",
        type: "address",
      },
      {
        internalType: "contract IRewardController",
        name: "_rewardController",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_maxBounty",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "hackerVested",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "hacker",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "committee",
            type: "uint256",
          },
        ],
        internalType: "struct IHATVault.BountySplit",
        name: "_bountySplit",
        type: "tuple",
      },
      {
        internalType: "string",
        name: "_descriptionHash",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_bountyVestingDuration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_bountyVestingPeriods",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isPaused",
        type: "bool",
      },
    ],
    name: "createVault",
    outputs: [
      {
        internalType: "address",
        name: "vault",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "defaultArbitrator",
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
    name: "defaultArbitratorCanChangeBounty",
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
    name: "defaultBountyGovernanceHAT",
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
    name: "defaultBountyHackerHATVested",
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
    name: "defaultChallengePeriod",
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
    name: "defaultChallengeTimeOutPeriod",
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
    name: "feeSetter",
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
    name: "generalParameters",
    outputs: [
      {
        internalType: "uint256",
        name: "hatVestingDuration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "hatVestingPeriods",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "withdrawPeriod",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "safetyPeriod",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "withdrawRequestEnablePeriod",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "withdrawRequestPendingPeriod",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "setMaxBountyDelay",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "claimFee",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGeneralParameters",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "hatVestingDuration",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "hatVestingPeriods",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "withdrawPeriod",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "safetyPeriod",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "withdrawRequestEnablePeriod",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "withdrawRequestPendingPeriod",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "setMaxBountyDelay",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "claimFee",
            type: "uint256",
          },
        ],
        internalType: "struct IHATVaultsRegistry.GeneralParameters",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getNumberOfVaults",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "governanceHatReward",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hackersHatReward",
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
    name: "hatVaultImplementation",
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
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "hatVaults",
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
    name: "isEmergencyPaused",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isVaultVisible",
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
        internalType: "string",
        name: "_descriptionHash",
        type: "string",
      },
    ],
    name: "logClaim",
    outputs: [],
    stateMutability: "payable",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_fee",
        type: "uint256",
      },
    ],
    name: "setClaimFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_defaultArbitrator",
        type: "address",
      },
    ],
    name: "setDefaultArbitrator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_defaultArbitratorCanChangeBounty",
        type: "bool",
      },
    ],
    name: "setDefaultArbitratorCanChangeBounty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_defaultChallengePeriod",
        type: "uint256",
      },
    ],
    name: "setDefaultChallengePeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_defaultChallengeTimeOutPeriod",
        type: "uint256",
      },
    ],
    name: "setDefaultChallengeTimeOutPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_defaultBountyGovernanceHAT",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_defaultBountyHackerHATVested",
        type: "uint256",
      },
    ],
    name: "setDefaultHATBountySplit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_isEmergencyPaused",
        type: "bool",
      },
    ],
    name: "setEmergencyPaused",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_feeSetter",
        type: "address",
      },
    ],
    name: "setFeeSetter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_duration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_periods",
        type: "uint256",
      },
    ],
    name: "setHatVestingParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_delay",
        type: "uint256",
      },
    ],
    name: "setMaxBountyDelay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_vault",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_visible",
        type: "bool",
      },
    ],
    name: "setVaultVisibility",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_withdrawRequestPendingPeriod",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_withdrawRequestEnablePeriod",
        type: "uint256",
      },
    ],
    name: "setWithdrawRequestParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_withdrawPeriod",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_safetyPeriod",
        type: "uint256",
      },
    ],
    name: "setWithdrawSafetyPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_beneficiaries",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "_amountOutMinimum",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_routingContract",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_routingPayload",
        type: "bytes",
      },
    ],
    name: "swapAndSend",
    outputs: [],
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
    inputs: [
      {
        internalType: "uint256",
        name: "_challengePeriod",
        type: "uint256",
      },
    ],
    name: "validateChallengePeriod",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_challengeTimeOutPeriod",
        type: "uint256",
      },
    ],
    name: "validateChallengeTimeOutPeriod",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_bountyGovernanceHAT",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_bountyHackerHATVested",
        type: "uint256",
      },
    ],
    name: "validateHATSplit",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
] as const;
