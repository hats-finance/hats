import { useCall } from "@usedapp/core";
import { GoodDollarContractAddress } from "constants/constants";
import { Contract } from "ethers";
import GoodDollar from "data/abis/GoodDollar.json";
import { formatUnits } from "@ethersproject/units";

export const useGoodDollarPrice = () => {
  const { value, error } =
    useCall({
      contract: new Contract(GoodDollarContractAddress, GoodDollar),
      method: "currentPriceDAI",
      args: []
    }) ?? {};
  if (error) {
    return undefined;
  }
  console.log("value", value);
  return value ? Number(formatUnits(value)) : undefined;
};
