import InfoIcon from "@mui/icons-material/InfoOutlined";
import { Seo, VaultAuditDraftCard, VaultCard, VaultCardSkeleton, VaultFundingProtocol, WithTooltip } from "components";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useTranslation } from "react-i18next";
import {
  getFundingProtocolVaults,
  useAuditCompetitionsVaults,
  useDraftAuditCompetitions,
  useOldAuditCompetitions,
} from "./hooks";
import { StyledVaultsPage } from "./styles";

export const AuditVaultsPage = () => {
  const { t } = useTranslation();
  const { vaultsReadyAllChains } = useVaults();

  const {
    live: liveAuditCompetitions,
    upcoming: upcomingAuditCompetitions,
    finished: finishedAuditPayouts,
    preparingPayout: preparingPayoutAuditCompetitions,
  } = useAuditCompetitionsVaults();

  const oldAudits = useOldAuditCompetitions();
  const allFinishedAuditCompetitions = [...finishedAuditPayouts, ...(oldAudits ?? [])];

  const draftAudits = useDraftAuditCompetitions();
  const fundingProtocolVaults = getFundingProtocolVaults();

  return (
    <>
      <Seo title={t("seo.auditCompetitionsTitle")} />
      <StyledVaultsPage className="content-wrapper-md">
        {!vaultsReadyAllChains && (
          <div className="vaults-container mt-4">
            <h2 className="subtitle">{t("liveCompetitions")}</h2>
            <VaultCardSkeleton className="mb-5" />
            <h2 className="subtitle mt-5">{t("upcomingCompetitions")}</h2>
            <VaultCardSkeleton className="mb-5" />
            <h2 className="subtitle mt-5">{t("finishedCompetitions")}</h2>
            <VaultCardSkeleton className="mb-5" />
            <VaultCardSkeleton className="mb-5 mt-5" />
            <VaultCardSkeleton className="mb-5 mt-5" />
          </div>
        )}

        {liveAuditCompetitions.length > 0 && (
          <>
            <h2 className="subtitle">{t("liveCompetitions")}</h2>
            <div className="vaults-container mt-4">
              {liveAuditCompetitions.map((auditVault, idx) => (
                <VaultCard key={auditVault.id + idx} vaultData={auditVault} />
              ))}
            </div>
          </>
        )}

        {(upcomingAuditCompetitions.length > 0 || draftAudits.length > 0) && (
          <>
            <h2 className="subtitle">{t("upcomingCompetitions")}</h2>
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

        {fundingProtocolVaults.length > 0 && (
          <>
            <h2 className="subtitle">{t("protocolsFunding")}</h2>
            <div className="vaults-container mt-4">
              {fundingProtocolVaults.map((fundingProtocolVault, idx) => (
                <VaultFundingProtocol key={fundingProtocolVault.name + idx} fundingProtocolVault={fundingProtocolVault} />
              ))}
            </div>
          </>
        )}

        {preparingPayoutAuditCompetitions.length > 0 && (
          <>
            <h2 className="subtitle">
              {t("preparingPayoutCompetitions")}{" "}
              <WithTooltip text={t("preparingPayoutCompetitionsExplanation")}>
                <InfoIcon className="icon" fontSize="inherit" />
              </WithTooltip>
            </h2>
            <div className="vaults-container mt-4">
              {preparingPayoutAuditCompetitions.map((auditVault, idx) => (
                <VaultCard key={auditVault.id + idx} vaultData={auditVault} />
              ))}
            </div>
          </>
        )}

        {allFinishedAuditCompetitions.length > 0 && (
          <>
            <h2 className="subtitle">{t("finishedCompetitions")}</h2>
            <div className="vaults-container mt-4">
              {allFinishedAuditCompetitions.map((auditPayout, idx) => (
                <VaultCard key={(auditPayout.id ?? 0) + idx} auditPayout={auditPayout} />
              ))}
            </div>
          </>
        )}
      </StyledVaultsPage>
    </>
  );
};
