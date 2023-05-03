export const HATPaymentSplitterFactory_abi = [
  {
    inputs: [{ internalType: "address", name: "_implementation", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "address", name: "_hatPaymentSplitter", type: "address" }],
    name: "HATPaymentSplitterCreated",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address[]", name: "_payees", type: "address[]" },
      { internalType: "uint256[]", name: "_shares", type: "uint256[]" },
    ],
    name: "createHATPaymentSplitter",
    outputs: [{ internalType: "address", name: "result", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "implementation",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "nonce",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_deployer", type: "address" }],
    name: "predictNextSplitterAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_nonce", type: "uint256" },
      { internalType: "address", name: "_deployer", type: "address" },
    ],
    name: "predictSplitterAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
