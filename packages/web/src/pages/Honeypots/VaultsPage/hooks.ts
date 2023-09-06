import { IEditedSessionResponse, IPayoutGraph } from "@hats-finance/shared";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "config/axiosClient";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { BASE_SERVICE_URL, IS_PROD, appChains } from "settings";
import { useNetwork } from "wagmi";
import * as auditDraftsService from "./auditDraftsService";

/**
 * Returns the live/upcoming/finished audit competitions
 *
 * @remarks
 * The finished competitions are gotten from the payouts.
 */
export const useAuditCompetitionsVaults = () => {
  const { allVaultsOnEnv, allPayoutsOnEnv } = useVaults();
  const auditCompetitionsVaults =
    allVaultsOnEnv
      ?.filter((vault) => vault.registered)
      .filter((vault) => vault.description?.["project-metadata"].type === "audit") ?? [];

  const paidPayoutsFromAudits = allPayoutsOnEnv?.filter(
    (payout) => payout.isApproved && payout.payoutData?.vault?.description?.["project-metadata"].type === "audit"
  );

  auditCompetitionsVaults.sort((a, b) => (b.amountsInfo?.depositedAmount.usd ?? 0) - (a.amountsInfo?.depositedAmount.usd ?? 0));

  return {
    live: auditCompetitionsVaults?.filter((vault) => vault.dateStatus === "on_time") ?? [],
    upcoming: auditCompetitionsVaults?.filter((vault) => vault.dateStatus === "upcoming") ?? [],
    finished: paidPayoutsFromAudits ?? [],
  };
};

export const useBugBountiesVaults = () => {
  const { activeVaults } = useVaults();

  const bugBounties =
    activeVaults
      ?.filter((vault) => vault.registered)
      .filter(
        (vault) => !vault.description?.["project-metadata"].type || vault.description?.["project-metadata"].type === "normal"
      ) ?? [];

  bugBounties.sort((a, b) => (b.amountsInfo?.maxRewardAmount.usd ?? 0) - (a.amountsInfo?.maxRewardAmount.usd ?? 0));

  return bugBounties;
};

/**
 * Returns all the past audit competitions (old version) from the database
 */
export const useOldAuditCompetitions = (): IPayoutGraph[] => {
  const { chain } = useNetwork();
  const connectedChain = chain ? appChains[chain.id] : null;
  // If we're in production, show mainnet. If not, show the connected network (if any, otherwise show testnets)
  const showTestnets = !IS_PROD && connectedChain?.chain.testnet;

  const { data } = useQuery<IPayoutGraph[]>({
    queryKey: ["old-audit-competitions"],
    queryFn: async () => {
      const res = await axiosClient.get(`${BASE_SERVICE_URL}/utils/old-audits`);
      return res.data.audits;
    },
    refetchOnWindowFocus: false,
  });

  if (!data) return [];

  return data.filter((audit) =>
    showTestnets
      ? appChains[audit.payoutData!.vault!.chainId].chain.testnet
      : !appChains[audit.payoutData!.vault!.chainId].chain.testnet
  );
};

/**
 * Returns all the draft audit competitions from the database
 */
export const useDraftAuditCompetitions = (): (IEditedSessionResponse & { dateStatus: "on_time" | "upcoming" | "finished" })[] => {
  const { chain } = useNetwork();
  const connectedChain = chain ? appChains[chain.id] : null;
  // If we're in production, show mainnet. If not, show the connected network (if any, otherwise show testnets)
  const showTestnets = !IS_PROD && connectedChain?.chain.testnet;

  const { data } = useQuery({
    queryKey: ["draft-audit-competitions"],
    queryFn: auditDraftsService.getUpcomingAuditDrafts,
    refetchOnWindowFocus: false,
  });

  if (!data) return [];

  return data.filter((audit) =>
    showTestnets ? appChains[audit.chainId].chain.testnet : !appChains[audit.chainId].chain.testnet
  );
};
