import { IEditedSessionResponse, IPayoutGraph, oasis } from "@hats.finance/shared";
import { useQuery } from "@tanstack/react-query";
import { FundingProtocolVault } from "components/VaultCard/VaultFundingProtocol";
import { axiosClient } from "config/axiosClient";
import { useExcludedFinishedCompetitions } from "hooks/globalSettings/useExcludedFinishedCompetitions";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useIsGovMember } from "hooks/useIsGovMember";
import { useIsReviewer } from "hooks/useIsReviewer";
import { useEffect, useMemo } from "react";
import { BASE_SERVICE_URL, IS_PROD, appChains } from "settings";
import { useNetwork } from "wagmi";
import * as auditDraftsService from "./auditDraftsService";

/**
 * Returns the live/upcoming/finished private audit competitions
 *
 * @remarks
 * - The finished competitions are gotten from the payouts.
 * - Only invited users or governance can access to private audits.
 */
export const useAuditCompetitionsVaults = (opts: { private: boolean } = { private: false }) => {
  const { tryAuthentication, profileData } = useSiweAuth();
  const { allVaultsOnEnv, allPayoutsOnEnv } = useVaults();
  const isGovMember = useIsGovMember();
  const isReviewer = useIsReviewer();

  const { data: excludedFinishedCompetitions, isLoading: isLoadingExclusions } = useExcludedFinishedCompetitions();

  useEffect(() => {
    if (opts.private) tryAuthentication();
  }, [tryAuthentication, opts.private]);

  const auditCompetitionsVaults =
    allVaultsOnEnv
      ?.filter((vault) => vault.registered && !vault.destroyed)
      .filter((vault) => vault.description?.["project-metadata"].type === "audit")
      .filter((vault) => {
        const isPrivateAudit = vault.description?.["project-metadata"].isPrivateAudit;
        const isUserInvited = vault.description?.["project-metadata"].whitelist?.some(
          (whiteAddress) => whiteAddress.address.toLowerCase() === profileData?.address?.toLowerCase()
        );

        return opts.private ? isPrivateAudit && (isUserInvited || isGovMember || isReviewer) : !isPrivateAudit;
      }) ?? [];

  const paidPayoutsFromAudits = allPayoutsOnEnv
    ?.filter((payout) => payout.isApproved)
    .filter((payout) => payout.payoutData?.vault?.description?.["project-metadata"].type === "audit")
    .filter((payout) => {
      const isPrivateAudit = !!payout.payoutData?.vault?.description?.["project-metadata"].isPrivateAudit;
      const isUserInvited = payout.payoutData?.vault?.description?.["project-metadata"].whitelist?.some(
        (whiteAddress) => whiteAddress.address.toLowerCase() === profileData?.address?.toLowerCase()
      );

      return opts.private
        ? isPrivateAudit && (isUserInvited || isGovMember || isReviewer)
        : !isPrivateAudit || payout.payoutData?.vault?.dateStatus === "finished";
    });

  const preparingPayoutAudits = useMemo(() => {
    if (isLoadingExclusions) return [];

    return (
      allVaultsOnEnv
        ?.filter((vault) => vault.registered && !vault.destroyed)
        ?.filter((vault) => vault.description?.["project-metadata"].type === "audit")
        ?.filter((vault) => !excludedFinishedCompetitions?.includes(vault.id))
        ?.filter((vault) => {
          const isFinished = vault.dateStatus === "finished";
          const noApprovedPayout =
            allPayoutsOnEnv?.filter((payout) => payout.isApproved).find((payout) => payout.payoutData?.vault?.id === vault.id) ===
            undefined;

          return isFinished && noApprovedPayout;
        }) ?? []
    );
  }, [isLoadingExclusions, excludedFinishedCompetitions, allVaultsOnEnv, allPayoutsOnEnv]);

  auditCompetitionsVaults.sort((a, b) => (b.amountsInfo?.depositedAmount.usd ?? 0) - (a.amountsInfo?.depositedAmount.usd ?? 0));
  paidPayoutsFromAudits?.sort(
    (a, b) =>
      (b.payoutData?.vault?.description?.["project-metadata"].starttime
        ? +b.payoutData?.vault?.description?.["project-metadata"].starttime
        : 0) -
      (a.payoutData?.vault?.description?.["project-metadata"].starttime
        ? +a.payoutData?.vault?.description?.["project-metadata"].starttime
        : 0)
  );
  preparingPayoutAudits?.sort(
    (a, b) =>
      (b.description?.["project-metadata"].starttime ? +b.description?.["project-metadata"].starttime : 0) -
      (a.description?.["project-metadata"].starttime ? +a.description?.["project-metadata"].starttime : 0)
  );

  return {
    live: auditCompetitionsVaults?.filter((vault) => vault.dateStatus === "on_time") ?? [],
    upcoming: auditCompetitionsVaults?.filter((vault) => vault.dateStatus === "upcoming") ?? [],
    preparingPayout: preparingPayoutAudits,
    finished: paidPayoutsFromAudits ?? [],
  };
};

export const useBugBountiesVaults = () => {
  const { activeVaults } = useVaults();

  const bugBounties =
    activeVaults
      ?.filter((vault) => vault.registered && !vault.destroyed)
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

/**
 * Returns all the funding protocol vaults
 */
export const getFundingProtocolVaults = (): FundingProtocolVault[] => {
  return [
    {
      name: "Oasis",
      logo: "ipfs://QmWN4J8pdSjTYfuMxSzAA7hDNghXmP7VMy5waGHRVMVKPn",
      description:
        "The Oasis Network is a Layer 1 decentralized blockchain network, renowned for its scalability, privacy-first approach, and versatility. To enhance security and reliability across projects, the Oasis Network has introduced Ecosystem Audit Grants. These grants aim to minimize misuse, ensure project integrity, and cultivate a developer community well-versed in the Confidential EVM.",
      chain: oasis.id,
      address: "0x6f980cF50c8592fd93219f3291dD727218B21442",
      website: "https://oasisprotocol.org/",
      token: {
        address: undefined,
        icon: "ipfs://QmWN4J8pdSjTYfuMxSzAA7hDNghXmP7VMy5waGHRVMVKPn",
        decimals: "18",
        symbol: "ROSE",
      },
    },
  ];
};
