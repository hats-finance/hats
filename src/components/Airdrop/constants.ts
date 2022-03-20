export const TOKEN_AIRDROP_IPFS_CID = "QmcLrUzm7Hs14V5dN6Hgzns7joGwJxNrmSDVjsrmQhQAMt";

/** 
 * TODO: temporary until we fetch it from the subgraph
 */
export const AIRDROP_TOKEN_AIRDROP_ADDRESS = "0x8C75dB6367e6eE1980d1999598bd38cbfD690A2A";

export const DELEGATEES_IPFS = "Qmew8Hu6VpdCy9gMBMm279BC9kwjQpXs9avXki7bqq5Mph";

export const DELEGATION_EXPIRY = 10e9;

export enum NFTAirdropAddress {
  main = "0x7AABB77BA782c57209dBe88aFF8beF113f55c05b",
  rinkeby = "0x572927d1641Ea6d633fB1EeF030FaB0D07Bf77e4"
}

export enum TokenAirdropAddress {
  main = "",
  rinkeby = "0xe2ce4E37bae2bbDbb1253c043cd4263B96e45367"
}

export enum EligibilityStatus {
  ELIGIBLE,
  NOT_ELIGIBLE,
  REDEEMED,
  UNKNOWN
}

export interface IDelegateeData {
  address: string
  image: string
  name: string
  tweeter_username: string
  role: string
  description: string
  votes?: number
  self?: boolean
}

export const EIP712Domain = [
  { "name": "name", "type": "string" },
  { "name": "chainId", "type": "uint256" },
  { "name": "verifyingContract", "type": "address" }
]

export const Delegation = [
  { name: 'delegatee', type: 'address' },
  { name: 'nonce', type: 'uint256' },
  { name: 'expiry', type: 'uint256' },
];
