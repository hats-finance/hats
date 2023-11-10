import { IPayoutGraph, ISplitPayoutData, IVault } from "@hats-finance/shared";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { ipfsTransformUri } from "utils";
import { parseSeverityName } from "utils/severityName";

export type IAuditPayoutLeaderboardData = {
  beneficiary: string;
  totalRewardInUSD: number;
  findings: { severity: string; count: number }[];
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
        const existingBeneficiary = acc.find((beneficiary) => beneficiary.beneficiary === curr.beneficiary);

        const findingReward = (Number(curr.percentageOfPayout) / totalPercentage) * totalRewardInUSD;
        const findingSeverityName = parseSeverityName(curr.severity);

        if (existingBeneficiary) {
          existingBeneficiary.totalFindings += 1;
          existingBeneficiary.totalRewardInUSD += findingReward;
          const existingFinding = existingBeneficiary.findings.find((finding) => finding.severity === findingSeverityName);
          if (existingFinding) {
            existingFinding.count += 1;
          } else {
            existingBeneficiary.findings.push({ severity: findingSeverityName, count: 1 });
          }
        } else {
          acc.push({
            beneficiary: curr.beneficiary,
            totalRewardInUSD: findingReward,
            findings: [{ severity: findingSeverityName, count: 1 }],
            totalFindings: 1,
          });
        }
        return acc;
      }, [] as IAuditPayoutLeaderboardData[]);

      auditLeaderboard.sort((a, b) => b.totalRewardInUSD - a.totalRewardInUSD);

      setLeaderboardData(auditLeaderboard);
    };

    fetchPayoutData();
  }, [auditPayout, vault]);

  if (!auditPayout) return [];

  return leaderboardData;
};
