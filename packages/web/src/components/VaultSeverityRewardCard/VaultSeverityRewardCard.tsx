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
  const showCap = ["v2", "v3"].includes(vault.version) && vault.description?.severities.some((sev) => !!sev.capAmount);
  const usingPointingSystem = vault.version === "v1" ? false : vault.description?.usingPointingSystem;
  const pointsInfo =
    usingPointingSystem && ["v2", "v3"].includes(vault.version) ? (severity as IVulnerabilitySeverityV2).points : undefined;

  const getPointingReward = () => {
    if (!usingPointingSystem || vault.version === "v1") return;
    const maxRewardInfo = vault.amountsInfo?.maxRewardAmount;
    const tokenPrice = vault.amountsInfo?.tokenPriceUsd ?? 0;

    const percentageAllocatedToSeverity = (severity as IVulnerabilitySeverityV2).percentage;
    const maxPercentageAllocatedToPoint = (severity as IVulnerabilitySeverityV2).percentageCapPerPoint;

    // Each point will only have a prize (max prize) if the severity has a cap per point
    const prizePerPoint = maxPercentageAllocatedToPoint
      ? (maxRewardInfo?.tokens ?? 0) * (maxPercentageAllocatedToPoint / 100)
      : undefined;
    // If fixed points we use the first, if range we use the last (second)
    const pointsToUse = (pointsInfo?.type === "fixed" ? pointsInfo?.value.first : pointsInfo?.value.second) ?? 0;

    const prizeUsingPoints = prizePerPoint! * pointsToUse;
    const prizeUsingWholeAlloc = (maxRewardInfo?.tokens ?? 0) * (percentageAllocatedToSeverity / 100);

    const maxPrize = maxPercentageAllocatedToPoint
      ? prizeUsingWholeAlloc > prizeUsingPoints
        ? prizeUsingPoints
        : prizeUsingWholeAlloc
      : prizeUsingWholeAlloc;

    return (
      <>
        <div className="severity-prize">
          <>
            <div>
              <span>
                {percentageAllocatedToSeverity}% <span className="tiny">{t("ofTheVault")}</span>
              </span>
            </div>
            <div>
              {maxPercentageAllocatedToPoint && prizePerPoint && (
                <span className="tiny">
                  {t("maxPrizePerPointExplanation", {
                    percentage: maxPercentageAllocatedToPoint,
                    price: millify(prizePerPoint * tokenPrice),
                  })}
                </span>
              )}
            </div>
            {pointsInfo?.type === "fixed" ? (
              <div className="mb-1">
                <span>{`${pointsInfo?.value.first} ${pointsInfo?.value.first === 1 ? "point" : "points"}`}</span>
                <span className="tiny">&nbsp;{t("perFinding")}&nbsp;</span>
              </div>
            ) : (
              <>
                <div>
                  <span className="tiny">&nbsp;{t("from").toLowerCase()}&nbsp;</span>
                  <span>{`${pointsInfo?.value.first} ${pointsInfo?.value.first === 1 ? "point" : "points"}`}</span>
                  <span className="tiny">&nbsp;{t("to").toLowerCase()}&nbsp;</span>
                  <span>{`${pointsInfo?.value.second} ${pointsInfo?.value.second === 1 ? "point" : "points"}`}</span>
                  <span className="tiny">&nbsp;{t("perFinding")}&nbsp;</span>
                </div>
              </>
            )}
            <div className="price">
              {t("upTo")} {`$${formatNumber(maxPrize * tokenPrice)}`}
              <span className="tiny ml-1">({`${formatNumber(maxPrize, 4)} ${tokenSymbol}`})</span>
            </div>
          </>
        </div>
      </>
    );
  };

  return (
    <StyledVaultSeverityRewardCard columns={2 + (noNft ? 0 : 1) + (showCap ? 1 : 0)} color={rewardColor}>
      <div className="severity-name">
        <Pill isSeverity transparent textColor={rewardColor} text={severityName} />
      </div>

      {usingPointingSystem && ["v2", "v3"].includes(vault.version) ? (
        getPointingReward()
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

      {/* {!noNft && (
        <div className="severity-nft">
          <VaultNftRewardCard vault={vault} severity={severity} type="tiny" />
        </div>
      )} */}
    </StyledVaultSeverityRewardCard>
  );
}
