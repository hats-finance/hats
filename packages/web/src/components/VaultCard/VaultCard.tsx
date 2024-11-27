import { IPayoutGraph, IVault } from "@hats.finance/shared";
import ArrowIcon from "@mui/icons-material/ArrowForwardOutlined";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";
import WarnIcon from "@mui/icons-material/WarningAmberRounded";
import HatsTokenIcon from "assets/icons/hats-logo-circle.svg";
import { Button, HackerProfileImage, Pill, VaultAssetsPillsList, WithTooltip } from "components";
import { queryClient } from "config/reactQuery";
import { IPFS_PREFIX } from "constants/constants";
import { defaultAnchorProps } from "constants/defaultAnchorProps";
import { ethers } from "ethers";
import { useAuditFrameGame } from "hooks/auditFrameGame";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import useConfirm from "hooks/useConfirm";
import useModal from "hooks/useModal";
import { useVaultApy } from "hooks/vaults/useVaultApy";
import millify from "millify";
import moment from "moment";
import { RoutePaths } from "navigation";
import { CreateProfileFormModal } from "pages/HackerProfile/components";
import { useProfileByAddress, useProfileByUsername } from "pages/HackerProfile/hooks";
import { HoneypotsRoutePaths } from "pages/Honeypots/router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { HATS_STAKING_VAULT } from "settings";
import { ipfsTransformUri } from "utils";
import { numberWithThousandSeparator } from "utils/amounts.utils";
import { slugify } from "utils/slug.utils";
import { useAccount } from "wagmi";
import { OptedInList } from "./OptedInList";
import { closeRegTimeBeforeCompetition } from "./consts";
import { ONE_LINER_FALLBACK } from "./oneLinerFallback";
import { ApyPill, StyledVaultCard } from "./styles";

type VaultCardProps = {
  vaultData?: IVault;
  auditPayout?: IPayoutGraph;
  reducedStyles?: boolean;
  noActions?: boolean;
  noDeployed?: boolean;
  hideAmounts?: boolean;
  hideStatusPill?: boolean;
  hideLogo?: boolean;
  hideSubmit?: boolean;
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
 * @param hideStatusPill - Hide the status pill.
 * @param hideLogo - Hide the logo.
 * @param hideSubmit - Hide the submit vulnerability button.
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
  hideStatusPill = false,
  hideLogo = false,
  hideSubmit = false,
}: VaultCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { address } = useAccount();
  const { tryAuthentication } = useSiweAuth();

  const { data: createdProfile, isLoading: isLoadingProfile } = useProfileByAddress(address);
  const { isShowing: isShowingCreateProfile, show: showCreateProfile, hide: hideCreateProfile } = useModal();

  const vault = vaultData ?? auditPayout?.payoutData?.vault;
  const showIntended = (vaultData && vaultData.amountsInfo?.showCompetitionIntendedAmount) ?? false;
  const vaultApy = useVaultApy(vault);
  const { isUserOptedIn, optIn, optOut } = useAuditFrameGame(vault?.id);
  const isHatsVault = HATS_STAKING_VAULT.address.toLowerCase() === vault?.id;

  const isOptInOpen = useMemo(() => {
    const startTime = vault?.description?.["project-metadata"].starttime;

    if (!startTime || startTime - closeRegTimeBeforeCompetition < new Date().getTime() / 1000) {
      return false;
    }
    return true;
  }, [vault]);

  const getVaultDate = (full = false) => {
    if (!vault || !vault.description) return null;

    const starttime = (vault.description["project-metadata"].starttime ?? 0) * 1000;
    const endtime = (vault.description["project-metadata"].endtime ?? 0) * 1000;

    if (!starttime || !endtime) return null;

    const startYear = moment(starttime).format("YYYY");
    const endYear = moment(endtime).format("YYYY");
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
      date: full
        ? `${startMonth} ${startDay} ${startYear} - ${endMonth} ${endDay}  ${endYear}`
        : `${startMonth} ${startDay} - ${endMonth} ${endDay}`,
      time: moment(endtime).toDate().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "shortOffset",
      }),
    };
  };

  const totalPaidOutOnAudit = useMemo(() => {
    if (!vault) return undefined;
    if (!auditPayout) return undefined;

    const inTokens = +ethers.utils.formatUnits(auditPayout.totalPaidOut ?? "0", vault.stakingTokenDecimals);

    return {
      tokens: inTokens,
      usd: inTokens * (auditPayout.payoutData?.vault?.amountsInfo?.tokenPriceUsd ?? 0),
    };
  }, [auditPayout, vault]);

  const curatorInfo = vault?.description?.["project-metadata"].curator;
  const { data: curatorProfile, isLoading: isLoadingCuratorProfile } = useProfileByUsername(curatorInfo?.username);

  if (!vault || !vault.description) return null;

  const activeClaim = vault.activeClaim;
  const isAudit = vault.description["project-metadata"].type === "audit";
  const isContinuousAudit = vault.description["project-metadata"].isContinuousAudit;
  const isPrivateAudit = vault.description["project-metadata"].isPrivateAudit;
  const logo = vault.description["project-metadata"].icon;
  const name = vault.description["project-metadata"].name;
  const projectWebsite = vault.description["project-metadata"].website;
  const description =
    vault.description["project-metadata"].oneLiner ??
    ONE_LINER_FALLBACK[vault.id] ??
    "Nulla facilisi. Donec nec dictum eros. Cras et velit viverra, dapibus velit fringilla, bibendum mi aptent. Class aptent taciti sociosqu ad litora.";

  const bonusPointsEnabled = vault.description?.["project-metadata"]?.bonusPointsEnabled;

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
      const isFinished = endTime.diff(moment(), "seconds") < 0;
      return (
        <div>
          <Pill transparent dotColor="yellow" text={`${isFinished ? t("finished") : t("ending")} ${endTime.fromNow()}`} />
        </div>
      );
    } else {
      return (
        <div>
          <Pill transparent dotColor="blue" text={t("liveNow")} />
        </div>
      );
    }
  };

  const getContinuousAuditPill = () => {
    const repo = vault.description?.scope?.reposInformation.find((repo) => repo.isMain);
    const prevHash = repo?.prevAuditedCommitHash?.slice(0, 7);
    const currentHash = repo?.commitHash?.slice(0, 7);

    if (!prevHash || !currentHash) return null;

    return (
      <WithTooltip text={t("continuousAuditCompetitionExplanation")}>
        <div className="continuous-comp-hashes">
          <Pill capitalize={false} transparent text={`${prevHash}`} />
          <ArrowIcon />
          <Pill capitalize={false} transparent text={`${currentHash}`} />
        </div>
      </WithTooltip>
    );
  };

  const getCuratorPill = (style: "vertical" | "horizontal" = "horizontal") => {
    // Curated by HATS
    if (!curatorInfo || !curatorInfo.username) {
      return (
        <WithTooltip text={t("curatorOfTheCompetition")}>
          <div className={`curator-pill ${style}`}>
            <img src={HatsTokenIcon} alt="hats logo" className="hats-logo" />
            <p>{t("curatedByHats")}</p>
          </div>
        </WithTooltip>
      );
    } else {
      if (isLoadingCuratorProfile) return null;

      return (
        <WithTooltip text={t("curatorOfTheCompetition")}>
          <div className={`curator-pill ${style}`}>
            <HackerProfileImage size={style === "vertical" ? "xsmall" : "xxsmall"} hackerProfile={curatorProfile} noMargin />
            <p>{t(`CuratorForm.${curatorInfo.role}`)}</p>
          </div>
        </WithTooltip>
      );
    }
  };

  const getAPYPill = () => {
    if (isAudit) return null;

    return (
      <ApyPill>
        <div className="content-apy">
          {t("apy")} <span>{`${numberWithThousandSeparator(vaultApy[0].apy)}%`}</span>
        </div>
        <div className="bg" />
      </ApyPill>
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

  const optInOrOut = async () => {
    if (!vault || isLoadingProfile) return;

    const isAuth = await tryAuthentication();
    if (!isAuth) return;

    if (!createdProfile) {
      const wantToCreateProfile = await confirm({
        title: t("AuditFrameGame.createWhiteHatProfile"),
        description: t("AuditFrameGame.createProfileExplanation"),
        cancelText: t("no"),
        confirmText: t("createProfile"),
      });
      if (!wantToCreateProfile) return;

      return showCreateProfile();
    }

    if (isUserOptedIn) {
      const wantToOptOut = await confirm({
        title: t("AuditFrameGame.optOutFromAuditCompetition"),
        titleIcon: <WarnIcon className="mr-2" fontSize="large" />,
        description: t("AuditFrameGame.optOutFromAuditCompetitionConfirmation"),
        cancelText: t("no"),
        confirmText: t("AuditFrameGame.yesOptOut"),
      });

      if (!wantToOptOut) return;
      await optOut.mutateAsync({ editSessionIdOrAddress: vault.id });
      queryClient.invalidateQueries({ queryKey: ["opted-in-list", vault.id] });
    } else {
      await optIn.mutateAsync({ editSessionIdOrAddress: vault.id });
      queryClient.invalidateQueries({ queryKey: ["opted-in-list", vault.id] });
    }
  };

  return (
    <StyledVaultCard
      isAudit={isAudit}
      isContinuousAudit={!!isContinuousAudit}
      reducedStyles={reducedStyles}
      hasActiveClaim={!!activeClaim}
      showIntendedAmount={showIntended}
      isHatsVault={isHatsVault}
    >
      {!hideStatusPill && (
        <div className="pills mb-5">
          {isAudit && getAuditStatusPill()}
          {isContinuousAudit && getContinuousAuditPill()}
          {isAudit && getCuratorPill()}
          {!reducedStyles && vaultApy && vaultApy.length > 0 && getAPYPill()}
        </div>
      )}
      {!!activeClaim && !reducedStyles && getActiveClaimBanner()}

      <div className="vault-info">
        <div className="metadata">
          {!hideLogo && <img onClick={goToProjectWebsite} src={ipfsTransformUri(logo, { isPinned: !noDeployed })} alt="logo" />}
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
            {reducedStyles && isPrivateAudit && <p className="private-audit-indicator">{t("privateAuditCompetition")}</p>}
          </div>
        </div>

        <div className="stats">
          {/* Curator for paid competitions */}
          {hideStatusPill && reducedStyles && <div className="stats__stat">{getCuratorPill("vertical")}</div>}
          <div className="stats__stat">
            {isAudit ? (
              <>
                {auditPayout ? (
                  <>
                    <h3 className="value">
                      {vault.amountsInfo
                        ? vault.amountsInfo.depositedAmount.usd !== 0
                          ? `~$${millify(vault.amountsInfo.depositedAmount.usd)}`
                          : `${vault.stakingTokenSymbol} ${millify(vault.amountsInfo.depositedAmount.tokens)}`
                        : "-"}
                    </h3>
                    <div className="sub-value">{t("maxRewards")}</div>
                  </>
                ) : (
                  <>
                    <WithTooltip text={getVaultDate(true)?.date}>
                      <h3 className="value">{getVaultDate()?.date}</h3>
                    </WithTooltip>
                    <div className="sub-value">{getVaultDate()?.time}</div>
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
                      {auditPayout
                        ? `${totalPaidOutOnAudit?.usd !== 0 ? "~$" : `${vault.stakingTokenSymbol} `}${millify(
                            (totalPaidOutOnAudit?.usd || totalPaidOutOnAudit?.tokens) ?? 0
                          )}`
                        : showIntended
                        ? `~$${millify(vault.amountsInfo?.competitionIntendedAmount?.maxReward.usd ?? 0)}`
                        : `~$${millify(vault.amountsInfo?.maxRewardAmount.usd ?? 0)}`}
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

          {reducedStyles && !hideSubmit && (
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
            <div className="assets-list">
              <span className="subtitle">{auditPayout ? t("paidAssets") : t("assetsInVault")}</span>
              <VaultAssetsPillsList auditPayout={auditPayout} vaultData={vaultData} />
            </div>
            <OptedInList editSessionIdOrAddress={vault.id} />
          </div>
          <div className="actions">
            {!isAudit && (
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
            {isAudit && vault.dateStatus === "on_time" && !auditPayout && !hideSubmit && bonusPointsEnabled && (
              <Button
                disabled={noActions}
                size="medium"
                filledColor={isAudit ? "primary" : "secondary"}
                styleType="outlined"
                onClick={goToSubmitVulnerability}
              >
                {t("claimFixAndTest")}
              </Button>
            )}
            {(!isAudit || (isAudit && vault.dateStatus === "on_time" && !auditPayout)) && !hideSubmit && (
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
            {isOptInOpen && !isLoadingProfile && isAudit && vault.dateStatus === "upcoming" && !auditPayout && (
              <Button
                size="medium"
                styleType={isUserOptedIn ? "outlined" : "filled"}
                disabled={optIn.isLoading || optOut.isLoading}
                onClick={optInOrOut}
              >
                {optIn.isLoading || optOut.isLoading
                  ? isUserOptedIn
                    ? t("AuditFrameGame.optingOut")
                    : t("AuditFrameGame.optingIn")
                  : isUserOptedIn
                  ? t("AuditFrameGame.optOutFromAuditCompetition")
                  : t("AuditFrameGame.optInToAuditCompetition")}
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

      <CreateProfileFormModal isShowing={isShowingCreateProfile} onHide={hideCreateProfile} />
    </StyledVaultCard>
  );
};
