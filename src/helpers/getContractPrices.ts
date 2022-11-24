import { BigNumber } from "ethers";
import { chain } from "wagmi";
import GoodDollarABI from "data/abis/GoodDollar.json";
import InsureDaoABI from "data/abis/insure-dao.json";
import { readContract } from "@wagmi/core";
import { formatUnits } from "@ethersproject/units";

const InsureDAOToken = "0x22453153978D0C25f86010c0fd405527feD9764b";
const GoodDollarPriceContract = "0xa150a825d425B36329D8294eeF8bD0fE68f8F6E0";
const GoodDollarToken = "0x67c5870b4a41d4ebef24d2456547a03f1f3e094b";

export const getGoodDollarPrice = async () => {
  const res = await readContract({
    address: GoodDollarPriceContract,
    abi: GoodDollarABI,
    functionName: "currentPriceDAI",
    chainId: chain.mainnet.id,
  });
  const goodDollarPrice = res as BigNumber;

  return goodDollarPrice ? Number(formatUnits(goodDollarPrice)) : undefined;
};

export const getInsureDAOPrice = async () => {
  const res = await readContract({
    address: InsureDAOToken,
    abi: InsureDaoABI,
    functionName: "rate",
    chainId: chain.mainnet.id,
  });
  const insureDaoPrice = res as BigNumber;

  return insureDaoPrice ? Number(formatUnits(insureDaoPrice)) : undefined;
};

export const tokenPriceFunctions = {
  [InsureDAOToken.toLowerCase()]: getInsureDAOPrice,
  [GoodDollarToken.toLowerCase()]: getGoodDollarPrice,
};
