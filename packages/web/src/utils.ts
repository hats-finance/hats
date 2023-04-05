import millify from "millify";
import { BigNumber } from "ethers";
import { isAddress, getAddress, formatUnits } from "ethers/lib/utils";
import { BASE_SERVICE_URL } from "settings";
import { IVulnerabilityData } from "pages/VulnerabilityFormPage/types";
import { VULNERABILITY_INIT_DATA } from "pages/VulnerabilityFormPage/store";
import { ScreenSize, SMALL_SCREEN_BREAKPOINT, IPFS_PREFIX, LocalStorage } from "constants/constants";

/**
 * Adds commas to a given number
 * @param {number} number
 */
export const numberWithCommas = (number: number): string => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

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
 * Formats a WEI value.
 * If the value is null/undefined, the function returns "-"
 * If the value is too small to be represented by the given precision, the function returns "+0".
 * @param {string | number | BigNumber | undefined} value
 * @param {number} precision
 * @param {string} decimals
 */
export const formatWei = (value: string | number | BigNumber | undefined, precision = 1, decimals = "18"): string => {
  if (!value) {
    return "-";
  }

  if (typeof value === "number") {
    value = value.toString();
  }

  const formattedValue = millify(Number(formatUnits(String(value), decimals)), {
    precision: precision,
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
      (navigator.userAgent || navigator.vendor || (window as any).opera).substr(0, 4)
    )
  );
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
 * Used to set the current project which the user selects from the vaults lists to submit a vulnerability
 * @param {string} projectName
 * @param {string} projectId
 */
export const setVulnerabilityProject = (projectName: string, projectId: string, contractAddress: string) => {
  let cachedData: IVulnerabilityData = JSON.parse(
    localStorage.getItem(LocalStorage.SubmitVulnerability) || JSON.stringify(VULNERABILITY_INIT_DATA)
  );

  if (cachedData.version !== getAppVersion()) {
    cachedData = VULNERABILITY_INIT_DATA;
  }

  cachedData.project = {
    verified: true,
    projectName: projectName,
    projectId: projectId,
    contractAddress: contractAddress,
  };
  localStorage.setItem(LocalStorage.SubmitVulnerability, JSON.stringify(cachedData));
};

/**
 * Throws an error if the master address is not as provided in the env var or as the defualt one when running locally.
 * @param {string} masterAddress
 */

/**
 * Normalize any supported address-format to a checksum address.
 * @param {string} address
 */
export const normalizeAddress = (address: string) => {
  if (isAddress(address)) {
    return getAddress(address);
  }
  return "";
};

export const ipfsTransformUri = (uri: string | undefined, { isPinned } = { isPinned: true }) => {
  if (!uri || typeof uri !== "string") return "";

  const ipfsPrefix = isPinned ? IPFS_PREFIX : `${BASE_SERVICE_URL}/files`;

  if (uri.startsWith("ipfs")) {
    let ipfs;
    if (uri.startsWith("ipfs://ipfs/")) {
      ipfs = uri.slice(12);
    } else if (uri.startsWith("ipfs/")) {
      ipfs = uri.slice(5);
    } else if (uri.startsWith("ipfs://")) {
      ipfs = uri.slice(7);
    }
    return `${ipfsPrefix}/${ipfs}`;
  } else if (uri.startsWith("http")) {
    return uri;
  } else if (uri.startsWith("blob")) {
    return uri;
  }
  return `${ipfsPrefix}/${uri}`;
};

export const formatAPY = (apy: number | undefined): string => {
  return apy ? `${apy.toFixed(2)}%` : "-";
};
