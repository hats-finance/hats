import { formatUnits } from "@ethersproject/units";
import { IMaster, IPayoutGraph, IUserNft, IVault } from "@hats-finance/shared";
import { BigNumber } from "ethers";
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

    const maxRewardFactor = vault.version === "v1" ? +vault.rewardsLevels[vault.rewardsLevels.length - 1] : +vault.maxBounty;

    return {
      ...vault,
      amountsInfo: {
        showCompetitionIntendedAmount:
          vault.description?.["project-metadata"].type === "audit" &&
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
                tokens: +vault.description?.["project-metadata"].intendedCompetitionAmount * (maxRewardFactor / 100 / 100),
                usd:
                  +vault.description?.["project-metadata"].intendedCompetitionAmount * tokenPrice * (maxRewardFactor / 100 / 100),
              },
            }
          : undefined,
        depositedAmount: {
          tokens: depositedAmountTokens,
          usd: depositedAmountTokens * tokenPrice,
        },
        maxRewardAmount: {
          tokens: depositedAmountTokens * (maxRewardFactor / 100 / 100),
          usd: depositedAmountTokens * tokenPrice * (maxRewardFactor / 100 / 100),
        },
      },
    } as IVault;
  });
};
