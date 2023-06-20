import { IVault } from "@hats-finance/shared";
import { Button } from "components";
import { useTranslation } from "react-i18next";
import { VaultHoldings } from "./components/VaultHoldings";
import { StyledHoldingsSection } from "./styles";

type HoldingsSectionProps = {
  vault: IVault;
};

export const HoldingsSection = ({ vault }: HoldingsSectionProps) => {
  const { t } = useTranslation();

  return (
    <StyledHoldingsSection>
      <div className="how-to-withdraw">How to withdraw</div>
      <div className="subsection-container holdings">
        <div className="header">
          <div>{t("token")}</div>
          <div>{t("deposited")}</div>
          <div>{t("value")} ($)</div>
          <div>{t("status")}</div>
          <div />
        </div>

        <div className="separator small" />

        <VaultHoldings vault={vault} />
      </div>
    </StyledHoldingsSection>
  );
};
