import { BigNumber } from "ethers";
import { mainnet } from "wagmi/chains";
import { GoodDollar_abi, InsureDao_abi } from "@hats-finance/shared";
import { readContract } from "wagmi/actions";
import { formatUnits } from "@ethersproject/units";

const InsureDAOTokenMainnet = "0x22453153978D0C25f86010c0fd405527feD9764b";
const GoodDollarPriceContractMainnet = "0xa150a825d425B36329D8294eeF8bD0fE68f8F6E0";
const GoodDollarTokenMainnet = "0x67c5870b4a41d4ebef24d2456547a03f1f3e094b";

export const getGoodDollarPriceMainnet = async () => {
  const res = await readContract({
    address: GoodDollarPriceContractMainnet,
    abi: GoodDollar_abi,
    functionName: "currentPriceDAI",
    chainId: mainnet.id,
  });
  const goodDollarPrice = res as BigNumber;

  return goodDollarPrice ? Number(formatUnits(goodDollarPrice)) : undefined;
};

export const getInsureDAOPriceMainnet = async () => {
  const res = await readContract({
    address: InsureDAOTokenMainnet,
    abi: InsureDao_abi,
    functionName: "rate",
    chainId: mainnet.id,
  });
  const insureDaoPrice = res as BigNumber;

  return insureDaoPrice ? Number(formatUnits(insureDaoPrice)) : undefined;
};

export const tokenPriceFunctions = {
  [InsureDAOTokenMainnet.toLowerCase()]: getInsureDAOPriceMainnet,
  [GoodDollarTokenMainnet.toLowerCase()]: getGoodDollarPriceMainnet,
};
