import GoodDollarABI from "data/abis/GoodDollar.json";
import InsureDaoABI from "data/abis/insure-dao.json";
import { formatUnits } from "@ethersproject/units";
import { Provider } from "@ethersproject/providers";
import { Contract } from "ethers";

const InsureDAOToken = '0x22453153978D0C25f86010c0fd405527feD9764b';

export const getGoodDollarPrice = async (library: Provider) => {
  const goodDollar = new Contract('0x6C35677206ae7FF1bf753877649cF57cC30D1c42', GoodDollarABI, library);
  const price = goodDollar.currentPriceDAI();
  return price ? Number(formatUnits(price)) : undefined;
};

export const getInsureDAOPrice = async (library: Provider) => {
  const insureDao = new Contract('0x22453153978D0C25f86010c0fd405527feD9764b', InsureDaoABI, library);
  const price = await insureDao.rate();
  return price ? Number(formatUnits(price)) : undefined;
};

export const tokenPriceFunctions = {
  [InsureDAOToken.toLowerCase()]: getInsureDAOPrice
}

export async function getRateByToken(token: string, library: Provider) {
  return await tokenPriceFunctions[token.toLowerCase()](library)
}