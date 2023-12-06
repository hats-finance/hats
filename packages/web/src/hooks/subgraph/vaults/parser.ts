import { formatUnits } from "@ethersproject/units";
import { IMaster, IPayoutGraph, IUserNft, IVault, IVaultDescription, IVaultV2 } from "@hats-finance/shared";
import { BigNumber, ethers } from "ethers";
import { appChains } from "settings";

export const overrideDescription = (vaultAddress: string, description?: IVaultDescription) => {
  if (!description) return description;

  // Change VMEX logo
  const vmexIds = ["0xb6861bdeb368a1bf628fc36a36cec62d04fb6a77", "0x050183b53cf62bcd6c2a932632f8156953fd146f"];
  if (vmexIds.includes(vaultAddress.toLowerCase())) {
    description["project-metadata"].icon = "ipfs://QmZyTzxjpZrsJmYgApi2Ku4UaaE25VjjFadvrCtMn4rdks";
  }

  // Change VMEX 2 audit competiton name
  const vmex2Id = "0xb6861bdeb368a1bf628fc36a36cec62d04fb6a77";
  if (vmex2Id === vaultAddress.toLowerCase()) {
    description["project-metadata"].name = "VMEX #2";
  }

  // Change IDLE private audit competiton name
  const idleId = "0x12005ec362c177c101b316d40a26cebda42d5c3b";
  if (idleId === vaultAddress.toLowerCase()) {
    description["project-metadata"].name = "Idle Finance";
  }

  // Change Convergence audit competiton name
  const convergenceId = "0x0e410e7af8e70fc5bffcdbfbdf1673ee7b3d0777";
  if (convergenceId === vaultAddress.toLowerCase()) {
    description["project-metadata"].name = "Convergence Finance";
  }

  return description;
};

const fixVaultsData = (vaults: IVault[]) => {
  // Override the default governance fee (we already changed it on-chain, but takes time to show up)
  const newVaults = [...vaults];
  // Ether.fi
  const etherfiVault = newVaults.find((vault) => vault.id.toLowerCase() === "0x36c3b77853dec9c4a237a692623293223d4b9bc4");
  if (etherfiVault) etherfiVault.governanceHatRewardSplit = "1000";
  // Possum
  const possumVault = newVaults.find((vault) => vault.id.toLowerCase() === "0xed8965d49b8aeca763447d56e6da7f4e0506b2d3");
  if (possumVault) possumVault.governanceHatRewardSplit = "2000";

  return newVaults;
};

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
  const newVaults = fixVaultsData(vaults);
  return newVaults.map((vault) => ({
    ...vault,
    chainId,
  }));
};

export const parsePayouts = (payouts: IPayoutGraph[], chainId: number) => {
  // Override the claim description hash
  const newPayouts = [...payouts];
  // Lodestar audit competition payout
  const lodestarPayout = newPayouts.find(
    (payout) => payout.id === "0x914f1db490c344e9dd0d79dd78474f8438be3bd699399affceeb2fd92a16b2dd"
  );
  if (lodestarPayout) lodestarPayout.payoutDataHash = "QmY13wMHUYeYrjMzUdC1d4AE3VoL6xqZajevhG7JPeZDfh";

  // TODO: after TGE add functionality to include `hackerHatReward` into the sum of `totalPaidOut`
  return newPayouts.map((payout) => ({
    ...payout,
    chainId,
    isActive: !payout.dismissedAt && !payout.approvedAt,
    isApproved: !!payout.approvedAt,
    isDismissed: !!payout.dismissedAt,
    totalPaidOut: !!payout.approvedAt
      ? BigNumber.from(payout.hackerReward ?? "0")
          .add(BigNumber.from(payout.hackerVestedReward ?? "0"))
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
      rewardControllers: (vault as IVaultV2).rewardControllers?.map((controller) => ({
        ...controller,
        tokenPriceUsd: isTestnet ? 12.65 : (controller && tokenPrices && tokenPrices[controller.rewardToken]) ?? 0,
      })),
      amountsInfo: {
        maxRewardFactor,
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
