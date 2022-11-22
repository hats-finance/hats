import GoodDollarABI from "data/abis/GoodDollar.json";
import InsureDaoABI from "data/abis/insure-dao.json";
import { formatUnits } from "@ethersproject/units";
import { Provider } from "@ethersproject/providers";
import { Contract } from "ethers";

const InsureDAOToken = "0x22453153978D0C25f86010c0fd405527feD9764b";
const GoodDollarPriceContract = "0xa150a825d425B36329D8294eeF8bD0fE68f8F6E0";
const GoodDollarToken = "0x67c5870b4a41d4ebef24d2456547a03f1f3e094b";

export const getGoodDollarPrice = async (library: Provider) => {
  const goodDollar = new Contract(GoodDollarPriceContract, GoodDollarABI, library);
  const price = await goodDollar.currentPriceDAI();
  return price ? Number(formatUnits(price)) : undefined;
};

export const getInsureDAOPrice = async (library: Provider) => {
  const insureDao = new Contract(InsureDAOToken, InsureDaoABI, library);
  const price = await insureDao.rate();
  return price ? Number(formatUnits(price)) : undefined;
};

export const tokenPriceFunctions = {
  [InsureDAOToken.toLowerCase()]: getInsureDAOPrice,
  [GoodDollarToken.toLowerCase()]: getGoodDollarPrice,
};

export async function getRateByToken(token: string, library: Provider) {
  return await tokenPriceFunctions[token.toLowerCase()](library);
}
