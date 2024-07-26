import { formatUnits } from "@ethersproject/units";
import { GoodDollar_abi, HATTokensConfig, InsureDao_abi } from "@hats.finance/shared";
import axios from "axios";
import { BigNumber } from "ethers";
import { getCamelotTokenPrices, getCoingeckoTokensPrices } from "utils/tokens.utils";
import { readContract } from "wagmi/actions";
import { arbitrum, mainnet } from "wagmi/chains";

const InsureDAOTokenMainnet = "0x22453153978D0C25f86010c0fd405527feD9764b";
const GoodDollarPriceContractMainnet = "0xa150a825d425B36329D8294eeF8bD0fE68f8F6E0";
const GoodDollarTokenMainnet = "0x67c5870b4a41d4ebef24d2456547a03f1f3e094b";
const SpiralDaoTokenMainnet = "0x85b6ACaBa696B9E4247175274F8263F99b4B9180";
const UMAVotingTokenOP = "0xe7798f023fc62146e8aa1b36da45fb70855a77ea";

export const externalPricingProvidersUrls = {
  spiraldao: "https://api.spiral.farm/data/eth/data",
};

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
  const apiRes = await axios.get(externalPricingProvidersUrls["spiraldao"]);
  if (apiRes.data?.rewardToken?.address.toLowerCase() !== SpiralDaoTokenMainnet.toLowerCase()) return undefined;

  const spiralPrice = apiRes.data?.rewardToken?.price as number | undefined;
  return spiralPrice;
};

export const getUMAVotingPriceOP = async () => {
  const UMATokenMainnet = "0x04fa0d235c4abf4bcf4787af4cf447de572ef828";
  const apiRes = await getCoingeckoTokensPrices([{ address: UMATokenMainnet, chainId: 1 }]);

  return apiRes[UMATokenMainnet.toLowerCase()]?.["usd"] as number | undefined;
};

export const getHATPriceMainnet = async () => {
  const HATArbitrum = HATTokensConfig.prod[arbitrum.id].address.toLowerCase();
  const apiRes = await getCamelotTokenPrices([{ address: HATArbitrum, chainId: arbitrum.id }]);

  return apiRes[HATArbitrum]?.["usd"] as number | undefined;
};

export const tokenPriceFunctions = {
  [InsureDAOTokenMainnet.toLowerCase()]: getInsureDAOPriceMainnet,
  [GoodDollarTokenMainnet.toLowerCase()]: getGoodDollarPriceMainnet,
  [SpiralDaoTokenMainnet.toLowerCase()]: getSpiralDaoPriceMainnet,
  [UMAVotingTokenOP.toLowerCase()]: getUMAVotingPriceOP,
  [HATTokensConfig.prod[mainnet.id].address.toLowerCase()]: getHATPriceMainnet,
};
