import { Pill, Seo, VaultAuditDraftCard, VaultCard, VaultCardSkeleton } from "components";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useTranslation } from "react-i18next";
import { useAuditCompetitionsVaults, useBugBountiesVaults, useDraftAuditCompetitions } from "./hooks";
import { StyledVaultsPage } from "./styles";

export const BugBountyVaultsPage = () => {
  const { t } = useTranslation();
  const { vaultsReadyAllChains } = useVaults();

  const { live: liveAuditCompetitions, upcoming: upcomingAuditCompetitions } = useAuditCompetitionsVaults();
  const bugBounties = useBugBountiesVaults();

  const draftAudits = useDraftAuditCompetitions();

  return (
    <>
      <Seo title={t("seo.bugBountiesTitle")} />
      <StyledVaultsPage className="content-wrapper-md">
        {!vaultsReadyAllChains && (
          <div className="vaults-container mt-4">
            <h2 className="subtitle">{t("bugBounties")}</h2>
            <VaultCardSkeleton className="mb-5" />
            <VaultCardSkeleton className="mb-5 mt-5" />
            <VaultCardSkeleton className="mb-5 mt-5" />
            <VaultCardSkeleton className="mb-5 mt-5" />
            <VaultCardSkeleton className="mb-5 mt-5" />
          </div>
        )}

        {liveAuditCompetitions.length > 0 && (
          <>
            <h2 className="subtitle">
              {t("auditCompetitions")}
              <Pill dotColor="blue" text={t("new")} transparent />
            </h2>
            <div className="vaults-container mt-4">
              {liveAuditCompetitions.map((auditVault, idx) => (
                <VaultCard key={auditVault.id + idx} vaultData={auditVault} />
              ))}
            </div>
          </>
        )}

        {(upcomingAuditCompetitions.length > 0 || draftAudits.length > 0) && (
          <>
            <h2 className="subtitle">
              {t("upcomingCompetitions")}
              <Pill dotColor="blue" text={t("new")} transparent />
            </h2>
            <div className="vaults-container mt-4">
              {upcomingAuditCompetitions.map((auditVault, idx) => (
                <VaultCard key={auditVault.id + idx} vaultData={auditVault} />
              ))}
              {draftAudits.map((auditDraft, idx) => (
                <VaultAuditDraftCard key={auditDraft._id ?? "" + idx} vaultDraft={auditDraft} />
              ))}
            </div>
          </>
        )}

        <h2 className="subtitle mt-5">{t("bugBounties")}</h2>
        <div className="vaults-container mt-4">
          {bugBounties.map((bountyVault, idx) => (
            <VaultCard key={bountyVault.id + idx} vaultData={bountyVault} />
          ))}
        </div>
      </StyledVaultsPage>
    </>
  );
};
