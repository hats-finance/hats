import { IVault, IVulnerabilitySeverity, IVulnerabilitySeverityV2 } from "@hats.finance/shared";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { Pill, VaultNftRewardCard, WithTooltip } from "components";
import { useSeverityRewardInfo } from "hooks/severities/useSeverityRewardInfo";
import millify from "millify";
import { useTranslation } from "react-i18next";
import { formatNumber } from "utils";
import { StyledVaultSeverityRewardCard } from "./styles";

interface VaultSeverityRewardCardProps {
  vault: IVault;
  severity: IVulnerabilitySeverity;
  severityIndex: number;
  noNft?: boolean;
}

export function VaultSeverityRewardCard({ vault, severity, severityIndex, noNft = false }: VaultSeverityRewardCardProps) {
  const { t } = useTranslation();
  const { rewardPercentage, rewards, rewardsCap, rewardColor } = useSeverityRewardInfo(vault, severityIndex);

  const tokenSymbol = vault.stakingTokenSymbol;
  const severityName = severity?.name.toLowerCase().replace("severity", "") ?? "";
  const showCap = vault.version === "v2" && vault.description?.severities.some((sev) => !!sev.capAmount);
  const usingPointingSystem = vault.version === "v1" ? false : vault.description?.usingPointingSystem;
  const pricePerPoint =
    usingPointingSystem && vault.version === "v2"
      ? {
          usd: vault.description?.percentageCapPerPoint
            ? (vault.description.percentageCapPerPoint / 100) * (vault.amountsInfo?.maxRewardAmount.usd ?? 0)
            : vault.amountsInfo?.maxRewardAmount.usd ?? 0,
          tokens: vault.description?.percentageCapPerPoint
            ? (vault.description.percentageCapPerPoint / 100) * (vault.amountsInfo?.maxRewardAmount.tokens ?? 0)
            : vault.amountsInfo?.maxRewardAmount.tokens ?? 0,
        }
      : undefined;

  return (
    <StyledVaultSeverityRewardCard columns={2 + (noNft ? 0 : 1) + (showCap ? 1 : 0)} color={rewardColor}>
      <div className="severity-name">
        <Pill isSeverity transparent textColor={rewardColor} text={severityName} />
      </div>

      {usingPointingSystem && vault.version === "v2" ? (
        <>
          <div className="severity-prize">
            {(severity as IVulnerabilitySeverityV2).points?.type === "fixed" ? (
              <>
                <div>
                  <span>{`${(severity as IVulnerabilitySeverityV2).points?.value.first} points`}</span>
                  <span className="tiny">&nbsp;{t("perFinding")}&nbsp;</span>
                </div>

                {pricePerPoint && (
                  <span className="price">
                    {t("upTo")}&nbsp;
                    {vault.description?.percentageCapPerPoint
                      ? `$${formatNumber(((severity as IVulnerabilitySeverityV2).points?.value.first ?? 0) * pricePerPoint.usd)}`
                      : `$${millify(vault.amountsInfo?.maxRewardAmount.usd ?? 0, { precision: 2 })}`}
                    <span className="tiny ml-1">
                      (
                      {vault.description?.percentageCapPerPoint
                        ? `${formatNumber(
                            ((severity as IVulnerabilitySeverityV2).points?.value.first ?? 0) * pricePerPoint.tokens,
                            4
                          )} ${tokenSymbol}`
                        : `${millify(vault.amountsInfo?.maxRewardAmount.tokens ?? 0, { precision: 4 })} ${tokenSymbol}`}
                      )
                    </span>
                  </span>
                )}
              </>
            ) : (
              <>
                <div>
                  <span className="tiny">&nbsp;{t("from").toLowerCase()}&nbsp;</span>
                  <span>{`${(severity as IVulnerabilitySeverityV2).points?.value.first} points`}</span>
                  <span className="tiny">&nbsp;{t("to").toLowerCase()}&nbsp;</span>
                  <span>{`${(severity as IVulnerabilitySeverityV2).points?.value.second} points`}</span>
                </div>

                {pricePerPoint && (
                  <span className="price">
                    {t("upTo")}&nbsp;
                    {vault.description?.percentageCapPerPoint
                      ? `$${formatNumber(((severity as IVulnerabilitySeverityV2).points?.value.second ?? 0) * pricePerPoint.usd)}`
                      : `$${millify(vault.amountsInfo?.maxRewardAmount.usd ?? 0, { precision: 2 })}`}
                    <span className="tiny ml-1">
                      (
                      {vault.description?.percentageCapPerPoint
                        ? `${formatNumber(
                            ((severity as IVulnerabilitySeverityV2).points?.value.second ?? 0) * pricePerPoint.tokens,
                            4
                          )} ${tokenSymbol}`
                        : `${millify(vault.amountsInfo?.maxRewardAmount.tokens ?? 0, { precision: 4 })} ${tokenSymbol}`}
                      )
                    </span>
                  </span>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="severity-prize">
            <div>
              <span>{`${rewardPercentage.toFixed(2)}%`}</span>
              <span className="tiny">&nbsp;{t("ofRewards")}&nbsp;</span>
            </div>
            <span className="price">
              ~{`$${formatNumber(rewards.usd)}`}
              <span className="tiny ml-1">({`${formatNumber(rewards.tokens, 4)} ${tokenSymbol}`})</span>
            </span>
          </div>
          {showCap && (
            <>
              {(severity as IVulnerabilitySeverityV2).capAmount ? (
                <WithTooltip text={t("maxRewardCapExplanation")}>
                  <div className="severity-prize">
                    <div className="title-container">
                      <span className="tiny">{t("maxRewardCap")}</span>
                      <InfoIcon fontSize="small" />
                    </div>
                    <span className="price">
                      ~{`$${formatNumber(rewardsCap.usd)}`}
                      <span className="tiny ml-1">({`${formatNumber(rewardsCap.tokens, 4)} ${tokenSymbol}`})</span>
                    </span>
                  </div>
                </WithTooltip>
              ) : (
                <div />
              )}
            </>
          )}
        </>
      )}

      {!noNft && (
        <div className="severity-nft">
          <VaultNftRewardCard vault={vault} severity={severity} type="tiny" />
        </div>
      )}
    </StyledVaultSeverityRewardCard>
  );
}
