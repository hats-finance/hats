import { utils } from "ethers";

export const shortenIfAddress = (address?: string): string => {
  if (typeof address === "string" && address.length > 0) {
    return shortenAddress(address);
  }
  return "";
};

export const shortenAddress = (address: string): string => {
  try {
    const str = utils.getAddress(address);
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  } catch {
    throw new TypeError("Invalid input, address can't be parsed");
  }
};
