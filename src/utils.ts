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
 * @param {string} decimals
 */
export const fromWei = (wei: BigNumber | string, decimals = "18"): string => {
  return ethers.utils.formatUnits(wei, decimals);
}

/**
 * Given amount in string returns (ethers) BigNumber
 * @param {string} value
 * @param {string} decimals
 */
export const toWei = (value: string, decimals = "18"): BigNumber => {
  return ethers.utils.parseUnits(value, decimals);
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
export const fetchWalletBalance = async (dispatch: Dispatch, network: any, selectedAddress: string, rewardsToken: string, decimals: string) => {
  dispatch(updateWalletBalance(null, null));
  dispatch(updateWalletBalance(await getEtherBalance(network, selectedAddress), await getTokenBalance(rewardsToken, selectedAddress, decimals)));
}

// TODO: merge getTokenPrice and getTokenMarketCap to one function

/**
 * Gets token price in USD using CoinGecko API
 * @param {string} tokenAddress
 */
export const getTokenPrice = async (tokenAddress: string) => {
  try {
    const data = await axios.get(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`);
    return data.data[Object.keys(data.data)[0]]?.usd;

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
    return data.data[Object.keys(data.data)[0]]?.usd_market_cap;
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
  // TODO: If the divdier is 0 so we get NaN and then it shows "-". Need to decide if it's okay or show 0 in this case.
  if (Number(fromWei(vault.totalStaking)) === 0) {
    return 0;
  }
  return Number(fromWei(vault.totalRewardPaid)) * Number(hatsPrice) / Number(fromWei(vault.totalStaking)) * await getTokenPrice(vault.stakingToken);
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
 * Given a value of address or transaction and network returns the Etherscan link
 * @param {string} value
 * @param {Networks} network
 * @param {boolean} isTransaction
 */
export const linkToEtherscan = (value: string, network: Networks, isTransaction?: boolean): string => {
  const prefix = network !== Networks.main ? `${network}.` : "";
  return `https://${prefix}etherscan.io/${isTransaction ? "tx" : "address"}/${value}`;
}

/**
 * Given withdrawPeriod and safetyPeriod returns if safty period is in progress and the amount of seconds until we switch.
 * Negative number of seconds means when safty period starts, and positive number means when it ends.
 * @param {string} withdrawPeriod
 * @param {string} safetyPeriod
 * @returns {IWithdrawSafetyPeriod}
 */
export const getWithdrawSafetyPeriod = async (withdrawPeriod: string, safetyPeriod: string) => {
  const withdrawSafetyPeriod: IWithdrawSafetyPeriod = {
    isSafetyPeriod: true,
    timeLeftForSafety: 0
  }
  const currentBlockNumber = await getBlockNumber();
  if (currentBlockNumber) {
    const blocksLeftForSafety = (currentBlockNumber % (Number(withdrawPeriod) + Number(safetyPeriod))) + (Number(safetyPeriod) - Number((withdrawPeriod)));
    withdrawSafetyPeriod.isSafetyPeriod = currentBlockNumber % (Number(withdrawPeriod) + Number(safetyPeriod)) >= Number(withdrawPeriod);
    withdrawSafetyPeriod.timeLeftForSafety = blocksLeftForSafety * 15;
    return withdrawSafetyPeriod;
  }
  return withdrawSafetyPeriod;
}

/**
 * Checks whether it's a mobile device
 * @returns {boolean}
 */
export const isMobile = (): boolean => {
  return (
    // eslint-disable-next-line
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      navigator.userAgent || navigator.vendor || (window as any).opera,
    ) || // eslint-disable-next-line
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      (navigator.userAgent || navigator.vendor || (window as any).opera).substr(0, 4),
    )
  );
};
