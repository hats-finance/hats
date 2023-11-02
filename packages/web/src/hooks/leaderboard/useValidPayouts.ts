import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useMemo } from "react";

export const useValidPayouts = () => {
  const { allPayoutsOnEnv, allVaults } = useVaults();

  const validPayouts = useMemo(() => {
    if (!allPayoutsOnEnv || !allVaults) return [];
    const payouts = allPayoutsOnEnv.filter((payout) => payout.payoutData);
    for (const payout of payouts) {
      payout.vaultData = allVaults.find((vault) => vault.id === payout.vault.id);
    }

    return payouts;
  }, [allPayoutsOnEnv, allVaults]);

  return validPayouts;
};
