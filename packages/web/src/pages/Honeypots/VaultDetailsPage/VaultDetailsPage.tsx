import { IVault } from "@hats-finance/shared";
import { Alert, Loading, Seo, VaultCard } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import { RoutePaths } from "navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { HoneypotsRoutePaths } from "../router";
import { VaultDepositsSection, VaultRewardsSection, VaultScopeSection } from "./Sections";
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
];

type VaultDetailsPageProps = {
  vaultToUse?: IVault;
  noActions?: boolean;
};

export const VaultDetailsPage = ({ vaultToUse, noActions = false }: VaultDetailsPageProps) => {
  const { t } = useTranslation();

  const { allVaults } = useVaults();
  const navigate = useNavigate();
  const { vaultSlug, sectionId } = useParams();
  const vaultId = vaultSlug?.split("-").pop();
  const vault = vaultToUse ?? allVaults?.find((vault) => vault.id === vaultId);

  const [openSectionId, setOpenSectionId] = useState(sectionId ?? DETAILS_SECTIONS[0].title);

  if (allVaults?.length === 0) return <Loading extraText={`${t("loadingVaultDetails")}...`} />;
  if (!vault || !vault.description) {
    redirect("/");
    return null;
  }

  const activeClaim = vault.activeClaim;
  const isAudit = vault.description["project-metadata"].type === "audit";
  const vaultName = vault.description["project-metadata"].name;

  const navigateToType = () => {
    navigate(`${RoutePaths.vaults}/${isAudit ? HoneypotsRoutePaths.audits : HoneypotsRoutePaths.bugBounties}`);
  };

  const changeDetailsSection = (sectionTitle: string) => {
    setOpenSectionId(sectionTitle);

    if (vaultSlug) {
      navigate(
        `${RoutePaths.vaults}/${
          isAudit ? HoneypotsRoutePaths.audits : HoneypotsRoutePaths.bugBounties
        }/${vaultSlug}/${sectionTitle}`,
        { replace: true }
      );
    }
  };

  const SectionToRender =
    DETAILS_SECTIONS.find((section) => section.title === openSectionId)?.component ?? DETAILS_SECTIONS[0].component;

  return (
    <>
      <Seo title={`${vaultName} ${isAudit ? t("auditCompetition") : t("bugBounty")}`} />
      <StyledVaultDetailsPage className="content-wrapper" isAudit={isAudit}>
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
          <VaultCard noActions={noActions} reducedStyles vaultData={vault} />
        </div>

        <div className="sections-tabs">
          {DETAILS_SECTIONS.filter((section) => (noActions ? section.title !== "deposits" : true)).map((section) => (
            <StyledSectionTab
              onClick={() => changeDetailsSection(section.title)}
              active={openSectionId === section.title}
              key={section.title}
            >
              <h4>{t(section.title)}</h4>
            </StyledSectionTab>
          ))}
        </div>

        <div className="section-container">{SectionToRender && <SectionToRender vault={vault} />}</div>
      </StyledVaultDetailsPage>
    </>
  );
};
