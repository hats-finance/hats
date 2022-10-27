import { ChainId, Goerli, Mainnet } from "@usedapp/core";
import { BigNumber } from "ethers";

export enum LocalStorage {
  Cookies = "HATS_ACCEPTED_COOKIES",
  WelcomePage = "HATS_HAS_SEEN_WELCOME_PAGE",
  SubmitVulnerability = "HATS_SUBMIT_VULNERABILITY_DATA",
  Keystore = "HATS_PGP_KEYSTORE"
}

export enum ScreenSize {
  Mobile = "MOBILE",
  Desktop = "DESKTOP"
}

export const HATVaultsNFTContract = {
  [ChainId.Mainnet]: "0x1569Fd54478B25E3AcCf3baC3f231108D95F50C4",
  [ChainId.Goerli]: "0x4bdDe617aB54C6E45b4Bf08963F008dFC5da92aD"
}

export const MAX_NFT_TIER = 3;

export const Chains = {
  [ChainId.Mainnet]: Mainnet,
  [ChainId.Goerli]: Goerli
}

export const VaultService = "https://vault-editor-service.herokuapp.com"

export const Endpoints = {
  [ChainId.Mainnet]: "https://eth-mainnet.alchemyapi.io/v2/c4ovmC7YsQq1qM0lp6h7Ao9bGX_v4JG-",
  [ChainId.Goerli]: "https://eth-goerli.g.alchemy.com/v2/HMtXCk0FyIfbiNAVm4Xcgr8Eqlc5_DKd"
}

export const VaultSubgraphs = {
  [ChainId.Mainnet]: "https://api.thegraph.com/subgraphs/name/hats-finance/hatsmainnetv6",
  [ChainId.Goerli]: "https://api.thegraph.com/subgraphs/name/hats-finance/hatsgoerli-v6"
};

export const NFTContractDataProxy = {
  ["0xCCaadc293FaAEa229e0ca4A22B0330b65634b483".toLowerCase()]: "0x1d25bf3d0f8997282055a1a242fa2b146e7b4ec5",
  ["0x571f39d351513146248AcafA9D0509319A327C4D".toLowerCase()]: "0xe127be2bc276142039bc16251bb04e15b2b34f25",
  "0x18a82fd0e4f64f0f3be455319c8609771e49d58f": "0x57f6936a48dfe792ef7dba5415a1f34cf405bad7"
}

export const UNISWAP_V3_SUBGRAPH = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

export enum Pages {
  vaults = "Vaults",
  gov = "Gov",
  vulnerability = "Submit Vulnerability",
  airdrop_machine = "Airdrop Machine",
}

export const SMALL_SCREEN_BREAKPOINT = "1100px";

export const DefaultBotAddress = "https://hats-telegram-bot.herokuapp.com/broadcast-message";

export const DEFUALT_NOTIFICATION_DISPLAY_TIME = 10000;

/** The maximum amount to allow spending from the user wallet in BigNumber */
export const MAX_SPENDING = BigNumber.from(2)
  .pow(BigNumber.from(96))
  .sub(BigNumber.from(1));

/** The minimum amount to deposit in WEI units */
export const MINIMUM_DEPOSIT = 1000000;

export const RC_TOOLTIP_OVERLAY_INNER_STYLE = {
  border: "none",
  minHeight: "unset"
};

export const DEFAULT_ERROR_MESSAGE = "OOPS! SOMETHING WENT WRONG";

export const IPFS_PREFIX = "https://hats-finance.mypinata.cloud/ipfs";

export const HATS_WEBSITE = "https://hats.finance";

export const DOCS = "https://docs.hats.finance/";

export const TERMS_OF_USE = "https://docs.hats.finance/terms-of-use-1";

export const RISK_FACTOR = "https://docs.hats.finance/risk-factor";

export const COOKIES_POLICY = "https://docs.hats.finance/cookies-policy";

export const TERMS_OF_SALE_OF_NFTS = "https://docs.hats.finance/nft/terms-of-sale-of-nfts";

export const COIN_GECKO_ETHEREUM =
  "https://api.coingecko.com/api/v3/simple/token_price/ethereum";

export const EMBASSY_LEARN_MORE = "https://medium.com/@hatsfinance/proof-of-deposit-nft-powered-security-7c0456672539";

/** This is used when we need to set colors via the JavaScript */
export enum Colors {
  white = "#FFFFFF",
  red = "#E66480",
  strongRed = "#F24822",
  turquoise = "#8AFCFD",
  darkBlue = "#000723",
  yellow = "#F2C94C",
  gray = "#C5C5C5",
  black = "#000000",
  fieldBlue = "#0C1436",
  lightTurquoise = "9BC8CA",
}

export enum PieChartColors {
  vestedToken = "#15686B",
  token = "#2BC4CA",
  committee = "#DCFDFF",
  vestedHats = "#88FFF3",
  governance = "#38CFD4",
  swapAndBurn = "#035B5F"
}

export enum SocialLinks {
  Discord = "https://discord.gg/xDphwRGyW7",
  Twitter = "https://twitter.com/HatsFinance",
  GitHub = "https://github.com/hats-finance",
  Medium = "https://medium.com/@HatsFinance",
  Telegram = "https://t.me/joinchat/QKP3HcdosVhjOTY0"
}

export const GOV_DISCORD_LINK = "https://discord.gg/McjYd9bd";
export const DISCORD_ENTRY_CHANNEL = "https://discord.com/channels/810534320040837121/976144633899925504";

const NORMAL_SEVERITIES_COLORS = ["#141F50", "#19265F", "#213173", "#122777"];
const GAMIFICATION_SEVERITIES_COLORS = ["#2A115F", "#3B1B7E", "#4B239F"];

export const VAULTS_TYPE_SEVERITIES_COLORS = {
  "gamification": GAMIFICATION_SEVERITIES_COLORS,
  "normal": NORMAL_SEVERITIES_COLORS,
  "Grants": NORMAL_SEVERITIES_COLORS,
  "": NORMAL_SEVERITIES_COLORS
}

export enum Transactions {
  Approve = "Approve",
  DepositAndClaim = "Deposit and Claim",
  WithdrawAndClaim = "Withdraw and Claim",
  WithdrawRequest = "Withdraw Request",
  Claim = "Claim",
  ClaimReward = "Claim Reward",
  CheckIn = "Check In",
  AddPool = "Add Pool",
  RedeemTreeNFTs = "Redeem Tree NFTs",
  RedeemDepositNFTs = "Redeem Deposit NFTs",
}

export const WhereverConfig = {
  [ChainId.Mainnet]: {
    partnerKey: "",
    env: "production"
  },
  [ChainId.Rinkeby]: {
    partnerKey: "",
    env: "staging"
  },
  [ChainId.Goerli]: {
    partnerKey: "6bfd58ee-8fc8-4b5d-96f4-9562c7095e06",
    env: "staging"
  }
};
