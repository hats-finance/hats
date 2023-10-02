import { Alert, Button, Seo, VaultCard, VaultCardSkeleton } from "components";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useTranslation } from "react-i18next";
import { useAuditCompetitionsVaults, useOldAuditCompetitions } from "./hooks";
import { StyledVaultsPage } from "./styles";

export const PrivateAuditVaultsPage = () => {
  const { t } = useTranslation();
  const { tryAuthentication, isAuthenticated } = useSiweAuth();
  const { vaultsReadyAllChains } = useVaults();

  const {
    live: livePrivAuditCompetitions,
    upcoming: upcomingPrivAuditCompetitions,
    finished: finishePrivAuditPayouts,
  } = useAuditCompetitionsVaults({ private: true });

  const oldAudits = useOldAuditCompetitions();
  const allFinishedAuditCompetitions = [...finishePrivAuditPayouts, ...(oldAudits ?? [])];

  const areVaultsToShow =
    livePrivAuditCompetitions.length > 0 || upcomingPrivAuditCompetitions.length > 0 || finishePrivAuditPayouts.length > 0;

  if (!isAuthenticated) {
    return (
      <StyledVaultsPage className="content-wrapper-md">
        <Alert className="mb-4" type="error">
          {t("pleaseSignInWithEthereumToSeePrivateComps")}
        </Alert>
        <Button onClick={tryAuthentication} className="mt-4">
          {t("signInWithEthereum")}
        </Button>
      </StyledVaultsPage>
    );
  }

  return (
    <>
      <Seo title={t("seo.auditCompetitionsTitle")} />
      <StyledVaultsPage className="content-wrapper-md">
        {!vaultsReadyAllChains && (
          <div className="vaults-container mt-4">
            <h2 className="subtitle">{t("livePrivateCompetitions")}</h2>
            <VaultCardSkeleton className="mb-5" />
            <h2 className="subtitle mt-5">{t("upcomingPrivateCompetitions")}</h2>
            <VaultCardSkeleton className="mb-5" />
            <h2 className="subtitle mt-5">{t("finishedPrivateCompetitions")}</h2>
            <VaultCardSkeleton className="mb-5" />
            <VaultCardSkeleton className="mb-5 mt-5" />
            <VaultCardSkeleton className="mb-5 mt-5" />
          </div>
        )}

        {!areVaultsToShow && (
          <Alert className="mb-4" type="error">
            {t("youAreNotInvitedToAnyPrivateComps")}
          </Alert>
        )}

        {livePrivAuditCompetitions.length > 0 && (
          <>
            <h2 className="subtitle">{t("livePrivateCompetitions")}</h2>
            <div className="vaults-container mt-4">
              {livePrivAuditCompetitions.map((auditVault, idx) => (
                <VaultCard key={auditVault.id + idx} vaultData={auditVault} />
              ))}
            </div>
          </>
        )}

        {upcomingPrivAuditCompetitions.length > 0 && (
          <>
            <h2 className="subtitle">{t("upcomingPrivateCompetitions")}</h2>
            <div className="vaults-container mt-4">
              {upcomingPrivAuditCompetitions.map((auditVault, idx) => (
                <VaultCard key={auditVault.id + idx} vaultData={auditVault} />
              ))}
            </div>
          </>
        )}

        {allFinishedAuditCompetitions.length > 0 && (
          <>
            <h2 className="subtitle">{t("finishedPrivateCompetitions")}</h2>
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
