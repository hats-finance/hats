import { useTranslation } from "react-i18next";
import { EarningsMultipliers } from "./EarningsMultipliers/EarningsMultipliers";
import { StyledEarningsBreakdown } from "./styles";

export const EarningsBreakdown = () => {
  const { t } = useTranslation();

  return (
    <StyledEarningsBreakdown>
      <h2>{t("MyWallet.earningsBreakdown")}</h2>
      <EarningsMultipliers />
    </StyledEarningsBreakdown>
  );
};
