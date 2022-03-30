import { BigNumber } from "ethers";

export enum LocalStorage {
  Cookies = "HATS_ACCEPTED_COOKIES",
  WelcomePage = "HATS_HAS_SEEN_WELCOME_PAGE",
  SubmitVulnerability = "HATS_SUBMIT_VULNERABILITY_DATA",
  NFTAirdrop = "HATS_NFT_AIRDROP_USER_NOTIFIED",
  PGPKeystore = "HATS_PGP_KEYSTORE"
}

export enum ScreenSize {
  Mobile = "MOBILE",
  Desktop = "DESKTOP"
}

export enum RoutePaths {
  vaults = "/vaults",
  gov = "/gov",
  vulnerability = "/vulnerability",
  pools = "/pools",
  nft_airdrop = "/nft_airdrop/",
  committee_tools = "/committee-tools",
  vault_editor = "/vault-editor",
  submission = "/bounty-payout"
}

export enum Networks {
  main = "mainnet",
  xdai = "xdai",
  rinkeby = "rinkeby",
  kovan = "kovan"
}

export enum VaultService {
  main = "",
  rinkeby = "https://vault-editor-service.herokuapp.com",
}

export enum MasterAddresses {
  main = "0x571f39d351513146248acafa9d0509319a327c4d",
  rinkeby = "0xccaadc293faaea229e0ca4a22b0330b65634b483"
}

export enum NFTMangerAddress {
  main = "0xc36442b4a4522e871399cd717abdd847ab11fe88",
  rinkeby = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"
}

export enum NFTAirdropAddress {
  main = "0x7AABB77BA782c57209dBe88aFF8beF113f55c05b",
  rinkeby = "0x572927d1641Ea6d633fB1EeF030FaB0D07Bf77e4"
}

export enum Pages {
  vaults = "Vaults",
  gov = "Gov",
  vulnerability = "Submit Vulnerability",
  pools = "Liquidity Pools",
  nft_airdrop = "NFT Airdrop"
}

export enum LPUniswapURIs {
  main = "https://api.thegraph.com/subgraphs/name/hats-finance/univ3staker",
  rinkeby = "https://api.thegraph.com/subgraphs/name/hats-finance/uni-v3-staker-rinkeby"
}

export const LP_UNISWAP_V3_HAT_ETH_APOLLO_CONTEXT = "lp_uniswap_v3_hat_eth";

/**
 * Corresponds to a transaction receipt status that is received after a transaction on the blockchain occurs
 */
export enum TransactionStatus {
  Fail = 0,
  Success = 1,
  Cancelled = 2
}

export const SMALL_SCREEN_BREAKPOINT = "1000px";

export const DEFUALT_NOTIFICATION_DISPLAY_TIME = 10000;

/** The maximum amount to allow spending from the user wallet in BigNumber */
export const MAX_SPENDING = BigNumber.from(2)
  .pow(BigNumber.from(96))
  .sub(BigNumber.from(1));

/** The minimum amount to deposit in WEI units */
export const MINIMUM_DEPOSIT = 1000000;

export enum NotificationType {
  Success = "SUCCESS",
  Error = "ERROR",
  Info = "INFO"
}

export const RC_TOOLTIP_OVERLAY_INNER_STYLE = {
  border: "none",
  minHeight: "unset"
};

export const DEFAULT_ERROR_MESSAGE = "OOPS! SOMETHING WENT WRONG";

export const IPFS_PREFIX = "https://hats-finance.mypinata.cloud/ipfs/";

export const DEFAULT_RINKEBY_SUBGRAPH_URI =
  "https://api.thegraph.com/subgraphs/name/hats-finance/hats_rinkeby_v4";

export const HATS_WEBSITE = "https://hats.finance";

export const DOCS = "https://docs.hats.finance/";

export const TERMS_OF_USE = "https://docs.hats.finance/terms-of-use-1";

export const RISK_FACTOR = "https://docs.hats.finance/risk-factor";

export const COOKIES_POLICY = "https://docs.hats.finance/cookies-policy";

export const TERMS_OF_SALE_OF_NFTS = "https://docs.hats.finance/nft/terms-of-sale-of-nfts";

export const UNISWAP_V3_APP = "https://app.uniswap.org/#/pool";

export const UNISWAP_V3_STAKER_ADDRESS =
  "0x1f98407aaB862CdDeF78Ed252D6f557aA5b0f00d";

export const COIN_GECKO_ETHEREUM =
  "https://api.coingecko.com/api/v3/simple/token_price/ethereum";

/** Used for the Uniswap V3 Liquidity Pool staking */
export const INCENTIVE_KEY_ABI =
  "tuple(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee)";

/** This is used when we need to set colors via the JavaScript */
export enum Colors {
  white = "#FFFFFF",
  red = "#E66480",
  turquoise = "#8AFCFD",
  darkBlue = "#000723",
  yellow = "#F2C94C",
  gray = "#C5C5C5"
}

export enum PieChartColors {
  vestedToken = "#15686B",
  token = "#2BC4CA",
  committee = "#DCFDFF",
  vestedHats = "#88FFF3",
  governance = "#38CFD4",
  swapAndBurn = "#035B5F"
}

/** Supported images and videos extensions for NFTs media */
export const IMAGES_EXTENTIONS = ["png"];
export const VIDEOS_EXTENTIONS = ["mp4"];

export enum SocialLinks {
  Discord = "https://discord.gg/xDphwRGyW7",
  Twitter = "https://twitter.com/HatsFinance",
  GitHub = "https://github.com/hats-finance",
  Medium = "https://medium.com/@HatsFinance",
  Telegram = "https://t.me/joinchat/QKP3HcdosVhjOTY0"
}
