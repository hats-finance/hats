import { VaultAssetsPillsList } from "components";
import millify from "millify";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { VaultDetailsContext } from "../../store";
import { VaultNftRewards } from "./VaultNftRewards/VaultNftRewards";
import { VaultRewardDivision } from "./VaultRewardDivision/VaultRewardDivision";
import { VaultSeverityRewards } from "./VaultSeverityRewards/VaultSeverityRewards";
import { StyledRewardsSection } from "./styles";

export const VaultRewardsSection = () => {
  const { t } = useTranslation();
  const { vault } = useContext(VaultDetailsContext);

  return (
    <StyledRewardsSection>
      <h2>{t("rewards")}</h2>
      <div className="rewards-containers mt-4">
        <div className="amounts">
          <div className="card bigPadding">
            <h4 className="title">{t("totalDeposits")}</h4>
            <h4 className="value">~${millify(vault.amountsInfo?.depositedAmount.usd ?? 0)}</h4>
          </div>
          <div className="card">
            <h4 className="title">{t("assetsInVault")}</h4>
            <VaultAssetsPillsList vaultData={vault} />
          </div>
          <div className="card bigPadding">
            <h4 className="title">{t("maxRewards")}</h4>
            <h4 className="value">~${millify(vault.amountsInfo?.maxRewardAmount.usd ?? 0)}</h4>
          </div>
        </div>
        <div className="division">
          <div className="card">
            <h4 className="title">{t("rewardsDivision")}</h4>
            <div className="chart-container">
              <VaultRewardDivision vault={vault} />
            </div>
          </div>
        </div>
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
