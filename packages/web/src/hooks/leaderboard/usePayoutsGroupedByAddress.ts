import { ISplitPayoutData } from "@hats.finance/shared";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useMemo } from "react";

export type IPayoutsTimeframe = "all" | "90days" | "365days";

/**
 * Returns all the valid (with valid data and description) payouts grouped by address
 */
export const usePayoutsGroupedByAddress = (timeframe: IPayoutsTimeframe = "all") => {
  const { allPayoutsOnEnv, allVaults } = useVaults();

  const getStartAndEndDate = useMemo(() => {
    const now = new Date();
    const start = new Date();
    const end = new Date();

    if (timeframe === "90days") {
      start.setDate(now.getDate() - 90);
    } else if (timeframe === "365days") {
      start.setDate(now.getDate() - 365);
    } else if (timeframe === "all") {
      return { start: undefined, end: undefined };
    }

    return { start, end };
  }, [timeframe]);

  const validPayouts = useMemo(() => {
    if (!allPayoutsOnEnv || !allVaults) return [];
    const payouts = allPayoutsOnEnv.filter((payout) => payout.isApproved && payout.payoutData);
    for (const payout of payouts) {
      payout.vaultData = allVaults.find((vault) => vault.id === payout.vault.id);
    }

    // Filter by timeframe
    if (getStartAndEndDate.start && getStartAndEndDate.end) {
      const payoutsInTimeframe = payouts.filter((payout) => {
        const payoutDate = new Date((payout.approvedAt ? +payout.approvedAt : 0) * 1000);
        return payoutDate >= getStartAndEndDate.start && payoutDate <= getStartAndEndDate.end;
      });
      return payoutsInTimeframe;
    }

    const payoutsWithData = payouts.filter((payout) => !!payout.payoutData);
    return payoutsWithData;
  }, [allPayoutsOnEnv, allVaults, getStartAndEndDate]);

  const payoutsGroupedByAddress = useMemo(() => {
    const payoutsByAddresses = validPayouts.reduce((acc, curr) => {
      if (!curr.payoutData) return acc;

      if (curr.payoutData.type === "single") {
        const address = curr.payoutData.beneficiary.toLowerCase();
        if (!acc[address]) acc[address] = [];
        acc[address].push(curr);
      } else if (curr.payoutData.type === "split") {
        for (const ben of (curr.payoutData as ISplitPayoutData).beneficiaries) {
          const address = ben.beneficiary.toLowerCase();
          if (acc[address] && acc[address].some((p) => p.id === curr.id)) continue;
          if (!acc[address]) acc[address] = [];
          acc[address].push(curr);
        }
      }
      return acc;
    }, {} as Record<string, typeof validPayouts>);

    return payoutsByAddresses;
  }, [validPayouts]);

  return payoutsGroupedByAddress;
};
