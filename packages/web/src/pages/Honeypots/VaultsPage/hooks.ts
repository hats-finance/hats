import { IEditedSessionResponse, IPayoutGraph, isAddressAMultisigMember } from "@hats-finance/shared";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "config/axiosClient";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useEffect, useState } from "react";
import { BASE_SERVICE_URL, IS_PROD, appChains } from "settings";
import { useAccount, useNetwork } from "wagmi";
import * as auditDraftsService from "./auditDraftsService";

/**
 * Returns the live/upcoming/finished private audit competitions
 *
 * @remarks
 * - The finished competitions are gotten from the payouts.
 * - Only invited users or governance can access to private audits.
 */
export const useAuditCompetitionsVaults = (opts: { private: boolean } = { private: false }) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { tryAuthentication, profileData } = useSiweAuth();
  const { allVaultsOnEnv, allPayoutsOnEnv } = useVaults();
  const [isGovMember, setIsGovMember] = useState(false);

  useEffect(() => {
    if (opts.private) tryAuthentication();
  }, [tryAuthentication, opts.private]);

  useEffect(() => {
    const checkGovMember = async () => {
      if (address && chain && chain.id) {
        const chainId = Number(chain.id);
        const govMultisig = appChains[Number(chainId)]?.govMultisig;

        const isGov = await isAddressAMultisigMember(govMultisig, address, chainId);
        setIsGovMember(isGov);
      }
    };
    checkGovMember();
  }, [address, chain]);

  const auditCompetitionsVaults =
    allVaultsOnEnv
      ?.filter((vault) => vault.registered)
      .filter((vault) => vault.description?.["project-metadata"].type === "audit")
      .filter((vault) => {
        const isPrivateAudit = vault.description?.["project-metadata"].isPrivateAudit;
        const isUserInvited = vault.description?.["project-metadata"].whitelist?.some(
          (whiteAddress) => whiteAddress.address.toLowerCase() === profileData?.address?.toLowerCase()
        );

        return opts.private ? isPrivateAudit && (isUserInvited || isGovMember) : !isPrivateAudit;
      }) ?? [];

  const paidPayoutsFromAudits = allPayoutsOnEnv
    ?.filter((payout) => payout.isApproved)
    .filter((payout) => payout.payoutData?.vault?.description?.["project-metadata"].type === "audit")
    .filter((payout) => {
      const isPrivateAudit = payout.payoutData?.vault?.description?.["project-metadata"].isPrivateAudit;
      const isUserInvited = payout.payoutData?.vault?.description?.["project-metadata"].whitelist?.some(
        (whiteAddress) => whiteAddress.address.toLowerCase() === profileData?.address?.toLowerCase()
      );

      return opts.private ? isPrivateAudit && (isUserInvited || isGovMember) : !isPrivateAudit;
    });

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
