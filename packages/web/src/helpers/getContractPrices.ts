import { formatUnits } from "@ethersproject/units";
import { GoodDollar_abi, InsureDao_abi } from "@hats-finance/shared";
import axios from "axios";
import { BigNumber } from "ethers";
import { readContract } from "wagmi/actions";
import { mainnet } from "wagmi/chains";

const InsureDAOTokenMainnet = "0x22453153978D0C25f86010c0fd405527feD9764b";
const GoodDollarPriceContractMainnet = "0xa150a825d425B36329D8294eeF8bD0fE68f8F6E0";
const GoodDollarTokenMainnet = "0x67c5870b4a41d4ebef24d2456547a03f1f3e094b";
const SpiralDaoTokenMainnet = "0x85b6ACaBa696B9E4247175274F8263F99b4B9180";

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

export const getSpiralDaoPriceMainnet = async () => {
  const apiRes = await axios.get("https://api.spiral.farm/data/eth/data");
  if (apiRes.data?.rewardToken?.address.toLowerCase() !== SpiralDaoTokenMainnet.toLowerCase()) return undefined;

  const spiralPrice = apiRes.data?.rewardToken?.price as number | undefined;
  return spiralPrice;
};

export const tokenPriceFunctions = {
  [InsureDAOTokenMainnet.toLowerCase()]: getInsureDAOPriceMainnet,
  [GoodDollarTokenMainnet.toLowerCase()]: getGoodDollarPriceMainnet,
  [SpiralDaoTokenMainnet.toLowerCase()]: getSpiralDaoPriceMainnet,
};
