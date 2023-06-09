import { Alert, Loading, Seo, VaultCard } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import { RoutePaths } from "navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { HoneypotsRoutePaths } from "../router";
import { VaultDepositsSection, VaultRewardsSection, VaultScopeSection, VaultSubmissionsSection } from "./Sections";
import { StyledSectionTab, StyledVaultDetailsPage } from "./styles";

const DETAILS_SECTIONS = [
  {
    title: "rewards",
    component: <VaultRewardsSection />,
  },
  {
    title: "scope",
    component: <VaultScopeSection />,
  },
  {
    title: "deposits",
    component: <VaultDepositsSection />,
  },
  {
    title: "submissions",
    component: <VaultSubmissionsSection />,
  },
];

export const VaultDetailsPage = () => {
  const { t } = useTranslation();
  const [openSection, setOpenSection] = useState(0);

  const { allVaults } = useVaults();
  const navigate = useNavigate();
  const { vaultSlug } = useParams();
  const vaultId = vaultSlug?.split("-").pop();
  const vault = allVaults?.find((vault) => vault.id === vaultId);

  if (allVaults?.length === 0) return <Loading extraText={`${t("loadingVaultDetails")}...`} />;
  if (!vault || !vault.description) {
    redirect("/");
    return null;
  }

  const activeClaim = vault.activeClaim;
  const isAudit = vault.description["project-metadata"].type === "audit";
  const vaultLogo = vault.description["project-metadata"].icon;
  const vaultName = vault.description["project-metadata"].name;

  const navigateToType = () => {
    navigate(`${RoutePaths.vaults}/${isAudit ? HoneypotsRoutePaths.audits : HoneypotsRoutePaths.bugBounties}`);
  };

  return (
    <>
      <Seo title={`${vaultName} ${isAudit ? t("auditCompetition") : t("bugBounty")}`} />
      <StyledVaultDetailsPage className="content-wrapper" isAudit={isAudit}>
        <div className="breadcrumb">
          <span className="type" onClick={navigateToType}>
            {isAudit ? t("auditCompetitions") : t("bugBounties")}/
          </span>
          <span className="name">{vaultName}</span>
        </div>

        {!!activeClaim && (
          <Alert className="mt-5 mb-5" type="warning">
            {t("vaultPausedActiveClaimExplanationLong")}
          </Alert>
        )}

        <div className="mt-5">
          <VaultCard reducedStyles vaultData={vault} />
        </div>

        <div className="sections-tabs">
          {DETAILS_SECTIONS.map((section, idx) => (
            <StyledSectionTab onClick={() => setOpenSection(idx)} active={openSection === idx} key={section.title}>
              <span>{t(section.title)}</span>
            </StyledSectionTab>
          ))}
        </div>

        <div className="section-container">{DETAILS_SECTIONS[openSection].component}</div>
      </StyledVaultDetailsPage>
    </>
  );
};
