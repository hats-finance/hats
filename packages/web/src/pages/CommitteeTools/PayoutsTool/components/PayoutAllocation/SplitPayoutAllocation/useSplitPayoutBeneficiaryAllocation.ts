import { IPayoutResponse, IVault } from "@hats-finance/shared";
import { BigNumber, ethers } from "ethers";
import { useVaults } from "hooks/vaults/useVaults";
import millify from "millify";
import { Amount } from "utils/amounts.utils";

const DEFAULT_RETURN = {
  immediateAmount: undefined,
  vestedAmount: undefined,
  hatsRewardAmount: undefined,
  committeeAmount: undefined,
  governanceAmount: undefined,
  totalAmount: undefined,
};

export const useSplitPayoutBeneficiaryAllocation = (
  vault: IVault | undefined,
  payout: IPayoutResponse | undefined,
  percentageToPay: string | undefined
) => {
  const { payouts, tokenPrices } = useVaults();

  if (!payout || !vault || !percentageToPay) return DEFAULT_RETURN;

  const tokenAddress = vault.stakingToken;
  const tokenSymbol = vault.stakingTokenSymbol;
  const tokenDecimals = vault.stakingTokenDecimals;
  const tokenPrice = tokenPrices?.[tokenAddress] ?? 0;

  // Check if this payout is already created on chain
  const payoutOnChainData = payouts?.find((p) => p.id === payout.payoutClaimId);

  if (payoutOnChainData?.approvedAt) {
    // If payout is already created on chain, we can use the data from the contract
    const immediateSplit = new Amount(BigNumber.from(payoutOnChainData.hackerReward), tokenDecimals, tokenSymbol);
    const vestedSplit = new Amount(BigNumber.from(payoutOnChainData.hackerVestedReward), tokenDecimals, tokenSymbol);
    const hatsRewardSplit = new Amount(BigNumber.from(payoutOnChainData.hackerHatReward), tokenDecimals, tokenSymbol);
    const committeeSplit = new Amount(BigNumber.from(payoutOnChainData.committeeReward), tokenDecimals, tokenSymbol);
    const governanceSplit = new Amount(BigNumber.from(payoutOnChainData.governanceHatReward), tokenDecimals, tokenSymbol);
    const totalSplit = new Amount(
      immediateSplit.bigNumber
        .add(vestedSplit.bigNumber)
        .add(hatsRewardSplit.bigNumber)
        .add(committeeSplit.bigNumber)
        .add(governanceSplit.bigNumber),
      tokenDecimals,
      tokenSymbol
    );

    return {
      immediateAmount:
        immediateSplit.number > 0
          ? {
              tokens: immediateSplit.formatted(5),
              usd: `${millify(immediateSplit.number * tokenPrice, { precision: 2 })}$`,
              percentage: `${millify((immediateSplit.number / totalSplit.number) * 100, { precision: 2 })}%`,
            }
          : undefined,
      vestedAmount:
        vestedSplit.number > 0
          ? {
              tokens: vestedSplit.formatted(5),
              usd: `${millify(vestedSplit.number * tokenPrice, { precision: 2 })}$`,
              percentage: `${millify((vestedSplit.number / totalSplit.number) * 100, { precision: 2 })}%`,
            }
          : undefined,
      hatsRewardAmount:
        hatsRewardSplit.number > 0
          ? {
              tokens: hatsRewardSplit.formatted(5),
              usd: `${millify(hatsRewardSplit.number * tokenPrice, { precision: 2 })}$`,
              percentage: `${millify((hatsRewardSplit.number / totalSplit.number) * 100, { precision: 2 })}%`,
            }
          : undefined,
      committeeAmount:
        committeeSplit.number > 0
          ? {
              tokens: committeeSplit.formatted(5),
              usd: `${millify(committeeSplit.number * tokenPrice, { precision: 2 })}$`,
              percentage: `${millify((committeeSplit.number / totalSplit.number) * 100, { precision: 2 })}%`,
            }
          : undefined,
      governanceAmount:
        governanceSplit.number > 0
          ? {
              tokens: governanceSplit.formatted(5),
              usd: `${millify(governanceSplit.number * tokenPrice, { precision: 2 })}$`,
              percentage: `${millify((governanceSplit.number / totalSplit.number) * 100, { precision: 2 })}%`,
            }
          : undefined,
      totalAmount:
        totalSplit.number > 0
          ? {
              tokens: totalSplit.formatted(),
              usd: `${millify(totalSplit.number * tokenPrice, { precision: 2 })}$`,
              percentage: undefined,
            }
          : undefined,
    };
  } else {
    // If payout is not created on chain, we calculate the amount in real time (based on the vault balance and the percentage to pay)
    const immediatePercentage = +vault.hackerRewardSplit / 100 / 100;
    const vestedPercentage = +vault.hackerVestedRewardSplit / 100 / 100;
    const committeePercentage = +vault.committeeRewardSplit / 100 / 100;
    const governancePercentage = BigNumber.from(vault.governanceHatRewardSplit).eq(ethers.constants.MaxUint256)
      ? +vault.master.defaultGovernanceHatRewardSplit / 100 / 100
      : +vault.governanceHatRewardSplit / 100 / 100;
    const hatsRewardPercentage = BigNumber.from(vault.hackerHatRewardSplit).eq(ethers.constants.MaxUint256)
      ? +vault.master.defaultHackerHatRewardSplit / 100 / 100
      : +vault.hackerHatRewardSplit / 100 / 100;

    // In v2 vaults the split sum (immediate, vested, committee) is 100%. So we need to calculate the split factor to get the correct values.
    // In v1 this is not a probem. So the factor is 1.
    const splitFactor = vault.version === "v1" ? 1 : 1 - Number(governancePercentage) - Number(hatsRewardPercentage);
    const vaultBalance = new Amount(BigNumber.from(vault.honeyPotBalance), tokenDecimals, tokenSymbol).number;

    const immediateSplit = vaultBalance * immediatePercentage * splitFactor * (+percentageToPay / 100);
    const vestedSplit = vaultBalance * vestedPercentage * splitFactor * (+percentageToPay / 100);
    const committeeSplit = vaultBalance * committeePercentage * splitFactor * (+percentageToPay / 100);
    const governanceSplit = vaultBalance * governancePercentage * (+percentageToPay / 100);
    const hatsRewardSplit = vaultBalance * hatsRewardPercentage * (+percentageToPay / 100);
    const totalSplit = immediateSplit + vestedSplit + hatsRewardSplit + committeeSplit + governanceSplit;

    return {
      immediateAmount:
        immediateSplit > 0
          ? {
              tokens: `${millify(immediateSplit, { precision: 5 })} ${tokenSymbol}`,
              usd: `${millify(immediateSplit * tokenPrice, { precision: 2 })}$`,
              percentage: `${millify((immediateSplit / totalSplit) * 100, { precision: 2 })}%`,
            }
          : undefined,
      vestedAmount:
        vestedSplit > 0
          ? {
              tokens: `${millify(vestedSplit, { precision: 5 })} ${tokenSymbol}`,
              usd: `${millify(vestedSplit * tokenPrice, { precision: 2 })}$`,
              percentage: `${millify((vestedSplit / totalSplit) * 100, { precision: 2 })}%`,
            }
          : undefined,
      hatsRewardAmount:
        hatsRewardSplit > 0
          ? {
              tokens: `${millify(hatsRewardSplit, { precision: 5 })} ${tokenSymbol}`,
              usd: `${millify(hatsRewardSplit * tokenPrice, { precision: 2 })}$`,
              percentage: `${millify((hatsRewardSplit / totalSplit) * 100, { precision: 2 })}%`,
            }
          : undefined,
      committeeAmount:
        committeeSplit > 0
          ? {
              tokens: `${millify(committeeSplit, { precision: 5 })} ${tokenSymbol}`,
              usd: `${millify(committeeSplit * tokenPrice, { precision: 2 })}$`,
              percentage: `${millify((committeeSplit / totalSplit) * 100, { precision: 2 })}%`,
            }
          : undefined,
      governanceAmount:
        governanceSplit > 0
          ? {
              tokens: `${millify(governanceSplit, { precision: 5 })} ${tokenSymbol}`,
              usd: `${millify(governanceSplit * tokenPrice, { precision: 2 })}$`,
              percentage: `${millify((governanceSplit / totalSplit) * 100, { precision: 2 })}%`,
            }
          : undefined,
      totalAmount:
        totalSplit > 0
          ? {
              tokens: `${millify(totalSplit, { precision: 5 })} ${tokenSymbol}`,
              usd: `${millify(totalSplit * tokenPrice, { precision: 2 })}$`,
              percentage: undefined,
            }
          : undefined,
    };
  }
};
