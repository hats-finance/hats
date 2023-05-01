import { IPayoutResponse, IVault, IVulnerabilitySeverity } from "@hats-finance/shared";
import ArrowDownIcon from "@mui/icons-material/ArrowDownwardOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import { FormInput, WithTooltip } from "components";
import { useTranslation } from "react-i18next";
import { NftPreview } from "../../NftPreview/NftPreview";
import { usePayoutAllocation } from "../usePayoutAllocation";
import { StyledSinglePayoutAllocation } from "./styles";

type SinglePayoutAllocationProps = {
  selectedSeverity: IVulnerabilitySeverity | undefined;
  vault: IVault | undefined;
  payout: IPayoutResponse | undefined;
  percentageToPay: string | undefined;
};

export const SinglePayoutAllocation = ({ vault, payout, percentageToPay, selectedSeverity }: SinglePayoutAllocationProps) => {
  const { t } = useTranslation();

  const { immediateAmount, vestedAmount, committeeAmount, governanceAmount, hatsRewardAmount, totalAmount } = usePayoutAllocation(
    vault,
    payout,
    percentageToPay
  );

  if (!vault || !totalAmount) return null;
  return (
    <StyledSinglePayoutAllocation>
      <div className="result-divider">
        <div />
        <ArrowDownIcon />
        <div />
      </div>

      <div className="mb-5">{t("Payouts.resultDescription")}</div>
      <div className="result-container">
        <NftPreview vault={vault} severityName={selectedSeverity?.name} nftData={selectedSeverity?.["nft-metadata"]} />
        <FormInput
          value={`≈ ${totalAmount?.tokens.formatted} ~ ${totalAmount?.usd.formatted}`}
          label={t("Payouts.totalPayoutSum")}
          readOnly
        />
      </div>

      <div className="allocations">
        <div className="mb-5">
          <strong>{t("Payouts.payoutAllocationExplanation")}</strong>
        </div>
        {immediateAmount && (
          <div className="allocation">
            <WithTooltip text={t("immediateSplitExplanation")}>
              <div className="name">
                {t("immediate")} <InfoIcon />
              </div>
            </WithTooltip>
            <div className="values">
              <div className="percentage">{immediateAmount.percentage}</div>
              <div className="sum">{`≈ ${immediateAmount.tokens.formatted} ~ ${immediateAmount.usd.formatted}`}</div>
            </div>
          </div>
        )}
        {vestedAmount && (
          <div className="allocation">
            <WithTooltip text={t("vestedSplitExplanation")}>
              <div className="name">
                {t("vested")} <InfoIcon />
              </div>
            </WithTooltip>
            <div className="values">
              <div className="percentage">{vestedAmount.percentage}</div>
              <div className="sum">{`≈ ${vestedAmount.tokens.formatted} ~ ${vestedAmount.usd.formatted}`}</div>
            </div>
          </div>
        )}
        {hatsRewardAmount && (
          <div className="allocation">
            <WithTooltip text={t("hatsRewardSplitExplanation")}>
              <div className="name">
                {t("hatsReward")} <InfoIcon />
              </div>
            </WithTooltip>
            <div className="values">
              <div className="percentage">{hatsRewardAmount.percentage}</div>
              <div className="sum">{`≈ ${hatsRewardAmount.tokens.formatted} ~ ${hatsRewardAmount.usd.formatted}`}</div>
            </div>
          </div>
        )}
        {committeeAmount && (
          <div className="allocation">
            <WithTooltip text={t("committeeSplitExplanation")}>
              <div className="name">
                {t("committee")} <InfoIcon />
              </div>
            </WithTooltip>
            <div className="values">
              <div className="percentage">{committeeAmount.percentage}</div>
              <div className="sum">{`≈ ${committeeAmount.tokens.formatted} ~ ${committeeAmount.usd.formatted}`}</div>
            </div>
          </div>
        )}
        {governanceAmount && (
          <div className="allocation">
            <WithTooltip text={t("hatsGovFee")}>
              <div className="name">
                {t("governance")} <InfoIcon />
              </div>
            </WithTooltip>
            <div className="values">
              <div className="percentage">{governanceAmount.percentage}</div>
              <div className="sum">{`≈ ${governanceAmount.tokens.formatted} ~ ${governanceAmount.usd.formatted}`}</div>
            </div>
          </div>
        )}
      </div>
    </StyledSinglePayoutAllocation>
  );
};