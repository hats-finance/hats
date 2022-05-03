import { IPFS_PREFIX, LocalStorage, Networks } from "./constants/constants";
import {
  ScreenSize,
  SMALL_SCREEN_BREAKPOINT,
  COIN_GECKO_ETHEREUM
} from "./constants/constants";
import { getDefaultProvider } from "@ethersproject/providers";
import { BigNumber, ethers } from "ethers";
import { isAddress, getAddress } from "ethers/lib/utils";
import { Dispatch } from "redux";
import { updateWalletBalance } from "./actions";
import { getTokenBalance } from "./actions/contractsActions";
import axios from "axios";
import { IParentVault, IWithdrawSafetyPeriod } from "./types/types";
import { MASTER_ADDRESS, NETWORK } from "./settings";
import moment from "moment";
import { VULNERABILITY_INIT_DATA } from "./components/Vulnerability/VulnerabilityAccordion";
import millify from "millify";
import { IVulnerabilityData } from "./components/Vulnerability/types";

/**
 * Returns true if an Ethereum Provider is detected, otherwise returns false.
 * @returns {boolean}
 */
export const isEthereumProvider = () => {
  if (window.ethereum === undefined) {
    return false;
  }
  return true;
}

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
};

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
};

/**
 * Returns "LARGE" if the screen width larger than SMALL_SCREEN_BREAKPOINT, otherwise returens "SMALL"
 * @returns {ScreenSize}
 */
export const getScreenSize = () => {
  return window.matchMedia(`(min-width: ${SMALL_SCREEN_BREAKPOINT})`).matches
    ? ScreenSize.Desktop
    : ScreenSize.Mobile;
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
export const getEtherBalance = async (
  network: Networks,
  selectedAddress: string
) => {
  try {
    const defaultProvider = getDefaultProvider(network);
    const balance = await defaultProvider.getBalance(selectedAddress);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Given amount in WEI returns the formatted amount
 * @param {BigNumber | string} wei
 * @param {string} decimals
 */
export const fromWei = (wei: BigNumber | string, decimals = "18"): string => {
  return ethers.utils.formatUnits(wei, decimals);
};

/**
 * Given amount in string returns (ethers) BigNumber
 * @param {string} value
 * @param {string} decimals
 */
export const toWei = (value: string, decimals = "18"): BigNumber => {
  return ethers.utils.parseUnits(value, decimals);
};

/**
 * Formats a WEI value.
 * If the value is null/undefined, the function returns "-"
 * If the value is too small to be represented by the given precision, the function returns "+0".
 * @param {string | number | BigNumber | undefined} value
 * @param {number} precision
 * @param {string} decimals
 */
export const formatWei = (
  value: string | number | BigNumber | undefined,
  precision = 1,
  decimals = "18"
): string => {
  if (!value) {
    return "-";
  }

  if (typeof value === "number") {
    value = value.toString();
  }

  const formattedValue = millify(Number(fromWei(String(value), decimals)), {
    precision: precision
  });

  if (typeof value === "string") {
    if (value !== "0" && formattedValue === "0") {
      return "+0";
    }
  } else {
    // value is BigNumber
    if (value.gt(0) && formattedValue === "0") {
      return "+0";
    }
  }

  return formattedValue;
};

/**
 * Formats a number value
 * If the value is null/undefined, the function returns "-"
 * @param {string | number} value
 * @param {number} precision
 */
export const formatNumber = (value: string | number | undefined, precision = 1): string => {
  return !value ? "-" : millify(Number(value), { precision: precision });
};

/**
 * Checks whether the value includes digits only [dot (.) allowed]
 * @param {string} value
 */
export const isDigitsOnly = (value: string): boolean => {
  return /^-?\d*[.,]?\d{0,2}$/.test(value);
};

/**
 * Updates the ETH and HATS wallet balance
 * @param {Dispatch} dispatch
 * @param {Networks} network
 * @param {string} selectedAddress
 * @param {string} rewardsToken
 */
export const fetchWalletBalance = async (
  dispatch: Dispatch,
  network: any,
  selectedAddress: string,
  rewardsToken: string
) => {
  dispatch(updateWalletBalance(null, null));
  dispatch(
    updateWalletBalance(
      await getEtherBalance(network, selectedAddress),
      await getTokenBalance(rewardsToken, selectedAddress)
    )
  );
};

/**
 * Gets token price in USD using CoinGecko API
 * @param {string} tokenAddress
 */
export const getTokenPrice = async (tokenAddress: string) => {
  try {
    const data = await axios.get(`${COIN_GECKO_ETHEREUM}?contract_addresses=${tokenAddress}&vs_currencies=usd`);
    return data.data[Object.keys(data.data)[0]]?.usd;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Gets tokens prices in USD using CoinGecko API
 * @param {string[]} tokensAddresses
 * @returns the prices for each given token
 */
export const getTokensPrices = async (tokensAddresses: string[]) => {
  try {
    const data = await axios.get(`${COIN_GECKO_ETHEREUM}?contract_addresses=${tokensAddresses.join(",")}&vs_currencies=usd`);
    return data.data;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Gets token market cap in USD using CoinGecko API
 * @param {string} tokenAddress
 */
export const getTokenMarketCap = async (tokenAddress: string) => {
  try {
    const data = await axios.get(
      `${COIN_GECKO_ETHEREUM}?contract_addresses=${tokenAddress}&vs_currencies=usd&include_market_cap=true`
    );
    return data.data[Object.keys(data.data)[0]]?.usd_market_cap;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Calculates the APY for a given vault
 * @param {IVault} vault
 * @param {number} hatsPrice
 */
export const calculateApy = async (vault: IParentVault, hatsPrice: number, tokenPrice: number) => {
  // TODO: If the divdier is 0 so we get NaN and then it shows "-". Need to decide if it's okay or show 0 in this case.
  if (Number(fromWei(vault.totalStaking)) === 0 || !tokenPrice) {
    return 0;
  }
  return (((Number(fromWei(vault.totalRewardPaid)) * Number(hatsPrice)) / Number(fromWei(vault.totalStaking))) * tokenPrice);
};

/**
 * Wait milliseconds - usage with 'await'
 * @param {number} ms
 */
export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * Gets the webapp version from the package.json
 */
export const getAppVersion = (): string => {
  const packageJson = require("../package.json");
  return packageJson.version;
};

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
};

/**
 * Given a value of address or transaction and network returns the Etherscan link
 * @param {string} value
 * @param {Networks} network
 * @param {boolean} isTransaction
 */
export const linkToEtherscan = (
  value: string,
  network: Networks,
  isTransaction?: boolean
): string => {
  const prefix = network !== Networks.main ? `${network}.` : "";
  return `https://${prefix}etherscan.io/${isTransaction ? "tx" : "address"}/${value}`;
};

/**
 * Given an address and a tokenID returns the Etherscan link
 * @param {string} address
 * @param {string} tokenID
 * @param {Networks} network
 */
export const linkToTokenEtherscan = (address: string, tokenID: string, network = NETWORK): string => {
  const prefix = network !== Networks.main ? `${network}.` : "";
  return `https://${prefix}etherscan.io/token/${address}?a=${tokenID}`;
}

/**
 * Given withdrawPeriod and safetyPeriod returns if safty period is in progress and when the safty starts or ends.
 * @param {string} withdrawPeriod
 * @param {string} safetyPeriod
 * @returns {IWithdrawSafetyPeriod}
 */
export const getWithdrawSafetyPeriod = (
  withdrawPeriod: string,
  safetyPeriod: string
) => {
  const withdrawSafetyPeriod: IWithdrawSafetyPeriod = {
    isSafetyPeriod: false,
    saftyEndsAt: 0,
    saftyStartsAt: 0
  };
  const currentTimestamp = moment().unix();
  const sum = Number(withdrawPeriod) + Number(safetyPeriod);
  withdrawSafetyPeriod.saftyEndsAt =
    sum * Math.floor(currentTimestamp / sum) + sum;
  withdrawSafetyPeriod.saftyStartsAt =
    sum * Math.floor(currentTimestamp / sum) + Number(withdrawPeriod);
  withdrawSafetyPeriod.isSafetyPeriod =
    currentTimestamp >= withdrawSafetyPeriod.saftyStartsAt;
  return withdrawSafetyPeriod;
};

/**
 * Checks whether it's a mobile device
 * @returns {boolean}
 */
export const isMobile = (): boolean => {
  return (
    // eslint-disable-next-line
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
      navigator.userAgent || navigator.vendor || (window as any).opera
    ) || // eslint-disable-next-line
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      (navigator.userAgent || navigator.vendor || (window as any).opera).substr(
        0,
        4
      )
    )
  );
};

/**
 * Calculates how much available to withdraw considring the userShares, poolBalance and totalUsersShares
 * @param {string} userShares
 * @param {string} poolBalance
 * @param {string} totalUsersShares
 */
export const calculateAmountAvailableToWithdraw = (
  userShares: string,
  poolBalance: string,
  totalUsersShares: string
) => {
  return BigNumber.from(userShares)
    .mul(BigNumber.from(poolBalance))
    .div(BigNumber.from(totalUsersShares));
};

/**
 * Calculates the value we send to the contract when a user wants to withdraw
 * @param {BigNumber} amountAvailableToWithdraw
 * @param {string} userInput The actual number the user insterted
 * @param {BigNumber} userShares
 * @param {string} decimals
 */
export const calculateActualWithdrawValue = (
  amountAvailableToWithdraw: BigNumber,
  userInput: string,
  userShares: BigNumber,
  decimals: string
) => {
  return toWei(userInput, decimals)
    .mul(userShares)
    .div(amountAvailableToWithdraw)
    .toString();
};

/**
 * Given a link string returns it's extension
 * @param {string} link
 */
export const getLinkExtension = (link: string): string => {
  const reg = /(?:\.([^.]+))?$/;
  return reg.exec(link)?.[1] ?? "";
};

/**
 * Converts a JavaScript Object Notation (JSON) string into an object
 * @param {string} dataString
 */
export const parseJSONToObject = (dataString: string) => {
  try {
    return JSON.parse(dataString);
  } catch (error) {
    // In case the given string is an invalid JSON.
    console.error(error);
  }
};

/**
 * Calculates the reward price in USD for given vault and it's rewardPercentage
 * @param {number} rewardPercentage
 * @param {number} tokenPrice
 * @param {string} honeyPotBalance
 * @param {string} stakingTokenDecimals
 */
export const calculateRewardPrice = (rewardPercentage: number, tokenPrice: number, honeyPotBalance: string, stakingTokenDecimals: string) => {
  if (tokenPrice) {
    return (Number(fromWei(honeyPotBalance, stakingTokenDecimals)) * (rewardPercentage / 100) * tokenPrice);
  }
  return undefined;
};

/**
 * Used to set the current project which the user selects from the vaults lists to submit a vulnerability
 * @param {string} projectName
 * @param {string} projectId
 */
export const setVulnerabilityProject = (projectName: string, projectId: string) => {
  let cachedData: IVulnerabilityData = JSON.parse(localStorage.getItem(LocalStorage.SubmitVulnerability) || JSON.stringify(VULNERABILITY_INIT_DATA));

  if (cachedData.version !== getAppVersion()) {
    cachedData = VULNERABILITY_INIT_DATA;
  }

  cachedData.project = {
    verified: true,
    projectName: projectName,
    projectId: projectId
  }
  localStorage.setItem(LocalStorage.SubmitVulnerability, JSON.stringify(cachedData));
}

/**
 * Throws an error if the master address is not as provided in the env var or as the defualt one when running locally.
 * @param {string} masterAddress
 */
export const checkMasterAddress = (masterAddress: string) => {
  if (masterAddress !== MASTER_ADDRESS) {
    throw new Error("Master address does not match!");
  }
}

/**
 * Normalize any supported address-format to a checksum address.
 * @param {string} address
 */
export const normalizeAddress = (address: string) => {
  if (isAddress(address)) {
    return getAddress(address);
  }
  return "";
}

/**
 * Checks whether a given date (in unix time) has passed.
 * @param {number | string} value
 */
export const isDateBefore = (value: number | string): boolean => {
  return moment().isBefore(moment.unix(Number(value)));
}

/**
 * Get safes for a given weallet from gnosis safe api
 * @param {string} walletAddress
 */
export const getSafesOwnedBy = async (walletAddress: string) => {
  let api
  switch (NETWORK) {
    case Networks.main: api = "https://safe-transaction.gnosis.io/api/v1"; break;
    case Networks.rinkeby: api = "https://safe-transaction.rinkeby.gnosis.io/api/v1"; break;
  }
  const response = await fetch(`${api}?/owners/${walletAddress}/safes/`);
  return await response.json();
}

export const ipfsTransformUri = (uri: string) => {
  if (!uri) {
    return;
  } else if (uri.startsWith("ipfs")) {
    let ipfs;
    if (uri.startsWith("ipfs/")) {
      ipfs = uri.slice(5);
    } else if (uri.startsWith("ipfs://")) {
      ipfs = uri.slice(7);
    }
    return `${IPFS_PREFIX}${ipfs}`;
  } else if (uri.startsWith("http")) {
    return uri;
  } else if (uri.startsWith("blob")) {
    return uri;
  }
  return `${IPFS_PREFIX}/${uri}`;
}
