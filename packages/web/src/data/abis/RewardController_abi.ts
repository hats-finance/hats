export const RewardController_abi = [
  { inputs: [], name: "EpochLengthZero", type: "error" },
  { inputs: [], name: "NotEnoughRewardsToTransferToUser", type: "error" },
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
        name: "_user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "ClaimReward",
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
        indexed: false,
        internalType: "uint256[24]",
        name: "_epochRewardPerBlock",
        type: "uint256[24]",
      },
    ],
    name: "SetEpochRewardPerBlock",
    type: "event",
  },
  {
    inputs: [],
    name: "NUMBER_OF_EPOCHS",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "REWARD_PRECISION",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_vault", type: "address" },
      { internalType: "address", name: "_user", type: "address" },
    ],
    name: "claimReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_user", type: "address" },
      { internalType: "uint256", name: "_sharesChange", type: "uint256" },
      { internalType: "bool", name: "_isDeposit", type: "bool" },
    ],
    name: "commitUserBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "epochLength",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "epochRewardPerBlock",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGlobalVaultsUpdatesLength",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_vault", type: "address" },
      { internalType: "address", name: "_user", type: "address" },
    ],
    name: "getPendingReward",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_fromBlock", type: "uint256" },
      { internalType: "uint256", name: "_toBlock", type: "uint256" },
      { internalType: "uint256", name: "_allocPoint", type: "uint256" },
      {
        internalType: "uint256",
        name: "_totalAllocPoint",
        type: "uint256",
      },
    ],
    name: "getRewardForBlocksRange",
    outputs: [{ internalType: "uint256", name: "reward", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_vault", type: "address" },
      { internalType: "uint256", name: "_fromBlock", type: "uint256" },
    ],
    name: "getVaultReward",
    outputs: [{ internalType: "uint256", name: "reward", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "globalVaultsUpdates",
    outputs: [
      { internalType: "uint256", name: "blockNumber", type: "uint256" },
      {
        internalType: "uint256",
        name: "totalAllocPoint",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_rewardToken", type: "address" },
      {
        internalType: "address",
        name: "_hatsGovernance",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_startRewardingBlock",
        type: "uint256",
      },
      { internalType: "uint256", name: "_epochLength", type: "uint256" },
      {
        internalType: "uint256[24]",
        name: "_epochRewardPerBlock",
        type: "uint256[24]",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
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
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "rewardDebt",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardToken",
    outputs: [
      {
        internalType: "contract IERC20Upgradeable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_vault", type: "address" },
      { internalType: "uint256", name: "_allocPoint", type: "uint256" },
    ],
    name: "setAllocPoint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[24]",
        name: "_epochRewardPerBlock",
        type: "uint256[24]",
      },
    ],
    name: "setEpochRewardPerBlock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startBlock",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20Upgradeable",
        name: "_token",
        type: "address",
      },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "sweepToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "unclaimedReward",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_vault", type: "address" }],
    name: "updateVault",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "vaultInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "rewardPerShare",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastProcessedVaultUpdate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastRewardBlock",
        type: "uint256",
      },
      { internalType: "uint256", name: "allocPoint", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
