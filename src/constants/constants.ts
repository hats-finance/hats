export enum ScreenSize {
  Small = "SMALL",
  Large = "LARGE"
}

export enum Networks {
  main = "mainnet",
  xdai = "xdai",
  rinkeby = "rinkeby",
  kovan = "kovan"
}

export enum Pages {
  honeypots = "Honeypots",
  gov = "Gov",
  vulnerability = "Submit Vulnerability",
  pools = "Liquidity Pools"
}

/**
 * Corresponds to a transaction receipt status that is received after a transaction on the blockchain occurs
 */
export enum TransactionStatus {
  Fail = 0,
  Success = 1
}

export const SMALL_SCREEN_BREAKPOINT = "770px";

export enum NotificationType {
  Success = "SUCCESS",
  Error = "ERROR",
  Info = "INFO"
}

export const RC_TOOLTIP_OVERLAY_INNER_STYLE = {
  border: "none",
  minHeight: "unset"
}

/**
 * A Liquidity Pool project name starts with this prefix
 */
export const POOL_PREFIX = "Uniswap V2_";
