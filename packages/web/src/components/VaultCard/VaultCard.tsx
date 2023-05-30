import { IVault } from "@hats-finance/shared";
import { Button } from "components";
import { WithTooltip } from "components/WithTooltip/WithTooltip";
import millify from "millify";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { appChains } from "settings";
import { ipfsTransformUri } from "utils";
import { StyledVaultCard } from "./styles";

type VaultCardProps = {
  vault: IVault;
};

export const VaultCard = ({ vault }: VaultCardProps) => {
  const { t } = useTranslation();

  const vaultDate = useMemo(() => {
    if (!vault.description) return null;

    const starttime = (vault.description["project-metadata"].starttime ?? 0) * 1000;
    const endtime = (vault.description["project-metadata"].endtime ?? 0) * 1000;

    if (!starttime || !endtime) return null;

    const startMonth = moment(starttime).format("MMM");
    const endMonth = moment(endtime).format("MMM");
    const startDay = moment(starttime).format("DD");
    const endDay = moment(endtime).format("DD");

    return {
      date: startMonth !== endMonth ? `${startMonth} ${startDay}-${endMonth} ${endDay}` : `${startMonth} ${startDay}-${endDay}`,
      time: moment(endtime).format("HH:mm"),
    };
  }, [vault]);

  if (!vault.description) return null;

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

    return (
      <>
        <WithTooltip text={`${vault.version} | ${t("deposited")} ~${millify(vault.depositedAmount?.tokens ?? 0)} ${token}`}>
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

  return (
    <StyledVaultCard isAudit={isAudit}>
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
                <h3 className="value">{vaultDate?.date}</h3>
                <div className="sub-value">{vaultDate?.time}h</div>
              </>
            ) : (
              <>
                <h3 className="value">~${vault.depositedAmount ? millify(vault.depositedAmount.value) : "-"}</h3>
                <div className="sub-value">{t("totalDeposits")}</div>
              </>
            )}
          </div>
          <div className="stats__stat">
            {isAudit ? (
              <>
                <h3 className="value">~${vault.depositedAmount ? millify(vault.depositedAmount.value) : "-"}</h3>
                <div className="sub-value">{t("maxRewards")}</div>
              </>
            ) : (
              <>
                <h3 className="value">~${vault.maxRewardAmount ? millify(vault.maxRewardAmount.value) : "-"}</h3>
                <div className="sub-value">{t("totalRewards")}</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="vault-actions">
        <div className="assets">
          <span className="subtitle">{t("assetsInVault")}</span>
          {getVaultAssets()}
        </div>
        <div className="actions">
          <Button size="medium" filledColor={isAudit ? "primary" : "secondary"} styleType="outlined">
            {t("deposits")}
          </Button>
          <Button size="medium" filledColor={isAudit ? "primary" : "secondary"} styleType="outlined">
            {t("submitVulnerability")}
          </Button>
          <Button size="medium" filledColor={isAudit ? "primary" : "secondary"}>
            {isAudit ? t("competitionDetails") : t("bountyDetails")}
          </Button>
        </div>
      </div>
    </StyledVaultCard>
  );
};
