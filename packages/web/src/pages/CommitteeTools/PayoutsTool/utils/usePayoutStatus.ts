import { useMemo } from "react";
import { IPayoutResponse, PayoutStatus } from "@hats-finance/shared";
import { useVaults } from "hooks/vaults/useVaults";

export const usePayoutStatus = (payout?: IPayoutResponse) => {
  const { payouts, allVaults } = useVaults();

  const vault = useMemo(() => allVaults?.find((vault) => vault.id === payout?.vaultInfo.address), [allVaults, payout]);

  /**
   * Get payout status. We only handle the status until 'Executed'. After that, we need to check onchain data. We do
   * this with the subgraph data.
   */
  const payoutStatus = useMemo(() => {
    if (!payout) return;

    if (payout.status === PayoutStatus.Executed) {
      // Check the status on subgraph
      if (vault?.version === "v2") {
        const payoutOnSubgraph = payouts?.find((p) => p.id === payout.payoutClaimId);
        if (payoutOnSubgraph?.isApproved || payoutOnSubgraph?.isDismissed) {
          return payoutOnSubgraph.isApproved ? PayoutStatus.Approved : PayoutStatus.Rejected;
        }
      } else {
        const payoutOnSubgraph = payouts?.find(
          (p) =>
            p.vault.id.toLowerCase() === payout.vaultInfo.address.toLowerCase() &&
            p.beneficiary.toLowerCase() === payout.payoutData.beneficiary.toLowerCase() &&
            Number(p.severityIndex) === Number(payout.payoutData.severityBountyIndex)
        );
        console.log(payoutOnSubgraph);
        if (payoutOnSubgraph?.isApproved || payoutOnSubgraph?.isDismissed) {
          return payoutOnSubgraph.isApproved ? PayoutStatus.Approved : PayoutStatus.Rejected;
        }
      }
    }

    // Return status saved on database
    return payout.status;
  }, [payout, payouts, vault]);

  return payoutStatus;
};
