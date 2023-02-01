import { BigNumber } from "ethers";

export interface IDepositTokensData {
  depositTokens?: INFTTokenInfoRedeemed[];
  redeem: () => Promise<INFTTokenInfoRedeemed[]>;
  afterDeposit: (vault: IVaultIdentifier) => Promise<INFTTokenInfoRedeemed[]>;
}

export interface IAirdropData {
  airdropTokens?: INFTTokenInfoRedeemed[];
  airdropInfo?: AirdropMachineWallet;
  isBeforeDeadline?: boolean;
}

export interface NFTEligibilityElement {
  pid: number | string;
  tier: number;
  masterAddress: string;
}

export interface AirdropMachineWallet {
  address: string;
  token_eligibility: {
    committee_member: string;
    depositor: string;
    crow: string;
    coder: string;
    early_contributor: string;
  };
  nft_elegebility: NFTEligibilityElement[];
}

export interface INFTTokenMetadata {
  name: string;
  description: string;
  image: string;
  animation_url: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

export interface IVaultIdentifier {
  pid: string;
  masterAddress: string;
  proxyAddress: string;
  chainId: number;
}

export interface INFTToken extends IVaultIdentifier {
  tier: number;
}

export interface INFTTokenInfo extends INFTToken {
  tokenId: BigNumber;
  metadata: INFTTokenMetadata;
  // isMerkleTree: boolean;
  // isDeposit: boolean;
}

export interface INFTTokenInfoRedeemed extends INFTTokenInfo {
  isRedeemed: boolean;
}
