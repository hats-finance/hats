import { formatUnits } from "@ethersproject/units";
import { IMaster, IPayoutGraph, IUserNft, IVault } from "@hats-finance/shared";
import { BigNumber, ethers } from "ethers";
import { appChains } from "settings";

export const parseMasters = (masters: IMaster[], chainId: number) => {
  return masters.map((master) => ({
    ...master,
    chainId,
  }));
};

export const parseUserNfts = (userNfts: IUserNft[], chainId: number) => {
  return userNfts.map((userNft) => ({
    ...userNft,
    chainId,
  }));
};

export const parseVaults = (vaults: IVault[], chainId: number) => {
  return vaults.map((vault) => ({
    ...vault,
    chainId,
  }));
};

export const parsePayouts = (payouts: IPayoutGraph[], chainId: number) => {
  return payouts.map((payout) => ({
    ...payout,
    chainId,
    isActive: !payout.dismissedAt && !payout.approvedAt,
    isApproved: !!payout.approvedAt,
    isDismissed: !!payout.dismissedAt,
    totalPaidOut: !!payout.approvedAt
      ? BigNumber.from(payout.committeeReward ?? "0")
          .add(BigNumber.from(payout.hackerReward ?? "0"))
          .add(BigNumber.from(payout.hackerVestedReward ?? "0"))
          .add(BigNumber.from(payout.governanceHatReward ?? "0"))
          .add(BigNumber.from(payout.hackerHatReward ?? "0"))
          .toString()
      : undefined,
  }));
};

export const populateVaultsWithPricing = (vaults: IVault[], tokenPrices: number[] | undefined): IVault[] => {
  if (vaults.some((vault) => vault.amountsInfo)) return vaults;

  return vaults.map((vault) => {
    const isTestnet = appChains[vault.chainId].chain.testnet;
    const tokenPrice: number = isTestnet ? 1387.65 : (tokenPrices && tokenPrices[vault.stakingToken]) ?? 0;
    const depositedAmountTokens = Number(formatUnits(vault.honeyPotBalance, vault.stakingTokenDecimals));
    const isAudit = vault.description?.["project-metadata"].type === "audit";

    console.log(vault);

    const governanceSplit = BigNumber.from(vault.governanceHatRewardSplit).eq(ethers.constants.MaxUint256)
      ? vault.master.defaultGovernanceHatRewardSplit
      : vault.governanceHatRewardSplit;
    const hackerHatsSplit = BigNumber.from(vault.hackerHatRewardSplit).eq(ethers.constants.MaxUint256)
      ? vault.master.defaultHackerHatRewardSplit
      : vault.hackerHatRewardSplit;

    // In v2 vaults the split sum (immediate, vested, committee) is 100%. So we need to calculate the split factor to get the correct values.
    // In v1 this is not a probem. So the factor is 1.
    const splitFactor = vault.version === "v1" ? 1 : (10000 - Number(governanceSplit) - Number(hackerHatsSplit)) / 100 / 100;

    const governanceFee = Number(governanceSplit) / 100 / 100;
    const committeeFee = (Number(vault.committeeRewardSplit) / 100 / 100) * splitFactor;

    const maxRewardFactor = 1 - governanceFee - committeeFee;

    return {
      ...vault,
      amountsInfo: {
        showCompetitionIntendedAmount:
          isAudit &&
          vault.description &&
          vault.description["project-metadata"].starttime &&
          vault.description["project-metadata"].starttime > new Date().getTime() / 1000 + 48 * 3600 && // 48 hours
          !!vault.description?.["project-metadata"].intendedCompetitionAmount &&
          BigNumber.from(vault.honeyPotBalance).eq(0),
        tokenPriceUsd: tokenPrice,
        competitionIntendedAmount: vault.description?.["project-metadata"].intendedCompetitionAmount
          ? {
              deposited: {
                tokens: +vault.description?.["project-metadata"].intendedCompetitionAmount,
                usd: +vault.description?.["project-metadata"].intendedCompetitionAmount * tokenPrice,
              },
              maxReward: {
                tokens: +vault.description?.["project-metadata"].intendedCompetitionAmount * maxRewardFactor,
                usd: +vault.description?.["project-metadata"].intendedCompetitionAmount * tokenPrice * maxRewardFactor,
              },
            }
          : undefined,
        depositedAmount: {
          tokens: depositedAmountTokens,
          usd: depositedAmountTokens * tokenPrice,
        },
        maxRewardAmount: {
          tokens: depositedAmountTokens * maxRewardFactor,
          usd: depositedAmountTokens * tokenPrice * maxRewardFactor,
        },
      },
    } as IVault;
  });
};
