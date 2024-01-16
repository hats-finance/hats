import { IVault, IVaultDescriptionV2 } from "@hats.finance/shared";
import { VaultSeverityRewardCard } from "components";
import millify from "millify";
import { useTranslation } from "react-i18next";
import { StyledVaultSeverityRewards } from "./styles";

type VaultSeverityRewardsProps = {
  vault: IVault;
};

export const VaultSeverityRewards = ({ vault }: VaultSeverityRewardsProps) => {
  const { t } = useTranslation();
  if (!vault.description) return null;

  const pointingSystemCap =
    vault.version === "v2" &&
    vault.description &&
    (vault.description as IVaultDescriptionV2).usingPointingSystem &&
    (vault.description as IVaultDescriptionV2).percentageCapPerPoint;

  return (
    <StyledVaultSeverityRewards>
      {vault.version === "v2" && vault.description.usingPointingSystem && (
        <p>
          <span className="mr-1">{t("maxPrizePerPoint")}:</span>
          <strong>
            <span className="mr-1">
              {pointingSystemCap ?? "100"}% {t("ofTheVault")}
            </span>
            <span>
              (
              {pointingSystemCap
                ? `$${millify(((vault.amountsInfo?.maxRewardAmount.usd ?? 0) * pointingSystemCap) / 100)}`
                : vault.amountsInfo?.maxRewardAmount.usd}
              )
            </span>
          </strong>
        </p>
      )}
      {vault.description.severities.map((severity, idx) => (
        <VaultSeverityRewardCard key={idx} noNft vault={vault} severity={severity} severityIndex={idx} />
      ))}
    </StyledVaultSeverityRewards>
  );
};
