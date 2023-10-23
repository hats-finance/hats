import { IPayoutGraph, IVault } from "@hats-finance/shared";
import ArrowIcon from "@mui/icons-material/ArrowForwardOutlined";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";
import WarnIcon from "@mui/icons-material/WarningAmberRounded";
import { Button, Pill, VaultAssetsPillsList, WithTooltip } from "components";
import { IPFS_PREFIX } from "constants/constants";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { ethers } from "ethers";
import useConfirm from "hooks/useConfirm";
import millify from "millify";
import moment from "moment";
import { RoutePaths } from "navigation";
import { HoneypotsRoutePaths } from "pages/Honeypots/router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ipfsTransformUri } from "utils";
import { slugify } from "utils/slug.utils";
import { ONE_LINER_FALLBACK } from "./oneLinerFallback";
import { StyledVaultCard } from "./styles";

type VaultCardProps = {
  vaultData?: IVault;
  auditPayout?: IPayoutGraph;
  reducedStyles?: boolean;
  noActions?: boolean;
  noDeployed?: boolean;
  hideAmounts?: boolean;
};

/**
 * Render the vault card. It works with bug bounty vaults and audit competitions.
 *
 * @param vaultData - The vault data.
 * @param auditPayout - The payout data for finished audit competitions.
 * @param reduced - Reduced styles, showing less information. (used on vault details page)
 * @param noActions - Disable the actions buttons. (mainly for vault preview)
 * @param noDeployed - if the vault is not deployed. (this is for showing images from the right source -> ipfs or backend)
 * @param hideAmounts - Hide the amounts. (used on vault details page)
 *
 * @remarks
 * For bug bounties and live/upcoming audit competitions, the vault data is passed as `vaultData`.
 * For finished audit competitions, this component uses the payout data, and is passed as `auditPayout`.
 */
export const VaultCard = ({
  vaultData,
  auditPayout,
  reducedStyles = false,
  noActions = false,
  noDeployed = false,
  hideAmounts = false,
}: VaultCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const vault = vaultData ?? auditPayout?.payoutData?.vault;
  const showIntended = (vaultData && vaultData.amountsInfo?.showCompetitionIntendedAmount) ?? false;

  const vaultDate = useMemo(() => {
    if (!vault || !vault.description) return null;

    const starttime = (vault.description["project-metadata"].starttime ?? 0) * 1000;
    const endtime = (vault.description["project-metadata"].endtime ?? 0) * 1000;

    if (!starttime || !endtime) return null;

    const startMonth = moment(starttime).format("MMM");
    const endMonth = moment(endtime).format("MMM");
    const startDay = moment(starttime).format("DD");
    const endDay = moment(endtime).format("DD");

    if (auditPayout) {
      return {
        date: moment(endtime).fromNow(),
        time: `${moment(endtime).diff(moment(starttime), "days")} days`,
      };
    }

    return {
      date: startMonth !== endMonth ? `${startMonth} ${startDay}-${endMonth} ${endDay}` : `${startMonth} ${startDay}-${endDay}`,
      time: moment(endtime).toDate().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "shortOffset",
      }),
    };
  }, [vault, auditPayout]);

  const totalPaidOutOnAudit = useMemo(() => {
    if (!vault) return undefined;
    if (!auditPayout) return undefined;

    const inTokens = +ethers.utils.formatUnits(auditPayout.totalPaidOut ?? "0", vault.stakingTokenDecimals);

    return {
      tokens: inTokens,
      usd: inTokens * (auditPayout.payoutData?.vault?.amountsInfo?.tokenPriceUsd ?? 0),
    };
  }, [auditPayout, vault]);

  if (!vault || !vault.description) return null;

  const activeClaim = vault.activeClaim;
  const isAudit = vault.description["project-metadata"].type === "audit";
  const isContinuousAudit = vault.description["project-metadata"].isContinuousAudit;
  const logo = vault.description["project-metadata"].icon;
  const name = vault.description["project-metadata"].name;
  const projectWebsite = vault.description["project-metadata"].website;
  const description =
    vault.description["project-metadata"].oneLiner ??
    ONE_LINER_FALLBACK[vault.id] ??
    "Nulla facilisi. Donec nec dictum eros. Cras et velit viverra, dapibus velit fringilla, bibendum mi aptent. Class aptent taciti sociosqu ad litora.";

  const getAuditStatusPill = () => {
    if (!vault.description) return null;
    if (!vault.description["project-metadata"].endtime) return null;
    if (!vault.description["project-metadata"].starttime) return null;

    if (auditPayout) {
      return <Pill transparent dotColor="green" text={t("paidCompetition")} />;
    }

    if (vault.dateStatus === "upcoming") {
      const startTime = moment(vault.description["project-metadata"].starttime * 1000);

      if (startTime.diff(moment(), "hours") <= 24) {
        return <Pill transparent dotColor="yellow" text={`${t("starting")} ${startTime.fromNow()}`} />;
      }

      return <Pill transparent dotColor="yellow" text={t("upcoming")} />;
    }

    const endTime = moment(vault.description["project-metadata"].endtime * 1000);

    if (endTime.diff(moment(), "hours") <= 24) {
      return (
        <div className="mb-4">
          <Pill transparent dotColor="yellow" text={`${t("ending")} ${endTime.fromNow()}`} />
        </div>
      );
    } else {
      return (
        <div className="mb-4">
          <Pill transparent dotColor="blue" text={t("liveNow")} />
        </div>
      );
    }
  };

  const getContinuousAuditPill = () => {
    const repo = vault.description?.scope?.reposInformation.find((repo) => repo.isMain);
    const prevHash = repo?.prevAuditedCommitHash?.slice(0, 18);
    const currentHash = repo?.commitHash?.slice(0, 18);

    if (!prevHash || !currentHash) return null;

    return (
      <WithTooltip text={t("continuousAuditCompetitionExplanation")}>
        <div className="continuous-comp-hashes">
          <Pill capitalize={false} transparent text={`${prevHash}...`} />
          <ArrowIcon />
          <Pill capitalize={false} transparent text={`${currentHash}...`} />
        </div>
      </WithTooltip>
    );
  };

  const getActiveClaimBanner = () => {
    const openClaimDescription = () => window.open(`${IPFS_PREFIX}/${vault.activeClaim?.claim}`, "_blank");

    return (
      <div className="active-claim-banner" onClick={openClaimDescription}>
        <WarnIcon />
        <p>{t("vaultPausedActiveClaimExplanation")}</p>
      </div>
    );
  };

  const goToProjectWebsite = async () => {
    if (!projectWebsite) return;

    const wantToGo = await confirm({
      title: t("goToProjectWebsite"),
      titleIcon: <OpenIcon className="mr-2" fontSize="large" />,
      description: t("doYouWantToGoToProjectWebsite", { website: projectWebsite }),
      cancelText: t("no"),
      confirmText: t("yesGo"),
    });

    if (!wantToGo) return;
    window.open(projectWebsite, "_blank");
  };

  const goToDeposits = () => {
    if (!vault) return;
    if (noActions) return;

    const mainRoute = `/${isAudit ? HoneypotsRoutePaths.audits : HoneypotsRoutePaths.bugBounties}`;
    const vaultSlug = slugify(name);

    navigate(`${mainRoute}/${vaultSlug}-${vault.id}/deposits`);
  };

  const goToSubmitVulnerability = () => {
    if (noActions) return;
    navigate(`${RoutePaths.vulnerability}?projectId=${vault.id}`);
  };

  const goToLeaderboard = () => {
    if (!vault) return;
    if (noActions) return;

    const mainRoute = `/${isAudit ? HoneypotsRoutePaths.audits : HoneypotsRoutePaths.bugBounties}`;
    const vaultSlug = slugify(name);

    navigate(`${mainRoute}/${vaultSlug}-${vault.id}/leaderboard`);
  };

  const goToDetails = () => {
    if (!vault) return;
    if (noActions) return;

    const mainRoute = `/${isAudit ? HoneypotsRoutePaths.audits : HoneypotsRoutePaths.bugBounties}`;
    const vaultSlug = slugify(name);

    navigate(`${mainRoute}/${vaultSlug}-${vault.id}`);
  };

  return (
    <StyledVaultCard
      isAudit={isAudit}
      isContinuousAudit={!!isContinuousAudit}
      reducedStyles={reducedStyles}
      hasActiveClaim={!!activeClaim}
      showIntendedAmount={showIntended}
    >
      <div className="pills mb-4">
        {isAudit && getAuditStatusPill()}
        {isContinuousAudit && getContinuousAuditPill()}
      </div>
      {!!activeClaim && !reducedStyles && getActiveClaimBanner()}

      <div className="vault-info">
        <div className="metadata">
          <img onClick={goToProjectWebsite} src={ipfsTransformUri(logo, { isPinned: !noDeployed })} alt="logo" />
          <div className="name-description">
            <h3 className="name">{name}</h3>
            {!reducedStyles && <p className="description">{description}</p>}
            {reducedStyles && (
              <a
                className="website"
                href={projectWebsite.includes("http") ? projectWebsite : `//${projectWebsite}`}
                {...defaultAnchorProps}
              >
                {projectWebsite}
              </a>
            )}
          </div>
        </div>

        <div className="stats">
          {/* {!isAudit && (
            <div className="stats__stat">
              <h3 className="value">5%</h3>
              <div className="sub-value">APY</div>
            </div>
          )} */}
          <div className="stats__stat">
            {isAudit ? (
              <>
                {auditPayout ? (
                  <>
                    <h3 className="value">~${vault.amountsInfo ? millify(vault.amountsInfo.depositedAmount.usd) : "-"}</h3>
                    <div className="sub-value">{t("maxRewards")}</div>
                  </>
                ) : (
                  <>
                    <h3 className="value">{vaultDate?.date}</h3>
                    <div className="sub-value">{vaultDate?.time}</div>
                  </>
                )}
              </>
            ) : (
              <>
                <h3 className="value">~${vault.amountsInfo ? millify(vault.amountsInfo.depositedAmount.usd) : "-"}</h3>
                <div className="sub-value">{t("totalDeposits")}</div>
              </>
            )}
          </div>
          {!hideAmounts && (
            <div className="stats__stat intended-on-audits">
              {isAudit ? (
                <>
                  <WithTooltip text={showIntended ? t("intendedValueExplanation") : undefined}>
                    <h3 className="value">
                      ~$
                      {auditPayout
                        ? millify(totalPaidOutOnAudit?.usd ?? 0)
                        : showIntended
                        ? millify(vault.amountsInfo?.competitionIntendedAmount?.deposited.usd ?? 0)
                        : millify(vault.amountsInfo?.maxRewardAmount.usd ?? 0)}
                    </h3>
                  </WithTooltip>
                  <div className="sub-value">
                    {auditPayout ? t("paidRewards") : showIntended ? t("intendedRewards") : t("maxRewards")}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="value">~${vault.amountsInfo ? millify(vault.amountsInfo.maxRewardAmount.usd) : "-"}</h3>
                  <div className="sub-value">{t("maxRewards")}</div>
                </>
              )}
            </div>
          )}

          {reducedStyles && (
            <>
              {(!isAudit || (isAudit && vault.dateStatus === "on_time" && !auditPayout)) && (
                <div className="stats__stat">
                  <Button
                    disabled={noActions}
                    size="medium"
                    filledColor={isAudit ? "primary" : "secondary"}
                    onClick={goToSubmitVulnerability}
                  >
                    {t("submitVulnerability")}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {!reducedStyles && (
        <div className="vault-actions">
          <div className="assets">
            <span className="subtitle">{auditPayout ? t("paidAssets") : t("assetsInVault")}</span>
            <VaultAssetsPillsList auditPayout={auditPayout} vaultData={vaultData} />
          </div>
          <div className="actions">
            {(!isAudit || (isAudit && vault.dateStatus !== "finished" && !auditPayout)) && (
              <Button
                disabled={noActions}
                size="medium"
                filledColor={isAudit ? "primary" : "secondary"}
                styleType="outlined"
                onClick={goToDeposits}
              >
                {t("deposits")}
              </Button>
            )}
            {(!isAudit || (isAudit && vault.dateStatus === "on_time" && !auditPayout)) && (
              <Button
                disabled={noActions}
                size="medium"
                filledColor={isAudit ? "primary" : "secondary"}
                styleType="outlined"
                onClick={goToSubmitVulnerability}
              >
                {t("submitVulnerability")}
              </Button>
            )}
            {!auditPayout && (
              <Button size="medium" filledColor={isAudit ? "primary" : "secondary"} onClick={goToDetails}>
                {isAudit ? (isContinuousAudit ? t("continuousCompetitionDetails") : t("competitionDetails")) : t("bountyDetails")}
              </Button>
            )}
            {auditPayout && auditPayout.payoutDataHash && (
              <Button
                size="medium"
                styleType="outlined"
                filledColor={isAudit ? "primary" : "secondary"}
                onClick={goToLeaderboard}
              >
                {t("seeCompetitionLeaderboard")}
              </Button>
            )}
          </div>
        </div>
      )}
    </StyledVaultCard>
  );
};
