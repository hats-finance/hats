import { IPayoutGraph, IVault } from "@hats-finance/shared";
import { VaultAssetsPillsList, WithTooltip } from "components";
import millify from "millify";
import { useTranslation } from "react-i18next";
import { VaultNftRewards } from "./VaultNftRewards/VaultNftRewards";
import { VaultRewardDivision } from "./VaultRewardDivision/VaultRewardDivision";
import { VaultSeverityRewards } from "./VaultSeverityRewards/VaultSeverityRewards";
import { StyledRewardsSection } from "./styles";

type VaultRewardsSectionProps = {
  vault: IVault;
  noDeployed?: boolean;
  auditPayout?: IPayoutGraph | undefined;
};

export const VaultRewardsSection = ({ vault }: VaultRewardsSectionProps) => {
  const { t } = useTranslation();

  const isAudit = vault.description && vault.description["project-metadata"].type === "audit";
  const showIntended = vault.amountsInfo?.showCompetitionIntendedAmount ?? false;

  return (
    <StyledRewardsSection showIntended={showIntended} isAudit={!!isAudit}>
      <h2>{t("rewards")}</h2>
      <div className="rewards-containers mt-4">
        <div className="amounts">
          {!isAudit && (
            <div className="card amount-card">
              <h4 className="title">{showIntended ? t("intendedDeposits") : t("totalDeposits")}</h4>
              {showIntended ? (
                <WithTooltip text={t("intendedValueExplanation")}>
                  <h4 className="value">~${millify(vault.amountsInfo?.competitionIntendedAmount?.maxReward.usd ?? 0)}</h4>
                </WithTooltip>
              ) : (
                <h4 className="value">~${millify(vault.amountsInfo?.depositedAmount.usd ?? 0)}</h4>
              )}
            </div>
          )}
          <div className="card">
            <h4 className="title">{t("assetsInVault")}</h4>
            <VaultAssetsPillsList vaultData={vault} />
          </div>
          <div className="card amount-card">
            <h4 className="title">{showIntended ? t("intendedRewards") : t("maxRewards")}</h4>
            {showIntended ? (
              <WithTooltip text={t("intendedValueExplanation")}>
                <h4 className="value">~${millify(vault.amountsInfo?.competitionIntendedAmount?.maxReward.usd ?? 0)}</h4>
              </WithTooltip>
            ) : (
              <h4 className="value">~${millify(vault.amountsInfo?.maxRewardAmount.usd ?? 0)}</h4>
            )}
          </div>
        </div>
        {!isAudit && (
          <div className="division">
            <div className="card">
              <h4 className="title">{t("rewardsDivision")}</h4>
              <div className="chart-container">
                <VaultRewardDivision vault={vault} />
              </div>
            </div>
          </div>
        )}
        <div className="severities-rewards">
          <div className="card">
            <h4 className="title">{t("severityRewards")}</h4>
            <VaultSeverityRewards vault={vault} />
          </div>
        </div>
      </div>

      <h2 className="mt-5">{t("nftRewards")}</h2>
      <div className="nft-rewards-container mt-4">
        <VaultNftRewards vault={vault} />
      </div>
    </StyledRewardsSection>
  );
};
