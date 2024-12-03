import { GithubPR, ISplitPayoutBeneficiary, ISplitPayoutData } from "@hats.finance/shared";
import millify from "millify";

const BONUS_POINTS_CONSTRAINTS = {
  fix: 0.1, // 10%
  test: 0.05, // 5%
};

const DECIMALS_TO_USE = 4;

// type IMultipayoutCalculation = ISplitPayoutBeneficiary[];
type IBeneficiaryWithCalcs = ISplitPayoutBeneficiary & { amount: number; calculatedReward: number };
export type IPayoutAutoCalcs = {
  beneficiariesCalculated: IBeneficiaryWithCalcs[];
  totalRewards: number;
  totalPercentageToPay: number;
  paymentPerPoint?: number;
};

function truncate(num: number, fixed: number) {
  const regex = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(regex)?.[0] ?? num.toString();
}

export const autocalculateMultiPayout = (
  beneficiaries: ISplitPayoutBeneficiary[],
  constraints: ISplitPayoutData["rewardsConstraints"],
  totalAmountToPay: number
): IPayoutAutoCalcs | undefined => {
  if (!constraints) return undefined;
  if (!beneficiaries || beneficiaries.length === 0) return undefined;

  const beneficiariesCalculated = [] as IBeneficiaryWithCalcs[];
  const severityCounts: { [key: string]: number } = {};

  // First, count the number of entries for each severity
  for (let beneficiary of beneficiaries) {
    if (severityCounts[beneficiary.severity]) {
      severityCounts[beneficiary.severity]++;
    } else {
      severityCounts[beneficiary.severity] = 1;
    }
  }

  // Then, calculate the reward for each entry
  for (let beneficiary of beneficiaries) {
    const info = constraints.find((constraint) => constraint.severity.toLowerCase() === beneficiary.severity.toLowerCase());
    if (!info) continue;

    const totalSeverityAmount = totalAmountToPay * (+info.maxReward / 100);
    let calculatedReward = totalSeverityAmount / severityCounts[beneficiary.severity.toLowerCase()];

    // If the calculated reward exceeds the cap, use the cap instead
    if (info.capAmount && +info.capAmount > 0 && calculatedReward > +info.capAmount) {
      calculatedReward = +info.capAmount;
    }

    const beneficiaryCalculated: IBeneficiaryWithCalcs = {
      ...beneficiary,
      amount: totalSeverityAmount,
      calculatedReward: calculatedReward,
      percentageOfPayout: "0",
    };
    beneficiariesCalculated.push(beneficiaryCalculated);
  }

  // Total amount to pay in TOKENS
  const totalRewards = Object.values(beneficiariesCalculated).reduce((sum, ben) => sum + ben.calculatedReward, 0);

  // Calculate the payout of the total amount for each reward
  for (const ben of beneficiariesCalculated) {
    ben.percentageOfPayout = truncate((ben.calculatedReward / totalRewards) * 100, DECIMALS_TO_USE);
  }

  // Fill the last reward with the remaining percentage
  const totalSumPercentages = +truncate(
    Object.values(beneficiariesCalculated).reduce((sum, ben) => sum + +ben.percentageOfPayout, 0),
    DECIMALS_TO_USE
  );

  if (beneficiariesCalculated[beneficiariesCalculated.length - 1]) {
    beneficiariesCalculated[beneficiariesCalculated.length - 1].percentageOfPayout = (
      +beneficiariesCalculated[beneficiariesCalculated.length - 1].percentageOfPayout +
      +(100 - totalSumPercentages).toFixed(DECIMALS_TO_USE)
    ).toFixed(DECIMALS_TO_USE);
  }

  const totalPercentageToPay = +truncate((totalRewards / totalAmountToPay) * 100, DECIMALS_TO_USE);

  return { beneficiariesCalculated, totalRewards, totalPercentageToPay };
};

export const autocalculateMultiPayoutPointingSystem = (
  beneficiaries: ISplitPayoutBeneficiary[],
  constraints: ISplitPayoutData["rewardsConstraints"],
  totalAmountToPay: number,
  maxCapPerPoint: number
): IPayoutAutoCalcs | undefined => {
  if (!constraints || !constraints.length) return undefined;
  if (!beneficiaries || beneficiaries.length === 0) return undefined;

  console.log({ beneficiaries, constraints, totalAmountToPay, maxCapPerPoint });

  const beneficiariesCalculated = [] as IBeneficiaryWithCalcs[];

  const needPoints = beneficiaries.every((ben) => ben.percentageOfPayout === "" || ben.percentageOfPayout === undefined);
  for (let beneficiary of beneficiaries) {
    if (beneficiary.severity.toLowerCase() === "complementary") {
      const mainIssueSev = (beneficiary.ghIssue as GithubPR).linkedIssue?.severity;
      const mainIssueSevInfo = constraints.find(
        (constraint) => constraint.severity.toLowerCase() === mainIssueSev?.toLowerCase()
      );
      const mainIssuePoints = mainIssueSevInfo?.points ? `${mainIssueSevInfo.points.value.first}` : "1";

      let totalMultiplier = 0;

      if (beneficiary.ghIssue?.labels.includes("complete-fix")) totalMultiplier += BONUS_POINTS_CONSTRAINTS.fix;
      if (beneficiary.ghIssue?.labels.includes("complete-test")) totalMultiplier += BONUS_POINTS_CONSTRAINTS.test;

      const complementaryPoints = totalMultiplier * +mainIssuePoints;

      const beneficiaryCalculated: IBeneficiaryWithCalcs = {
        ...beneficiary,
        percentageOfPayout: needPoints ? `${complementaryPoints.toFixed(4)}` : beneficiary.percentageOfPayout,
        amount: 0,
        calculatedReward: 0,
      };
      beneficiariesCalculated.push(beneficiaryCalculated);
    } else {
      const sevInfo = constraints.find((constraint) => constraint.severity.toLowerCase() === beneficiary.severity.toLowerCase());
      const defaultPoints = sevInfo?.points ? `${sevInfo.points.value.first}` : "1";

      const beneficiaryCalculated: IBeneficiaryWithCalcs = {
        ...beneficiary,
        percentageOfPayout: needPoints ? defaultPoints : beneficiary.percentageOfPayout,
        amount: 0,
        calculatedReward: 0,
      };
      beneficiariesCalculated.push(beneficiaryCalculated);
    }
  }

  const totalPointsToPay = beneficiariesCalculated.reduce((prev, curr) => prev + +curr.percentageOfPayout, 0);

  const pricePerPointUsingCap = (totalAmountToPay * maxCapPerPoint) / 100;
  const pricePerPointUsingTotalAllocation = totalPointsToPay !== 0 ? totalAmountToPay / totalPointsToPay : 0;
  const pricePerPointToUse = Math.min(pricePerPointUsingCap, pricePerPointUsingTotalAllocation);

  const totalPercentageToPay = totalAmountToPay === 0 ? 0 : ((totalPointsToPay * pricePerPointToUse) / totalAmountToPay) * 100;

  return {
    beneficiariesCalculated,
    totalRewards: 0,
    totalPercentageToPay: +millify(totalPercentageToPay, { precision: 2 }),
    paymentPerPoint: pricePerPointToUse,
  };
};
