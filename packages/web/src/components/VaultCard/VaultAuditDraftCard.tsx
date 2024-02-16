import { IEditedSessionResponse } from "@hats.finance/shared";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";
import WarnIcon from "@mui/icons-material/WarningAmberRounded";
import { Button, Pill, WithTooltip } from "components";
import { queryClient } from "config/reactQuery";
import { useAuditFrameGame } from "hooks/auditFrameGame";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import useConfirm from "hooks/useConfirm";
import { useIsGovMember } from "hooks/useIsGovMember";
import useModal from "hooks/useModal";
import millify from "millify";
import moment from "moment";
import { RoutePaths } from "navigation";
import { CreateProfileFormModal } from "pages/HackerProfile/components";
import { useProfileByAddress } from "pages/HackerProfile/hooks";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ipfsTransformUri } from "utils";
import { useAccount } from "wagmi";
import { OptedInList } from "./OptedInList";
import { closeRegTimeBeforeCompetition } from "./consts";
import { StyledVaultCard } from "./styles";

type VaultAuditDraftCardProps = {
  vaultDraft: IEditedSessionResponse & { dateStatus: "on_time" | "upcoming" | "finished" };
};

/**
 * Render the vault card for audit drafts.
 *
 * @param vaultDraft - The edit session data for draft vaults
 */
export const VaultAuditDraftCard = ({ vaultDraft }: VaultAuditDraftCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { address } = useAccount();
  const { tryAuthentication } = useSiweAuth();
  const { isUserOptedIn, optIn, optOut } = useAuditFrameGame(vaultDraft._id);

  const { data: createdProfile, isLoading: isLoadingProfile } = useProfileByAddress(address);
  const { isShowing: isShowingCreateProfile, show: showCreateProfile, hide: hideCreateProfile } = useModal();

  const isGovMember = useIsGovMember();

  const isOptInOpen = useMemo(() => {
    const startTime = vaultDraft.editedDescription["project-metadata"].starttime;

    if (!startTime || startTime - closeRegTimeBeforeCompetition < new Date().getTime() / 1000) {
      return false;
    }
    return true;
  }, [vaultDraft]);

  const vaultDate = useMemo(() => {
    const starttime = (vaultDraft.editedDescription["project-metadata"].starttime ?? 0) * 1000;
    const endtime = (vaultDraft.editedDescription["project-metadata"].endtime ?? 0) * 1000;

    if (!starttime || !endtime) return null;

    const startMonth = moment(starttime).format("MMMM");

    return {
      date: startMonth,
    };
  }, [vaultDraft]);

  if (!vaultDraft || !vaultDraft.editedDescription) return null;

  const isAudit = true;
  const logo = vaultDraft.editedDescription["project-metadata"].icon;
  const name = vaultDraft.editedDescription["project-metadata"].name;
  const projectWebsite = vaultDraft.editedDescription["project-metadata"].website;
  const description = vaultDraft.editedDescription["project-metadata"].oneLiner;

  const getAuditStatusPill = () => {
    if (!vaultDraft.editedDescription) return null;
    if (!vaultDraft.editedDescription["project-metadata"].endtime) return null;

    if (vaultDraft.dateStatus === "upcoming") {
      return (
        <div className="mb-4">
          <Pill transparent dotColor="yellow" text={t("upcoming")} />
        </div>
      );
    }

    const endTime = moment(vaultDraft.editedDescription["project-metadata"].endtime * 1000);

    if (endTime.diff(moment(), "hours") <= 24) {
      return (
        <div className="mb-4">
          <Pill transparent dotColor="yellow" text={`${t("endingSoon")} ${endTime.fromNow()}`} />
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

  const goToEditSession = async () => {
    if (!isGovMember) return;
    if (!vaultDraft._id) return;

    navigate(`${RoutePaths.vault_editor}/${vaultDraft._id}`);
  };

  const optInOrOut = async () => {
    if (!vaultDraft || !vaultDraft._id || isLoadingProfile) return;

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
      await optOut.mutateAsync({ editSessionIdOrAddress: vaultDraft._id });
      queryClient.invalidateQueries({ queryKey: ["opted-in-list", vaultDraft._id] });
    } else {
      await optIn.mutateAsync({ editSessionIdOrAddress: vaultDraft._id });
      queryClient.invalidateQueries({ queryKey: ["opted-in-list", vaultDraft._id] });
    }
  };

  return (
    <StyledVaultCard isAudit={isAudit} reducedStyles={false} showIntendedAmount={true} hasActiveClaim={false}>
      {isAudit && getAuditStatusPill()}

      <div className="vault-info">
        <div className="metadata">
          <img onClick={goToProjectWebsite} src={ipfsTransformUri(logo, { isPinned: !vaultDraft.pinned })} alt="logo" />
          <div className="name-description">
            <h3 className="name">{name}</h3>
            <p className="description">{description}</p>
          </div>
        </div>

        <div className="stats">
          <div className="stats__stat">
            <>
              <h3 className="value">{vaultDate?.date}</h3>
              <div className="sub-value">{t("comingIn")}</div>
            </>
          </div>
          <div className="stats__stat intended-on-audits">
            <>
              <WithTooltip text={t("intendedValueExplanation")}>
                <h3 className="value">
                  ~$
                  {millify(vaultDraft.editedDescription["project-metadata"].intendedCompetitionAmount ?? 0)}
                </h3>
              </WithTooltip>
              <div className="sub-value">{t("intendedRewards")}</div>
            </>
          </div>
        </div>

        {isGovMember && (
          <div className="draft-actions">
            <Button className="mt-3" size="medium" onClick={goToEditSession}>
              {t("goToEditSession")}
            </Button>
          </div>
        )}
        {!isLoadingProfile && (
          <div className="draft-actions">
            <OptedInList editSessionIdOrAddress={vaultDraft._id} />
            {isOptInOpen && (
              <Button
                className="mt-3"
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
          </div>
        )}
      </div>

      <CreateProfileFormModal isShowing={isShowingCreateProfile} onHide={hideCreateProfile} />
    </StyledVaultCard>
  );
};
