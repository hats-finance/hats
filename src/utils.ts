import { Networks } from "./constants/constants";
import { ScreenSize, SMALL_SCREEN_BREAKPOINT } from "./constants/constants";
import { getDefaultProvider } from "@ethersproject/providers";
import { BigNumber, ethers } from "ethers";

/**
 * Adds commas to a given number
 * @param {number} number
 */
export const numberWithCommas = (number: number): string => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Truncate an address with ellipsis dots in the middle
 * @param {string} address
 */
export const truncatedAddress = (address: string): string => {
  if (address.length < 10) {
    return address;
  }
  return address.substr(0, 6) + "..." + address.substr(address.length - 4);
};

/**
 * Returns network name by it's chainId
 * @param {string} chainId
 */
export const getNetworkNameByChainId = (chainId: string): Networks | string => {
  switch (chainId) {
    case "0x1":
    case "1":
      return Networks.main;
    case "100":
    case "0x64":
      return Networks.xdai;
    case "4":
    case "0x4":
      return Networks.rinkeby;
    case "0x2a":
    case "42":
      return Networks.kovan;
    default:
      return `unsupported network: ${chainId}`;
  }
}

/**
 * Returns "LARGE" if the screen width larger than SMALL_SCREEN_BREAKPOINT, otherwise returens "SMALL"
 * @returns {ScreenSize}
 */
export const getScreenSize = () => {
  return window.matchMedia(`(min-width: ${SMALL_SCREEN_BREAKPOINT})`).matches ? ScreenSize.Large : ScreenSize.Small;
};

/**
 * Given the current URL returns the main path
 * @param {string} path
 */
export const getMainPath = (path: string) => {
  return path.split("/")[1];
};

/**
 * Given network and account address returns the ether balance
 * @param {Networks} network
 * @param {string} selectedAddress
 */
export const getEtherBalance = async (network: Networks, selectedAddress: string) => {
  try {
    const defaultProvider = getDefaultProvider(network);
    const balance = await defaultProvider.getBalance(selectedAddress);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Given amount in WEI returns the formatted amount
 * @param {BigNumber | string} wei
 */
export const fromWei = (wei: BigNumber | string): string => {
  return ethers.utils.formatEther(wei);
}

/**
 * Given amount in string returns (ethers) BigNumber
 * @param {string} value
 */
export const toWei = (value: string): BigNumber => {
  return ethers.utils.parseEther(value);
}

/**
 * Checks whether the value includes digits only [dot (.) allowed]
 * @param {string} value
 */
export const isDigitsOnly = (value: string): boolean => {
  return /^-?\d*[.,]?\d{0,2}$/.test(value);
}

/**
 * 
 * @param obj
 */
export const isEmptyObject = (obj: any): boolean => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}
