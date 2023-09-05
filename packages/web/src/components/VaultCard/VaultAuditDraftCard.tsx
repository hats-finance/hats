import { IEditedSessionResponse, isAddressAMultisigMember } from "@hats-finance/shared";
import { Button, Pill, WithTooltip } from "components";
import millify from "millify";
import moment from "moment";
import { RoutePaths } from "navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { appChains } from "settings";
import { ipfsTransformUri } from "utils";
import { useAccount, useNetwork } from "wagmi";
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

  const { address } = useAccount();
  const { chain } = useNetwork();

  const [isGovMember, setIsGovMember] = useState(false);

  useEffect(() => {
    const checkGovMember = async () => {
      if (address && chain && chain.id) {
        const chainId = Number(chain.id);
        const govMultisig = appChains[Number(chainId)]?.govMultisig;

        const isGov = await isAddressAMultisigMember(govMultisig, address, chainId);
        setIsGovMember(isGov);
      }
    };
    checkGovMember();
  }, [address, chain]);

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

  const goToProjectWebsite = () => {
    if (!projectWebsite) return;
    window.open(projectWebsite, "_blank");
  };

  const goToEditSession = async () => {
    if (!isGovMember) return;
    if (!vaultDraft._id) return;

    navigate(`${RoutePaths.vault_editor}/${vaultDraft._id}`);
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
          <Button className="mt-3" size="medium" onClick={goToEditSession}>
            {t("goToEditSession")}
          </Button>
        )}
      </div>
    </StyledVaultCard>
  );
};
