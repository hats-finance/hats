import { BigNumber } from "ethers";

export enum LocalStorage {
  Cookies = "HATS_ACCEPTED_COOKIES",
  WelcomePage = "HATS_HAS_SEEN_WELCOME_PAGE",
  EmbassyNotification = "HATS_HAS_SEEN_EMBASSY_NOTIFICATION",
  SubmitVulnerability = "HATS_SUBMIT_VULNERABILITY_DATA",
  Keystore = "HATS_PGP_KEYSTORE",
  ShowedWhereverCTA = "HATS_SHOWED_WHEREVER_CTA",
  Submissions = "HATS_SUBMISSIONS",
  SelectedSubmissions = "HATS_USER_SELECTED_SUBMISSIONS",
  CoingeckoPrices = "HATS_COINGECKO_PRICES",
}

export enum EncryptedStorage {
  KeystorePassword = "HATS_PGP_KEYSTORE_PASSWORD",
}

export enum ScreenSize {
  Mobile = "MOBILE",
  Desktop = "DESKTOP",
}

export const MAX_NFT_TIER = 3;

// export const stagingServiceUrl = "https://rl848xdj4k.execute-api.us-east-1.amazonaws.com/staging";
export const stagingServiceUrl = "https://hats-backend-dev.herokuapp.com/v1";
export const prodServiceUrl = "https://hats-backend-prod.herokuapp.com/v1";

export const auditWizardVerifyService = "https://app.auditwizard.io:5000/submissions/finalizeHats";

export const NFTContractDataProxy = {
  ["0xCCaadc293FaAEa229e0ca4A22B0330b65634b483".toLowerCase()]: "0x1d25bf3d0f8997282055a1a242fa2b146e7b4ec5",
  ["0x571f39d351513146248AcafA9D0509319A327C4D".toLowerCase()]: "0xe127be2bc276142039bc16251bb04e15b2b34f25",
  "0x18a82fd0e4f64f0f3be455319c8609771e49d58f": "0x63CACDa852A1Efc63Dc7988750d9e1BA77c5FB68",
  ["0xbf5A12c4dD49f81cF5827290Ac9d94470C0E7759".toLowerCase()]: "0x5E32BF5A465A881E217Ef816506D7ecddB53F48F",
};

export const SMALL_SCREEN_BREAKPOINT = "1100px";

export const DEFUALT_NOTIFICATION_DISPLAY_TIME = 10000;

/**  The maximum amount to allow spending from the user wallet in BigNumber */
export const MAX_SPENDING = BigNumber.from(2).pow(BigNumber.from(96)).sub(BigNumber.from(1));

/** The minimum amount to deposit in WEI units */
export const MINIMUM_DEPOSIT = 1000000;

export const RC_TOOLTIP_OVERLAY_INNER_STYLE = {
  minHeight: "unset",
  maxWidth: "480px",
  color: "var(--white)",
  background: "var(--purple-blue)",
  border: "1px solid var(--field-blue)",
};

export const DEFAULT_ERROR_MESSAGE = "OOPS! SOMETHING WENT WRONG";

export const IPFS_PREFIX = "https://ipfs2.hats.finance/ipfs";

export const HATS_WEBSITE = "https://hats.finance";

export const DOCS = "https://docs.hats.finance/";

export const TERMS_OF_USE = "https://docs.hats.finance/terms-of-use-1";

export const RISK_FACTOR = "https://docs.hats.finance/risk-factor";

export const COOKIES_POLICY = "https://docs.hats.finance/cookies-policy";

export const TERMS_OF_SALE_OF_NFTS = "https://docs.hats.finance/nft/terms-of-sale-of-nfts";

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
  // New colors
  primary = "#614fda",
  primarylight = "#2d3271",
  secondary = "#24e8c5",
  secondaryLight = "#74baae",
  background = "#0e0e18",
  background1 = "#0b0b23",
  background2 = "#151731",
  background3 = "#22233e",
}

export enum SocialLinks {
  Discord = "https://discord.gg/xDphwRGyW7",
  Twitter = "https://twitter.com/HatsFinance",
  GitHub = "https://github.com/hats-finance",
  Medium = "https://medium.com/@HatsFinance",
  Telegram = "https://t.me/joinchat/QKP3HcdosVhjOTY0",
}

export const GOV_DISCORD_LINK = "https://discord.gg/McjYd9bd";
export const DISCORD_ENTRY_CHANNEL = "https://discord.com/channels/810534320040837121/976144633899925504";

export enum Transactions {
  Approve = "Approve",
  Deposit = "Deposit",
  WithdrawAndClaim = "Withdraw and Claim",
  WithdrawRequest = "Withdraw Request",
  Claim = "Claim",
  ClaimReward = "Claim Reward",
  CheckIn = "Check In",
  AddPool = "Add Pool",
  RedeemTreeNFTs = "Redeem Tree NFTs",
  RedeemDepositNFTs = "Redeem Deposit NFTs",
}

export const HAT_TOKEN_ADDRESS_V1 = "0x436cA314A2e6FfDE52ba789b257b51DaCE778F1a";
export const HAT_TOKEN_DECIMALS_V1 = "18";
export const HAT_TOKEN_SYMBOL_V1 = "HAT";
