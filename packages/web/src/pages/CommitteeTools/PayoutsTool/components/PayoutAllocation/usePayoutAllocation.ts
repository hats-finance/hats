import { formatUnits } from "@ethersproject/units";
import { IPayoutResponse, ISplitPayoutData, IVault } from "@hats.finance/shared";
import { BigNumber, ethers } from "ethers";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import millify from "millify";
import { Amount } from "utils/amounts.utils";

type PayoutAllocationAmount = {
  tokens: { formatted: string; number: string };
  usd: { formatted: string; number: string };
  percentage: string | undefined;
};

type PayoutAllocation = {
  immediateAmount: PayoutAllocationAmount | undefined;
  vestedAmount: PayoutAllocationAmount | undefined;
  hatsRewardAmount: PayoutAllocationAmount | undefined;
  committeeAmount: PayoutAllocationAmount | undefined;
  governanceAmount: PayoutAllocationAmount | undefined;
  totalAmount: PayoutAllocationAmount | undefined;
  totalHackerAmount: PayoutAllocationAmount | undefined;
};

const DEFAULT_RETURN: PayoutAllocation = {
  immediateAmount: undefined,
  vestedAmount: undefined,
  hatsRewardAmount: undefined,
  committeeAmount: undefined,
  governanceAmount: undefined,
  totalAmount: undefined,
  totalHackerAmount: undefined,
};

/**
 * This hook is used to calculate the payout allocation for a specific payout.
 *
 * @remarks It works with single and split payout. And with V1 and V2 vaults.
 *
 * @param vault The vault that the payout is related to
 * @param payout The payout that we want to calculate the allocation
 * @param percentageToPayOfTheVault The percentage of the vault that we want to pay for this specific payout
 * @param percentageOfPayout The percentage of the whole payout that we want to pay for this specific beneficiary. This
 * is only used when the payout is splitted between multiple beneficiaries.
 */
export const usePayoutAllocation = (
  vault: IVault | undefined,
  payout: IPayoutResponse | undefined,
  percentageToPayOfTheVault: string | undefined,
  percentageOfPayout?: string | undefined,
  totalPercentagesAmongBeneficiaries?: string | undefined
): PayoutAllocation => {
  const { allPayouts } = useVaults();

  const usingPointingSystem = payout?.payoutData.type === "split" && (payout?.payoutData as ISplitPayoutData).usingPointingSystem;
  const totalPoints = +(usingPointingSystem ? totalPercentagesAmongBeneficiaries ?? 1 : 1);
  // We need to multiply the results by the percentage of the payout that we want to pay for this specific beneficiary. This is
  // only used when we want to split the payout between multiple beneficiaries
  const beneficiaryFactor = usingPointingSystem
    ? percentageOfPayout
      ? Number(percentageOfPayout) / totalPoints
      : 1
    : percentageOfPayout
    ? Number(percentageOfPayout) / 100
    : 1;

  if (!payout || !vault || !percentageToPayOfTheVault) return DEFAULT_RETURN;

  const tokenSymbol = vault.stakingTokenSymbol;
  const tokenDecimals = vault.stakingTokenDecimals;
  const tokenPrice = vault.amountsInfo?.tokenPriceUsd ?? 0;

  // Check if this payout is already created on chain
  const payoutOnChainData = allPayouts?.find((p) => p.id === payout.payoutClaimId);

  let immediateSplit = 0;
  let vestedSplit = 0;
  let hatsRewardSplit = 0;
  let committeeSplit = 0;
  let governanceSplit = 0;
  let totalHackerSplit = 0;
  let totalSplit = 0;

  if (payoutOnChainData?.isApproved) {
    // If payout is already created on chain, we can use the data from the contract
    immediateSplit = Number(formatUnits(payoutOnChainData.hackerReward, tokenDecimals)) * beneficiaryFactor;
    vestedSplit = Number(formatUnits(payoutOnChainData.hackerVestedReward, tokenDecimals)) * beneficiaryFactor;
    hatsRewardSplit = Number(formatUnits(payoutOnChainData.hackerHatReward, tokenDecimals)) * beneficiaryFactor;
    committeeSplit = Number(formatUnits(payoutOnChainData.committeeReward, tokenDecimals)) * beneficiaryFactor;
    governanceSplit = Number(formatUnits(payoutOnChainData.governanceHatReward, tokenDecimals)) * beneficiaryFactor;
    totalHackerSplit = immediateSplit + vestedSplit;
    totalSplit = immediateSplit + vestedSplit + hatsRewardSplit + committeeSplit + governanceSplit;
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
    const payoutFactor = (+percentageToPayOfTheVault / 100) * beneficiaryFactor;

    immediateSplit = vaultBalance * immediatePercentage * splitFactor * payoutFactor;
    vestedSplit = vaultBalance * vestedPercentage * splitFactor * payoutFactor;
    committeeSplit = vaultBalance * committeePercentage * splitFactor * payoutFactor;
    governanceSplit = vaultBalance * governancePercentage * payoutFactor;
    hatsRewardSplit = vaultBalance * hatsRewardPercentage * payoutFactor;
    totalHackerSplit = immediateSplit + vestedSplit;
    totalSplit = immediateSplit + vestedSplit + hatsRewardSplit + committeeSplit + governanceSplit;
  }

  return {
    immediateAmount:
      immediateSplit > 0
        ? {
            tokens: {
              formatted: `${millify(immediateSplit, { precision: 5 })} ${tokenSymbol}`,
              number: millify(immediateSplit, { precision: 5 }),
            },
            usd: {
              formatted: `${millify(immediateSplit * tokenPrice, { precision: 2 })}$`,
              number: millify(immediateSplit * tokenPrice, { precision: 2 }),
            },
            percentage: `${millify((immediateSplit / totalSplit) * 100, { precision: 2 })}%`,
          }
        : undefined,
    vestedAmount:
      vestedSplit > 0
        ? {
            tokens: {
              formatted: `${millify(vestedSplit, { precision: 5 })} ${tokenSymbol}`,
              number: millify(vestedSplit, { precision: 5 }),
            },
            usd: {
              formatted: `${millify(vestedSplit * tokenPrice, { precision: 2 })}$`,
              number: millify(vestedSplit * tokenPrice, { precision: 2 }),
            },
            percentage: `${millify((vestedSplit / totalSplit) * 100, { precision: 2 })}%`,
          }
        : undefined,
    hatsRewardAmount:
      hatsRewardSplit > 0
        ? {
            tokens: {
              formatted: `${millify(hatsRewardSplit, { precision: 5 })} ${tokenSymbol}`,
              number: millify(hatsRewardSplit, { precision: 5 }),
            },
            usd: {
              formatted: `${millify(hatsRewardSplit * tokenPrice, { precision: 2 })}$`,
              number: millify(hatsRewardSplit * tokenPrice, { precision: 2 }),
            },
            percentage: `${millify((hatsRewardSplit / totalSplit) * 100, { precision: 2 })}%`,
          }
        : undefined,
    committeeAmount:
      committeeSplit > 0
        ? {
            tokens: {
              formatted: `${millify(committeeSplit, { precision: 5 })} ${tokenSymbol}`,
              number: millify(committeeSplit, { precision: 5 }),
            },
            usd: {
              formatted: `${millify(committeeSplit * tokenPrice, { precision: 2 })}$`,
              number: millify(committeeSplit * tokenPrice, { precision: 2 }),
            },
            percentage: `${millify((committeeSplit / totalSplit) * 100, { precision: 2 })}%`,
          }
        : undefined,
    governanceAmount:
      governanceSplit > 0
        ? {
            tokens: {
              formatted: `${millify(governanceSplit, { precision: 5 })} ${tokenSymbol}`,
              number: millify(governanceSplit, { precision: 5 }),
            },
            usd: {
              formatted: `${millify(governanceSplit * tokenPrice, { precision: 2 })}$`,
              number: millify(governanceSplit * tokenPrice, { precision: 2 }),
            },
            percentage: `${millify((governanceSplit / totalSplit) * 100, { precision: 2 })}%`,
          }
        : undefined,
    totalHackerAmount:
      totalHackerSplit > 0
        ? {
            tokens: {
              formatted: `${millify(totalHackerSplit, { precision: 5 })} ${tokenSymbol}`,
              number: millify(totalHackerSplit, { precision: 5 }),
            },
            usd: {
              formatted: `${millify(totalHackerSplit * tokenPrice, { precision: 2 })}$`,
              number: millify(totalHackerSplit * tokenPrice, { precision: 2 }),
            },
            percentage: `${millify((totalHackerSplit / totalSplit) * 100, { precision: 2 })}%`,
          }
        : undefined,
    totalAmount:
      totalSplit > 0
        ? {
            tokens: {
              formatted: `${millify(totalSplit, { precision: 5 })} ${tokenSymbol}`,
              number: millify(totalSplit, { precision: 5 }),
            },
            usd: {
              formatted: `${millify(totalSplit * tokenPrice, { precision: 2 })}$`,
              number: millify(totalSplit * tokenPrice, { precision: 2 }),
            },
            percentage: undefined,
          }
        : undefined,
  };
};
