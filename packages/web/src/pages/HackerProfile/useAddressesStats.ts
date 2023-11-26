import { ISubmittedSubmission, IVault } from "@hats-finance/shared";
import { ethers } from "ethers";
import { useFindingsFromAddresses, usePayoutsFromAddresses } from "hooks/leaderboard";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useCallback, useMemo } from "react";
import { getOldTokenPrice } from "utils/getOldTokenPrice";
import { parseSeverityName } from "utils/severityName";
import { severitiesOrder } from "./constants";

export type IHackerPayoutStats = {
  severity: string;
  count: number;
  rewards: { tokens: number; usd: number };
  submissions: ISubmittedSubmission[];
  stakingTokenSymbol: string;
};

export type IHackerRewardsStats = {
  id: string;
  date: Date;
  vault: IVault | undefined;
  rewards: IHackerPayoutStats["rewards"];
  findings: IHackerPayoutStats[];
  totalFindings: number;
};

export const useAddressesStats = (addresses: string[] = []) => {
  const { vaultsReadyAllChains } = useVaults();
  const payouts = usePayoutsFromAddresses(addresses);
  const findings = useFindingsFromAddresses(addresses);
  const addressesToUse = useMemo(() => addresses.map((a) => a.toLowerCase()), [addresses]);

  /**
   * First submission date of the hacker
   */
  const firstSubmissionDate = useMemo(() => (findings[0] ? new Date(+findings[0].createdAt * 1000) : undefined), [findings]);

  /**
   * Extracts all the stats from all the payouts on a specific vault.
   * This is extracting the data for the addresses passed to the hook.
   */
  const extractPayoutStatsOnVault = useCallback(
    (vaultAddress: string) => {
      const vaultPayouts = payouts.filter((payout) => payout.vault.id === vaultAddress);

      return vaultPayouts.reduce((acc, curr) => {
        const vault = curr.vaultData;
        if (!vault || !vault.description) return acc;

        const isAudit = vault.description?.["project-metadata"].type === "audit";
        const totalRewardInTokens = +ethers.utils.formatUnits(curr.totalPaidOut ?? "0", vault.stakingTokenDecimals);
        // If audit comp and no token price, assume the token price is 1 because is stable coin. If not, dont calculate the usd value
        const tokenPrice = curr.payoutData?.vault?.amountsInfo?.tokenPriceUsd ?? getOldTokenPrice(curr.id) ?? (isAudit ? 1 : 0);

        if (curr.payoutData?.type === "single") {
          const findingSeverityName = parseSeverityName(curr.payoutData.severity);
          const existingFinding = acc.find((finding) => finding.severity === findingSeverityName);

          if (existingFinding) {
            existingFinding.count += 1;
            existingFinding.rewards.tokens += totalRewardInTokens;
            existingFinding.rewards.usd += totalRewardInTokens * tokenPrice;
            if (curr.payoutData.decryptedSubmission) existingFinding.submissions.push(curr.payoutData.decryptedSubmission);
          } else {
            acc.push({
              severity: findingSeverityName,
              count: 1,
              rewards: { tokens: totalRewardInTokens, usd: totalRewardInTokens * tokenPrice },
              submissions: curr.payoutData.decryptedSubmission ? [curr.payoutData.decryptedSubmission] : [],
              stakingTokenSymbol: vault?.stakingTokenSymbol ?? "",
            });
          }
        } else if (curr.payoutData?.type === "split") {
          for (const ben of curr.payoutData.beneficiaries) {
            // If not in the addresses to use, skip
            if (!addressesToUse.includes(ben.beneficiary.toLowerCase())) continue;

            // Total percentage paid out to all beneficiaries (usually 100%)
            const totalPercentage = curr.payoutData.beneficiaries.reduce((acc, curr) => acc + Number(curr.percentageOfPayout), 0);
            const findingRewardInTokens = (Number(ben.percentageOfPayout) / totalPercentage) * totalRewardInTokens;

            const findingSeverityName = parseSeverityName(ben.severity);
            const existingFinding = acc.find((finding) => finding.severity === findingSeverityName);

            if (existingFinding) {
              existingFinding.count += 1;
              existingFinding.rewards.tokens += findingRewardInTokens;
              existingFinding.rewards.usd += findingRewardInTokens * tokenPrice;
              if (ben.decryptedSubmission) existingFinding.submissions.push(ben.decryptedSubmission);
            } else {
              acc.push({
                severity: findingSeverityName,
                count: 1,
                rewards: { tokens: findingRewardInTokens, usd: findingRewardInTokens * tokenPrice },
                submissions: ben.decryptedSubmission ? [ben.decryptedSubmission] : [],
                stakingTokenSymbol: vault?.stakingTokenSymbol ?? "",
              });
            }
          }
        }

        acc.sort((a, b) =>
          severitiesOrder.findIndex((s) => s === a.severity) > severitiesOrder.findIndex((s) => s === b.severity) ? -1 : 1
        );
        return acc;
      }, [] as IHackerPayoutStats[]);
    },
    [addressesToUse, payouts]
  );

  /**
   * All the stats of the hacker in all the vaults
   */
  const hackerRewardStats = useMemo<IHackerRewardsStats[]>(() => {
    const distinctVaults = [...new Set(payouts.map((payout) => payout.vault.id))];

    const vaultsStats = distinctVaults.map((vaultAddress) => {
      const payoutStatsOnVault = extractPayoutStatsOnVault(vaultAddress);
      const payout = payouts.find((payout) => payout.vault.id === vaultAddress)!;

      return {
        id: payout.id,
        date: new Date(+payout.approvedAt! * 1000),
        vault: payout.vaultData,
        rewards: payoutStatsOnVault.reduce(
          (acc, curr) => {
            acc.tokens += curr.rewards.tokens;
            acc.usd += curr.rewards.usd;
            return acc;
          },
          { tokens: 0, usd: 0 }
        ),
        findings: payoutStatsOnVault.reduce((acc, curr) => {
          const existingFinding = acc.find((finding) => finding.severity === curr.severity);
          if (existingFinding) {
            existingFinding.count += curr.count;
          } else {
            acc.push({ ...curr, severity: curr.severity, count: curr.count });
          }
          return acc;
        }, [] as IHackerPayoutStats[]),
        totalFindings: payoutStatsOnVault.reduce((acc, curr) => acc + curr.count, 0),
      };
    });

    vaultsStats.sort((a, b) => (a.date > b.date ? 1 : -1));
    return vaultsStats;
  }, [payouts, extractPayoutStatsOnVault]);

  /**
   * Sum of all the rewards in USD, including all the payouts
   */
  const totalRewardsInUsd = useMemo(() => {
    return hackerRewardStats.reduce((acc, curr) => acc + curr.rewards.usd, 0);
  }, [hackerRewardStats]);

  /**
   * All the findings stats of the hacker in all the vaults
   */
  const findingsGlobalStats = useMemo(() => {
    return hackerRewardStats.reduce((acc, curr) => {
      curr.findings.forEach((finding) => {
        const existingFinding = acc.find((f) => f.severity === finding.severity);
        if (existingFinding) {
          existingFinding.count += finding.count;
          existingFinding.rewards.tokens += finding.rewards.tokens;
          existingFinding.rewards.usd += finding.rewards.usd;
        } else {
          acc.push({ ...finding });
        }
      });

      acc.sort((a, b) =>
        severitiesOrder.findIndex((s) => s === a.severity) > severitiesOrder.findIndex((s) => s === b.severity) ? -1 : 1
      );
      return acc;
    }, [] as IHackerPayoutStats[]);
  }, [hackerRewardStats]);

  return { firstSubmissionDate, hackerRewardStats, totalRewardsInUsd, findingsGlobalStats, isLoading: !vaultsReadyAllChains };
};
