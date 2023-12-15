import { IVault } from "@hats.finance/shared";
import { Alert, Loading, Seo, VaultCard } from "components";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAuditCompetitionsVaults, useOldAuditCompetitions } from "../VaultsPage/hooks";
import { HoneypotsRoutePaths } from "../router";
import { VaultDepositsSection, VaultRewardsSection, VaultScopeSection, VaultSubmissionsSection } from "./Sections";
import { VaultLeaderboardSection } from "./Sections/VaultLeaderboardSection/VaultLeaderboardSection";
import { useSavedSubmissions } from "./hooks";
import { StyledSectionTab, StyledVaultDetailsPage } from "./styles";

const DETAILS_SECTIONS = [
  {
    title: "rewards",
    component: VaultRewardsSection,
  },
  {
    title: "scope",
    component: VaultScopeSection,
  },
  {
    title: "deposits",
    component: VaultDepositsSection,
  },
  {
    title: "submissions",
    component: VaultSubmissionsSection,
  },
  {
    title: "leaderboard",
    component: VaultLeaderboardSection,
  },
];

type VaultDetailsPageProps = {
  vaultToUse?: IVault;
  noActions?: boolean;
  noDeployed?: boolean;
};

export const VaultDetailsPage = ({ vaultToUse, noActions = false, noDeployed = false }: VaultDetailsPageProps) => {
  const { t } = useTranslation();

  const { allVaults } = useVaults();
  const navigate = useNavigate();
  const { vaultSlug, sectionId } = useParams();
  const vaultId = vaultSlug?.split("-").pop();
  const vault = vaultToUse ?? allVaults?.find((vault) => vault.id === vaultId);
  const isAudit = vault?.description?.["project-metadata"].type === "audit";

  const { data: savedSubmissions } = useSavedSubmissions(vault);
  const { finished: finishedAuditPayouts } = useAuditCompetitionsVaults();
  const oldAudits = useOldAuditCompetitions();
  const allFinishedAuditCompetitions = [...finishedAuditPayouts, ...(oldAudits ?? [])];

  const auditPayout = allFinishedAuditCompetitions.find((audit) => audit.payoutData?.vault?.id === vaultId);

  const [openSectionId, setOpenSectionId] = useState(sectionId ?? DETAILS_SECTIONS[0].title);

  const DETAILS_SECTIONS_TO_SHOW = useMemo(
    () =>
      DETAILS_SECTIONS.filter((section) => {
        if (section.title === "rewards" && auditPayout) return false;
        if (section.title === "deposits" && (noActions || auditPayout)) return false;
        if (section.title === "submissions" && (!isAudit || !savedSubmissions?.length)) return false;
        if (section.title === "leaderboard" && !auditPayout) return false;
        return true;
      }),
    [noActions, isAudit, auditPayout, savedSubmissions]
  );

  if (allVaults?.length === 0) return <Loading extraText={`${t("loadingVaultDetails")}...`} />;
  if (!vault || !vault.description) {
    return <Loading extraText={`${t("loadingVaultDetails")}...`} />;
  }

  const activeClaim = vault.activeClaim;
  const vaultName = vault.description["project-metadata"].name;

  const navigateToType = () => {
    navigate(`/${isAudit ? HoneypotsRoutePaths.audits : HoneypotsRoutePaths.bugBounties}`);
  };

  const changeDetailsSection = (sectionTitle: string) => {
    setOpenSectionId(sectionTitle);

    if (vaultSlug) {
      navigate(`/${isAudit ? HoneypotsRoutePaths.audits : HoneypotsRoutePaths.bugBounties}/${vaultSlug}/${sectionTitle}`, {
        replace: true,
      });
    }
  };

  const SectionToRender =
    DETAILS_SECTIONS.find((section) => section.title === openSectionId)?.component ?? DETAILS_SECTIONS[0].component;

  return (
    <>
      <Seo title={`${vaultName} ${isAudit ? t("auditCompetition") : t("bugBounty")}`} />
      <StyledVaultDetailsPage className="content-wrapper" isAudit={isAudit} tabsNumber={DETAILS_SECTIONS_TO_SHOW.length}>
        {!noActions && (
          <div className="breadcrumb">
            <span className="type" onClick={navigateToType}>
              {isAudit ? t("auditCompetitions") : t("bugBounties")}/
            </span>
            <span className="name">{vaultName}</span>
          </div>
        )}

        {!!activeClaim && (
          <Alert className="mt-5 mb-5" type="warning">
            {t("vaultPausedActiveClaimExplanationLong")}
          </Alert>
        )}

        <div className="mt-5">
          <VaultCard noActions={noActions} reducedStyles vaultData={vault} noDeployed={noDeployed} hideAmounts={!!auditPayout} />
        </div>

        <div className="sections-tabs">
          {DETAILS_SECTIONS_TO_SHOW.map((section) => (
            <StyledSectionTab
              onClick={() => changeDetailsSection(section.title)}
              active={openSectionId === section.title}
              key={section.title}
            >
              <h4>{t(section.title)}</h4>
            </StyledSectionTab>
          ))}
        </div>

        <div className="section-container">
          {SectionToRender && <SectionToRender vault={vault} noDeployed={noDeployed} auditPayout={auditPayout} />}
        </div>
      </StyledVaultDetailsPage>
    </>
  );
};
