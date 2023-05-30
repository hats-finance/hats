import { formatUnits } from "@ethersproject/units";
import { IMaster, IPayoutGraph, IUserNft, IVault } from "@hats-finance/shared";

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
    isActive: !payout.dismissedAt && !payout.approvedAt,
    isApproved: !!payout.approvedAt,
    isDismissed: !!payout.dismissedAt,
    chainId,
  }));
};

export const populateVaultsWithPricing = (vaults: IVault[], tokenPrices: number[] | undefined): IVault[] => {
  if (!tokenPrices) return vaults;

  return vaults.map((vault) => {
    const tokenPrice = tokenPrices[vault.stakingToken] ?? 0;
    const depositedAmount = Number(formatUnits(vault.honeyPotBalance, vault.stakingTokenDecimals));

    return {
      ...vault,
      depositedAmount,
      depositedAmountValue: depositedAmount * tokenPrice,
    } as IVault;
  });
};
