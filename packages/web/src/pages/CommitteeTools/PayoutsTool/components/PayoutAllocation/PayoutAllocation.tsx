import { useTranslation } from "react-i18next";
import { IPayoutResponse, IVault, IVulnerabilitySeverity } from "@hats-finance/shared";
import { FormInput } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import { NftPreview } from "../NftPreview/NftPreview";
import { calculateAmountInTokensFromPercentage } from "../../utils/calculateAmountInTokensFromPercentage";
import { StyledPayoutAllocation } from "./styles";
import ArrowDownIcon from "@mui/icons-material/ArrowDownwardOutlined";

type PayoutAllocationProps = {
  selectedSeverity: IVulnerabilitySeverity | undefined;
  vault: IVault | undefined;
  payout: IPayoutResponse | undefined;
  percentageToPay: string | undefined;
};

export const PayoutAllocation = ({ vault, payout, percentageToPay, selectedSeverity }: PayoutAllocationProps) => {
  const { t } = useTranslation();
  const { tokenPrices } = useVaults();

  if (!vault) return null;

  const amountInTokensToPay = calculateAmountInTokensFromPercentage(percentageToPay, vault, tokenPrices);

  return (
    <StyledPayoutAllocation>
      <div className="result-divider">
        <div />
        <ArrowDownIcon />
        <div />
      </div>

      <div>{t("Payouts.resultDescription")}</div>
      <div className="result-container">
        <NftPreview vault={vault} severityName={selectedSeverity?.name} nftData={selectedSeverity?.["nft-metadata"]} />
        <FormInput value={amountInTokensToPay} label={t("Payouts.payoutSum")} readOnly />
      </div>

      <hr />
      <div>PayoutAllocation</div>
      <hr />
    </StyledPayoutAllocation>
  );
};
