import { BigNumber } from "ethers";

export enum ScreenSize {
  Mobile = "MOBILE",
  Desktop = "DESKTOP"
}

export enum RoutePaths {
  vaults = "/vaults",
  gov = "/gov",
  vulnerability = "/vulnerability",
  pools = "/pools",
  terms_of_use = "/terms_of_use",
  privacy_policy = "/privacy_policy"
}

export enum Networks {
  main = "mainnet",
  xdai = "xdai",
  rinkeby = "rinkeby",
  kovan = "kovan"
}

export enum MasterAddresses {
  main = "0x571f39d351513146248acafa9d0509319a327c4d",
  rinkeby = "0x7626d5d4d3a3cd2f9bc36e160dd9f8fba39fdad2"
}

export enum Pages {
  vaults = "Vaults",
  gov = "Gov",
  vulnerability = "Submit Vulnerability",
  pools = "Liquidity Pools",
  terms_of_use = "Terms of Use"
}

/**
 * Corresponds to a transaction receipt status that is received after a transaction on the blockchain occurs
 */
export enum TransactionStatus {
  Fail = 0,
  Success = 1,
  Cancelled = 2
}

export const SMALL_SCREEN_BREAKPOINT = "770px";

export const DEFUALT_NOTIFICATION_DISPLAY_TIME = 10000;

/** The maximum amount to allow spending from the user wallet in BigNumber */
export const MAX_SPENDING = BigNumber.from(2).pow(BigNumber.from(96)).sub(BigNumber.from(1));

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
}

export const DEFAULT_ERROR_MESSAGE = "OOPS! SOMETHING WENT WRONG";

export const IPFS_PREFIX = "https://hats-finance.mypinata.cloud/ipfs/"

export const DEFAULT_RINKEBY_SUBGRAPH_URI = "https://api.thegraph.com/subgraphs/name/hats-finance/hats_rinkeby_v4";

export const HATS_WEBSITE = "https://hats.finance";

export const COOKIES_POLICY = "https://docs.hats.finance/cookies-policy";

export const PRIVACY_POLICY = "https://docs.hats.finance/privacy-policy";

/** This is used when we need to set colors via the JavaScript */
export enum Colors {
  white = "#FFFFFF",
  red = "#E66480",
  turquoise = "#8AFCFD",
  darkBlue = "#000723",
  yellow = "#F2C94C"
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


export const DEFAULT_VULNERABILITY_STRUCTURE = `
#  Vulnerability Report

## Description

<!-- A clear and concise description of the problem... --> 


##  Minimal Reproduction

<!--Please let us know how we can reproduce this issue. Include the exact method you used to do it.-->

##  Error


<!-- If the issue is accompanied by an error, please share the error logs with us below. If you have a lot of logs, place make a paste bin with your logs and share the link with us here: -->
<!-- -->


##   Your Environment

Operating System:

<pre>
  <code>

  </code>
</pre>

Anything else relevant ?
`
