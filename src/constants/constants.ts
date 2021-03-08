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
  gov = "Gov"
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
 * HATS token address.
 * We assume that this is not going to be changed.
 * This is used to fetch the HATS balance.
 */
export const HATS_TOKEN = "0xed40948654f6fa2c63fe47d547ab33b0e8a84f8a";
