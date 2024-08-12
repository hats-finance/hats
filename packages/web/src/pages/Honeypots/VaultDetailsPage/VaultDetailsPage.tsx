import { IVault } from "@hats.finance/shared";
import axios from "axios";
import { Alert, Button, Loading, Seo, VaultCard } from "components";
import { axiosClient } from "config/axiosClient";
import { queryClient } from "config/reactQuery";
import { useVaults } from "hooks/subgraph/vaults/useVaults";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAccount, useSignMessage } from "wagmi";
import { useAuditCompetitionsVaults, useOldAuditCompetitions } from "../VaultsPage/hooks";
import { HoneypotsRoutePaths } from "../router";
import { VaultDepositsSection, VaultRewardsSection, VaultScopeSection, VaultSubmissionsSection } from "./Sections";
import { VaultLeaderboardSection } from "./Sections/VaultLeaderboardSection/VaultLeaderboardSection";
import { useCollectMessageSignature, useSavedSubmissions, useUserHasCollectedSignature } from "./hooks";
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
  const { address: account } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const { allVaults } = useVaults();
  const navigate = useNavigate();
  const { vaultSlug, sectionId } = useParams();
  const vaultId = vaultSlug?.split("-").pop();
  const vault = vaultToUse ?? allVaults?.find((vault) => vault.id === vaultId);
  const isAudit = vault?.description?.["project-metadata"].type === "audit";
  const requireMessageSignature = vault?.description?.["project-metadata"].requireMessageSignature;

  // // Extra check: Eurler CTF
  // useEffect(() => {
  //   if (!account) return;

  //   // Euler CTF
  //   if (vault?.id.toLowerCase() === "0xb526415bf0b6742c0538135ce096cdfdfe3688a2") {
  //     const checkEuler = async () => {
  //       const res = await axios.post("https://data.euler.finance/trm-address-checker-hatsfinancectf", { address: account });
  //       console.log(res.data);
  //     };
  //     checkEuler();
  //   }
  // }, [vault, account]);

  const { data: userHasCollectedSignature, isLoading } = useUserHasCollectedSignature(vault);
  const {
    mutateAsync: collectMessageSignature,
    isLoading: isCollectingMessageSignature,
    error: errorCollectingSig,
  } = useCollectMessageSignature();

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

  if (allVaults?.length === 0 || isLoading) return <Loading extraText={`${t("loadingVaultDetails")}...`} />;
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

  const onMessageSignatureRequest = async () => {
    if (!account) return;
    if (!vault.description?.["project-metadata"].requireMessageSignature) return;

    const messageToSign = vault.description?.["project-metadata"].messageToSign;
    if (!messageToSign) return alert("No message to sign. Please contact Hats Finance Team.");

    const signature = await signMessageAsync({ message: messageToSign });

    try {
      await collectMessageSignature({ vaultAddress: vault.id, signature, expectedAddress: account });
      queryClient.invalidateQueries({ queryKey: ["vault-message-signatures", vault.id] });
    } catch (error) {
      console.log(error);
    }
  };

  const SectionToRender =
    DETAILS_SECTIONS.find((section) => section.title === openSectionId)?.component ?? DETAILS_SECTIONS[0].component;

  const getMainContent = () => {
    if (requireMessageSignature) {
      if (!account) {
        return (
          <Alert className="mt-5 mb-5" type="warning">
            {t("pleaseConnectYourWallet")}
          </Alert>
        );
      }

      if (!userHasCollectedSignature) {
        return (
          <div className="mt-5">
            <Alert className="mt-5 mb-5" type="warning">
              {t("youNeedToSignMessageToParticipate", { vaultType: isAudit ? t("auditCompetition") : t("bugBounty") })}
            </Alert>

            <Button onClick={onMessageSignatureRequest}>{t("signMessageToParticipate")}</Button>

            {errorCollectingSig && (
              <Alert className="mt-5 mb-5" type="error">
                <>
                  {t("error")}: {(errorCollectingSig.response?.data as any)?.error}
                </>
              </Alert>
            )}
          </div>
        );
      }
    }

    return (
      <>
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
      </>
    );
  };

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
          <VaultCard
            noActions={noActions}
            reducedStyles
            vaultData={vault}
            noDeployed={noDeployed}
            hideAmounts={!!auditPayout}
            hideSubmit={requireMessageSignature && !userHasCollectedSignature}
          />
        </div>

        {getMainContent()}

        {isCollectingMessageSignature && <Loading fixed extraText={`${t("collectingMessageSignature")}...`} />}
      </StyledVaultDetailsPage>
    </>
  );
};
