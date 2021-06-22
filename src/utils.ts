import { Networks } from "./constants/constants";
import { ScreenSize, SMALL_SCREEN_BREAKPOINT } from "./constants/constants";
import { getDefaultProvider } from "@ethersproject/providers";
import { BigNumber, ethers } from "ethers";
import { Dispatch } from "redux";
import { updateWalletBalance } from "./actions";
import { getBlockNumber, getTokenBalance } from "./actions/contractsActions";
import axios from "axios";
import { IVault, IWithdrawSafetyPeriod } from "./types/types";
import { NETWORK } from "./settings";

/**
 * Returns true if there is a valid provider and connected to the right network, otherwise returns false
 * @param {any} proivder
 * @returns {boolean}
 */
export const isProviderAndNetwork = (proivder: any) => {
  if (proivder && proivder.chainId) {
    const network = getNetworkNameByChainId(proivder.chainId);
    if (network === NETWORK) {
      return true;
    }
  }
  return false;
}

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
  return window.matchMedia(`(min-width: ${SMALL_SCREEN_BREAKPOINT})`).matches ? ScreenSize.Desktop : ScreenSize.Mobile;
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
 * Updates the ETH and HATS wallet balance
 * @param {Dispatch} dispatch 
 * @param {Networks} network 
 * @param {string} selectedAddress
 * @param {string} rewardsToken 
 */
export const fetchWalletBalance = async (dispatch: Dispatch, network: any, selectedAddress: string, rewardsToken: string) => {
  dispatch(updateWalletBalance(null, null));
  dispatch(updateWalletBalance(await getEtherBalance(network, selectedAddress), await getTokenBalance(rewardsToken, selectedAddress)));
}

// TODO: merge getTokenPrice and getTokenMarketCap to one function

/**
 * Gets token price in USD using CoinGecko API
 * @param {string} tokenAddress
 */
export const getTokenPrice = async (tokenAddress: string) => {
  try {
    const data = await axios.get(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`);
    return data.data[Object.keys(data.data)[0]].usd;

  } catch (err) {
    console.error(err);
  }
}

/**
 * Gets token market cap in USD using CoinGecko API
 * @param {string} tokenAddress
 */
export const getTokenMarketCap = async (tokenAddress: string) => {
  try {
    const data = await axios.get(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd&include_market_cap=true`);
    return data.data[Object.keys(data.data)[0]].usd_market_cap;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Calculates the APY for a given vault
 * @param {IVault} vault
 * @param {number} hatsPrice
 */
export const calculateApy = async (vault: IVault, hatsPrice: number) => {
  // TODO: Should be staking token - e.g. vault.stakingToken
  // TODO: If the divdier is 0 so we get NaN and then it shows "-". Need to decide if it's okay or show 0 in this case.
  if (Number(fromWei(vault.totalStaking)) === 0) {
    return 0;
  }
  return Number(fromWei(vault.totalRewardPaid)) * Number(hatsPrice) / Number(fromWei(vault.totalStaking)) * await getTokenPrice("0x543Ff227F64Aa17eA132Bf9886cAb5DB55DCAddf");
}

/**
 * Wait milliseconds - usage with 'await'
 * @param {number} ms
 */
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Gets the webapp version from the package.json
 */
export const getAppVersion = (): string => {
  const packageJson = require("../package.json");
  return packageJson.version;
}

/**
 * Copies a given string to the clipboard
 * @param {string} value
 */
export const copyToClipboard = (value: string) => {
  const tempInputElement = document.createElement("textarea");
  tempInputElement.value = value;
  document.body.appendChild(tempInputElement);
  tempInputElement.select();
  document.execCommand("copy");
  document.body.removeChild(tempInputElement);
}

/**
 * Given address and network returns the Etherscan link
 * @param {string} address
 * @param {Networks} network 
 */
export const linkToEtherscan = (address: string, network: Networks): string => {
  const prefix = network !== Networks.main ? `${network}.` : "";
  return `https://${prefix}etherscan.io/address/${address}`;
}

/**
 * Given withdrawPeriod and safetyPeriod returns wheter 
 * @param {string} withdrawPeriod
 * @param {string} safetyPeriod
 */
export const getWithdrawSafetyPeriod = async (withdrawPeriod: string, safetyPeriod: string) => {
  const withdrawSafetyPeriod: IWithdrawSafetyPeriod = {
    isSafetyPeriod: true,
    timeLeftForSaftety: 0
  }
  const currentBlockNumber = await getBlockNumber();
  if (currentBlockNumber) {
    const blocksLeftForSafety = (currentBlockNumber % (Number(withdrawPeriod) + Number(safetyPeriod))) + (Number(safetyPeriod) - Number((withdrawPeriod)));
    withdrawSafetyPeriod.isSafetyPeriod = currentBlockNumber % (Number(withdrawPeriod) + Number(safetyPeriod)) >= Number(withdrawPeriod);
    withdrawSafetyPeriod.timeLeftForSaftety = blocksLeftForSafety * 15;
    return withdrawSafetyPeriod;
  }
  return withdrawSafetyPeriod;
}
