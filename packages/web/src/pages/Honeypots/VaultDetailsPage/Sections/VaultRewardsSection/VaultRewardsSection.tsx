import millify from "millify";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { VaultDetailsContext } from "../../store";
import { VaultRewardDivision, VaultSeverityRewards } from "./components";
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
            <h4 className="title">{t("maxRewards")}</h4>
            <h4 className="value">~${millify(vault.amountsInfo?.maxRewardAmount.usd ?? 0)}</h4>
          </div>
          <div className="card bigPadding">
            <h4 className="title">{t("totalDeposits")}</h4>
            <h4 className="value">~${millify(vault.amountsInfo?.depositedAmount.usd ?? 0)}</h4>
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
        <div className="severities">
          <div className="card">
            <h4 className="title">{t("severityRewards")}</h4>
            <VaultSeverityRewards vault={vault} />
          </div>
        </div>
      </div>
    </StyledRewardsSection>
  );
};
