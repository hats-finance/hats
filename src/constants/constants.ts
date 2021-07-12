export enum ScreenSize {
  Mobile = "MOBILE",
  Desktop = "DESKTOP"
}

export enum RoutePaths {
  vaults = "/vaults",
  gov = "/gov",
  vulnerability = "/vulnerability",
  pools = "/pools",
  terms_of_service = "/terms_of_service",
  privacy_policy = "/privacy_policy"
}

export enum Networks {
  main = "mainnet",
  xdai = "xdai",
  rinkeby = "rinkeby",
  kovan = "kovan"
}

export enum Pages {
  vaults = "Vaults",
  gov = "Gov",
  vulnerability = "Submit Vulnerability",
  pools = "Liquidity Pools",
  terms_of_service = "Terms of Service",
  privacy_policy = "Privacy and Cookies Policy"
}

/**
 * Corresponds to a transaction receipt status that is received after a transaction on the blockchain occurs
 */
export enum TransactionStatus {
  Fail = 0,
  Success = 1
}

export const SMALL_SCREEN_BREAKPOINT = "770px";

export const DEFUALT_NOTIFICATION_DISPLAY_TIME = 10000;

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

export const IPFS_PREFIX = "https://ipfs.io/ipfs/";

/** This is used when we need to set colors via the JavaScript */
export enum Colors {
  white = "#FFFFFF",
  red = "#E66480",
  turquoise = "#8AFCFD",
  darkBlue = "#000723",
  yellow = "#F2C94C"
}
