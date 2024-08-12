import { IPayoutGraph, ISplitPayoutData, IVault, parseSeverityName } from "@hats.finance/shared";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { ipfsTransformUri } from "utils";

export type IAuditPayoutLeaderboardData = {
  beneficiary: string;
  totalRewards: { usd: number; tokens: number };
  rewardToken: string;
  findings: { severity: string; count: number; totalRewards: { usd: number; tokens: number } }[];
  totalFindings: number;
};

export const useAuditPayoutLeaderboardData = (
  vault: IVault,
  auditPayout: IPayoutGraph | undefined
): IAuditPayoutLeaderboardData[] => {
  const [leaderboardData, setLeaderboardData] = useState<IAuditPayoutLeaderboardData[]>([]);

  useEffect(() => {
    if (!auditPayout?.payoutDataHash) return;

    const fetchPayoutData = async () => {
      const payoutData: ISplitPayoutData | undefined = await fetch(ipfsTransformUri(auditPayout.payoutDataHash)).then((res) =>
        res.json()
      );
      if (!payoutData) return;

      const totalRewardInToken = +ethers.utils.formatUnits(auditPayout.totalPaidOut ?? "0", vault.stakingTokenDecimals);
      const totalRewardInUSD = totalRewardInToken * (auditPayout.payoutData?.vault?.amountsInfo?.tokenPriceUsd ?? 1);
      const totalPercentage = payoutData.beneficiaries.reduce((acc, curr) => acc + Number(curr.percentageOfPayout), 0);

      const auditLeaderboard: IAuditPayoutLeaderboardData[] = payoutData.beneficiaries.reduce((acc, curr) => {
        const existingBeneficiary = acc.find(
          (beneficiary) => beneficiary.beneficiary.toLowerCase() === curr.beneficiary.toLowerCase()
        );

        const findingRewardUsd = (Number(curr.percentageOfPayout) / totalPercentage) * totalRewardInUSD;
        const findingRewardTokens = (Number(curr.percentageOfPayout) / totalPercentage) * totalRewardInToken;
        const findingSeverityName = parseSeverityName(curr.severity);

        if (existingBeneficiary) {
          existingBeneficiary.totalFindings += 1;
          existingBeneficiary.totalRewards.usd += findingRewardUsd;
          existingBeneficiary.totalRewards.tokens += findingRewardTokens;
          const existingFinding = existingBeneficiary.findings.find((finding) => finding.severity === findingSeverityName);
          if (existingFinding) {
            existingFinding.count += 1;
            existingFinding.totalRewards.usd += findingRewardUsd;
            existingFinding.totalRewards.tokens += findingRewardTokens;
          } else {
            existingBeneficiary.findings.push({
              severity: findingSeverityName,
              count: 1,
              totalRewards: { usd: findingRewardUsd, tokens: findingRewardTokens },
            });
          }
        } else {
          acc.push({
            beneficiary: curr.beneficiary.toLowerCase(),
            rewardToken: auditPayout.payoutData?.vault?.stakingTokenSymbol ?? "",
            totalRewards: { usd: findingRewardUsd, tokens: findingRewardTokens },
            findings: [
              { severity: findingSeverityName, count: 1, totalRewards: { usd: findingRewardUsd, tokens: findingRewardTokens } },
            ],
            totalFindings: 1,
          });
        }
        return acc;
      }, [] as IAuditPayoutLeaderboardData[]);

      auditLeaderboard.sort((a, b) => b.totalRewards.usd - a.totalRewards.usd);

      setLeaderboardData(auditLeaderboard);
    };

    fetchPayoutData();
  }, [auditPayout, vault]);

  if (!auditPayout) return [];

  return leaderboardData;
};
