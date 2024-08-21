import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useAllProfiles } from "pages/HackerProfile/useCachedProfile";
import { useMemo } from "react";

export type IPayoutsTimeframe = "all" | "90days" | "365days";

/**
 * Returns all the valid (with valid data and description) payouts grouped by address
 */
export const usePayoutsGroupedByCurator = (timeframe: IPayoutsTimeframe = "all") => {
  const { allPayoutsOnEnv, allVaults } = useVaults();
  const { data: profiles } = useAllProfiles();

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
    if (!allPayoutsOnEnv || !allVaults || !profiles) return [];
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
  }, [allPayoutsOnEnv, allVaults, getStartAndEndDate, profiles]);

  const payoutsGroupedByCurator = useMemo(() => {
    const payoutsByCuratorAddresses = validPayouts.reduce((acc, curr) => {
      if (!curr.payoutData) return acc;
      if (!curr.payoutData.curator) return acc;

      const address = curr.payoutData.curator.address.toLowerCase();

      const profileAddresses =
        profiles?.find((prof) => prof.addresses.map((address) => address.toLowerCase()).includes(address))?.addresses ?? [];
      const profileAddressAdded = Object.keys(acc).find((key) =>
        profileAddresses.map((address) => address.toLowerCase()).includes(key.toLowerCase())
      );

      if (profileAddressAdded) {
        acc[profileAddressAdded].push(curr);
      } else {
        if (!acc[address]) acc[address] = [];
        acc[address].push(curr);
      }

      return acc;
    }, {} as Record<string, typeof validPayouts>);

    return payoutsByCuratorAddresses;
  }, [validPayouts, profiles]);

  return payoutsGroupedByCurator;
};
