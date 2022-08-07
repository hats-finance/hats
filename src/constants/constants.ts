import { ChainId, Mainnet, Rinkeby } from "@usedapp/core";
import { BigNumber } from "ethers";

export enum LocalStorage {
  Cookies = "HATS_ACCEPTED_COOKIES",
  WelcomePage = "HATS_HAS_SEEN_WELCOME_PAGE",
  SubmitVulnerability = "HATS_SUBMIT_VULNERABILITY_DATA",
  Airdrop = "HATS_AIRDROP_USER_NOTIFIED",
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
  nft_airdrop = "/nft_airdrop/",
  vault_editor = "/vault-editor",
  airdrop = "/airdrop",
  committee_tools = "/committee-tools"
}

export const Chains = {
  [ChainId.Mainnet]: Mainnet,
  [ChainId.Rinkeby]: Rinkeby
}

export const VaultService = "https://vault-editor-service.herokuapp.com"

export const NFTAirdropAddress = {
  [ChainId.Mainnet]: "0x7AABB77BA782c57209dBe88aFF8beF113f55c05b",
  [ChainId.Rinkeby]: "0x572927d1641Ea6d633fB1EeF030FaB0D07Bf77e4"
}

export const Endpoint = {
  [ChainId.Mainnet]: "https://eth-mainnet.alchemyapi.io/v2/c4ovmC7YsQq1qM0lp6h7Ao9bGX_v4JG-",
  [ChainId.Rinkeby]: "https://eth-rinkeby.alchemyapi.io/v2/E--RBUxi4rWPTatMrBt77VECbird1_w7",
}

export const VaultSubgraphs = {
  [ChainId.Mainnet]: "https://api.thegraph.com/subgraphs/name/hats-finance/hatsmainnetv5",
  [ChainId.Rinkeby]: "https://api.thegraph.com/subgraphs/name/hats-finance/hatsrinkebyv5",
};

export const UNISWAP_V3_SUBGRAPH = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";

export enum Pages {
  vaults = "Vaults",
  gov = "Gov",
  vulnerability = "Submit Vulnerability",
  pools = "Liquidity Pools",
  airdrop = "Airdrop",
}

export const SMALL_SCREEN_BREAKPOINT = "1000px";

export const DefaultBotAddress = "http://localhost:4000/broadcast-message";

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

/** This is used when we need to set colors via the JavaScript */
export enum Colors {
  white = "#FFFFFF",
  red = "#E66480",
  turquoise = "#8AFCFD",
  darkBlue = "#000723",
  yellow = "#F2C94C",
  gray = "#C5C5C5",
  black = "#000000",
  fieldBlue = "#0C1436",
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

const NORMAL_SEVERITIES_COLORS = ["#141F50", "#19265F", "#213173", "#122777"];
const GAMIFICATION_SEVERITIES_COLORS = ["#2A115F", "#3B1B7E", "#4B239F"];

export const VAULTS_TYPE_SEVERITIES_COLORS = {
  "gamification": GAMIFICATION_SEVERITIES_COLORS,
  "normal": NORMAL_SEVERITIES_COLORS,
  "Grants": NORMAL_SEVERITIES_COLORS,
  "": NORMAL_SEVERITIES_COLORS
}
