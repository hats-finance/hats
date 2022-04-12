/** 
 * This is used for rinkeby. In mainnet it is fetched from the subgraph
 */
export const REWARDS_TOKEN = "0x8C75dB6367e6eE1980d1999598bd38cbfD690A2A";

export const DELEGATION_EXPIRY = 10e9;

export enum TokenAirdropCID {
  main = "",
  rinkeby = "QmVtwH39GHFbR7HJK4e9WK4JWHSoQdTTBRuti81rRdCkSJ"
}

export enum TokenAirdropDelegatees {
  main = "",
  rinkeby = "QmRoETRRwd6Ty7MqMb7payUJT4oj9kyX2GtvPXHvP3nqXm"
}

export enum NFTAirdropAddress {
  main = "0x7AABB77BA782c57209dBe88aFF8beF113f55c05b",
  rinkeby = "0x572927d1641Ea6d633fB1EeF030FaB0D07Bf77e4"
}

export enum TokenAirdropAddress {
  main = "",
  rinkeby = "0xB2F80c70345EF3cc13968487bc692F62D9417a6E"
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
