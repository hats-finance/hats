import { utils } from "ethers";
import { isAddress as isAddressEthers } from "ethers/lib/utils";

export const isAddress = isAddressEthers;

export const shortenIfAddress = (address?: string): string => {
  if (typeof address === "string" && address.length > 0) {
    return shortenAddress(address);
  }
  return "";
};

export const shortenAddress = (address: string): string => {
  try {
    const str = utils.getAddress(address);
    return str.substring(0, 4) + "..." + str.substring(str.length - 4);
  } catch {
    throw new TypeError("Invalid input, address can't be parsed");
  }
};
