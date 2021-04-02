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
  vulnerability = "Submit vulnerability",
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

/**
 * HATS token address (rinkeby)
 * We assume that this is not going to be changed.
 * This is used to fetch the HATS balance.
 */
export const HATS_TOKEN = "0x575E7013032DEE076ED34324266c3912E787791C";

export enum NotificationType {
  Success = "SUCCESS",
  Error = "ERROR",
  Info = "INFO"
}
