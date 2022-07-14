import { GoodDollarContractAddress } from "constants/constants";
import GoodDollarABI from "data/abis/GoodDollar.json";
import { formatUnits } from "@ethersproject/units";
import { Provider } from "@ethersproject/providers";
import { Contract } from "ethers";

export const getGoodDollarPrice = (library: Provider) => {
  const goodDollar = new Contract(GoodDollarContractAddress, GoodDollarABI, library);
  const price = goodDollar.currentPriceDAI();
  return price ? Number(formatUnits(price)) : undefined;
};
