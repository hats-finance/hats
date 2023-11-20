import { ISplitPayoutData } from "@hats-finance/shared";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useMemo } from "react";

/**
 * Returns all the valid (with valid data and description) payouts
 */
export const usePayoutsFromAddresses = (addresses: string[] = []) => {
  const { allPayoutsOnEnv, allVaults } = useVaults();
  const addressesToUse = useMemo(() => addresses.map((a) => a.toLowerCase()), [addresses]);

  const validPayouts = useMemo(() => {
    if (!allPayoutsOnEnv || !allVaults) return [];
    const payouts = allPayoutsOnEnv.filter((payout) => payout.isApproved && payout.payoutData);
    for (const payout of payouts) {
      payout.vaultData = allVaults.find((vault) => vault.id === payout.vault.id);
    }

    const payoutsByAddresses = payouts.filter((payout) => {
      if (!payout.payoutData) return false;

      if (payout.payoutData.type === "single") {
        return addressesToUse.includes(payout.payoutData.beneficiary.toLowerCase());
      } else if (payout.payoutData.type === "split") {
        return addressesToUse.some((add) =>
          (payout.payoutData as ISplitPayoutData).beneficiaries.some((ben) => add === ben.beneficiary.toLowerCase())
        );
      }
      return false;
    });

    return payoutsByAddresses;
  }, [allPayoutsOnEnv, allVaults, addressesToUse]);

  return validPayouts;
};
