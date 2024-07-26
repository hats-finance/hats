export const HATPaymentSplitterFactory_abi = [
  {
    inputs: [{ internalType: "address", name: "_implementation", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "ArrayLengthMismatch", type: "error" },
  { inputs: [], name: "DuplicatedPayee", type: "error" },
  { inputs: [], name: "NoPayees", type: "error" },
  { inputs: [], name: "ZeroAddress", type: "error" },
  { inputs: [], name: "ZeroShares", type: "error" },
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
    inputs: [
      { internalType: "address[]", name: "_payees", type: "address[]" },
      { internalType: "uint256[]", name: "_shares", type: "uint256[]" },
    ],
    name: "predictSplitterAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
