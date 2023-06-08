import { IPayoutGraph, IVault } from "@hats-finance/shared";
import { Button, Pill } from "components";
import { WithTooltip } from "components/WithTooltip/WithTooltip";
import { ethers } from "ethers";
import millify from "millify";
import moment from "moment";
import { RoutePaths } from "navigation";
import { HoneypotsRoutePaths } from "pages/Honeypots/router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { appChains } from "settings";
import { ipfsTransformUri } from "utils";
import { slugify } from "utils/slug.utils";
import { StyledVaultCard } from "./styles";

type VaultCardProps = {
  vaultData?: IVault;
  auditPayout?: IPayoutGraph;
};

/**
 * Render the vault card. It works with bug bounty vaults and audit competitions.
 *
 * @param vaultData - The vault data.
 * @param auditPayout - The payout data for finished audit competitions.
 *
 * @remarks
 * For bug bounties and live/upcoming audit competitions, the vault data is passed as `vaultData`.
 * For finished audit competitions, this component uses the payout data, and is passed as `auditPayout`.
 */
export const VaultCard = ({ vaultData, auditPayout }: VaultCardProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const vault = vaultData ?? auditPayout?.payoutData?.vault;

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

  const isAudit = vault.description["project-metadata"].type === "audit";
  const logo = vault.description["project-metadata"].icon;
  const name = vault.description["project-metadata"].name;
  const description =
    "Hats is a security protocol that aligns incentives, creating a scalable primitive for a safer Web3 ecosystem.";

  const getVaultAssets = () => {
    if (!vault.description) return null;

    const tokenAddress = vault.stakingToken;
    const token = vault.stakingTokenSymbol;
    const tokenIcon = vault.description["project-metadata"].tokenIcon;
    const tokenNetwork = vault.chainId ? appChains[vault.chainId] : null;

    const goToTokenInformation = () => {
      if (!tokenNetwork) return;
      window.open(tokenNetwork.chain.blockExplorers?.default.url + "/token/" + tokenAddress, "_blank");
    };

    const amountToShowInTokens = auditPayout ? totalPaidOutOnAudit?.tokens : vault.amountsInfo?.depositedAmount.tokens;

    return (
      <>
        <WithTooltip
          text={`${vault.version} | ${auditPayout ? t("paid") : t("deposited")} ~${millify(amountToShowInTokens ?? 0)} ${token}`}
        >
          <div className="token" onClick={goToTokenInformation}>
            <div className="images">
              <img className="logo" src={ipfsTransformUri(tokenIcon)} alt="token" />
              <img className="chain" src={require(`assets/icons/chains/${vault.chainId}.png`)} alt="network" />
            </div>
            <span>{token}</span>
          </div>
        </WithTooltip>
      </>
    );
  };

  const getAuditStatusPill = () => {
    if (!vault.description) return null;
    if (!vault.description["project-metadata"].endtime) return null;

    if (auditPayout) {
      return (
        <div className="mb-4">
          <Pill transparent color="green" text={t("paidCompetition")} />
        </div>
      );
    }

    if (vault.dateStatus === "upcoming") {
      return (
        <div className="mb-4">
          <Pill transparent color="yellow" text={t("upcoming")} />
        </div>
      );
    }

    const endTime = moment(vault.description["project-metadata"].endtime * 1000);

    if (endTime.diff(moment(), "hours") <= 24) {
      return (
        <div className="mb-4">
          <Pill transparent color="yellow" text={`${t("endingSoon")} ${endTime.fromNow()}`} />
        </div>
      );
    } else {
      return (
        <div className="mb-4">
          <Pill transparent color="blue" text={t("liveNow")} />
        </div>
      );
    }
  };

  const goToDeposits = () => {
    if (!vault) return;

    const mainRoute = `${RoutePaths.vaults}/${isAudit ? HoneypotsRoutePaths.audits : HoneypotsRoutePaths.bugBounties}`;
    const vaultSlug = slugify(name);

    navigate(`${mainRoute}/${vaultSlug}-${vault.id}?section=deposits`);
  };

  const goToSubmitVulnerability = () => {
    navigate(`${RoutePaths.vulnerability}?projectId=${vault.id}`);
  };

  const goToDetails = () => {
    if (!vault) return;

    const mainRoute = `${RoutePaths.vaults}/${isAudit ? HoneypotsRoutePaths.audits : HoneypotsRoutePaths.bugBounties}`;
    const vaultSlug = slugify(name);

    navigate(`${mainRoute}/${vaultSlug}-${vault.id}`);
  };

  return (
    <StyledVaultCard isAudit={isAudit}>
      {isAudit && getAuditStatusPill()}

      <div className="vault-info">
        <div className="metadata">
          <img src={ipfsTransformUri(logo)} alt="logo" />
          <div className="name-description">
            <h3 className="name">{name}</h3>
            <p className="description">{description}</p>
          </div>
        </div>

        <div className="stats">
          {!isAudit && (
            <div className="stats__stat">
              <h3 className="value">5%</h3>
              <div className="sub-value">APY</div>
            </div>
          )}
          <div className="stats__stat">
            {isAudit ? (
              <>
                {auditPayout ? (
                  <>
                    <h3 className="value">~${vault.amountsInfo ? millify(vault.amountsInfo.maxRewardAmount.usd) : "-"}</h3>
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
          <div className="stats__stat">
            {isAudit ? (
              <>
                <h3 className="value">
                  ~${auditPayout ? millify(totalPaidOutOnAudit?.usd ?? 0) : millify(vault.amountsInfo?.depositedAmount.usd ?? 0)}
                </h3>
                <div className="sub-value">{auditPayout ? t("paidRewards") : t("maxRewards")}</div>
              </>
            ) : (
              <>
                <h3 className="value">~${vault.amountsInfo ? millify(vault.amountsInfo.maxRewardAmount.usd) : "-"}</h3>
                <div className="sub-value">{t("maxRewards")}</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="vault-actions">
        <div className="assets">
          <span className="subtitle">{auditPayout ? t("paidAssets") : t("assetsInVault")}</span>
          {getVaultAssets()}
        </div>
        <div className="actions">
          {(!isAudit || (isAudit && vault.dateStatus !== "finished" && !auditPayout)) && (
            <Button size="medium" filledColor={isAudit ? "primary" : "secondary"} styleType="outlined" onClick={goToDeposits}>
              {t("deposits")}
            </Button>
          )}
          {(!isAudit || (isAudit && vault.dateStatus === "on_time" && !auditPayout)) && (
            <Button
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
              {isAudit ? t("competitionDetails") : t("bountyDetails")}
            </Button>
          )}
        </div>
      </div>
    </StyledVaultCard>
  );
};
