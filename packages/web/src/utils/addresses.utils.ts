import { utils } from "ethers";
import { getAddress, isAddress as isAddressEthers } from "ethers/lib/utils";

type ShortenOptions = {
  startLength?: number;
  endLength?: number;
};

export const isAddress = isAddressEthers;

export const shortenIfAddress = (address?: string, opts?: ShortenOptions): string => {
  try {
    if (typeof address === "string" && address.length > 0) {
      return shortenAddress(address, opts);
    }
    return "";
  } catch (error) {
    return "";
  }
};

export const shortenAddress = (address: string, opts?: ShortenOptions): string => {
  const startLength = opts?.startLength || 4;
  const endLength = opts?.endLength || 4;

  try {
    const str = utils.getAddress(address);
    return str.substring(0, startLength) + "..." + str.substring(str.length - endLength);
  } catch {
    throw new TypeError("Invalid input, address can't be parsed");
  }
};

export const normalizeAddress = (address: string) => {
  if (isAddress(address)) {
    return getAddress(address);
  }
  return "";
};
