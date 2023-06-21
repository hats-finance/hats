import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { VaultDetailsContext } from "../../store";
import { HoldingsSection } from "./HoldingsSection/HoldingsSection";
import { VaultAssetsSection } from "./VaultAssetsSection/VaultAssetsSection";
import { StyledDepositsSection } from "./styles";
import { useHasUserDepositedAmount } from "./useHasUserDepositedAmount";

export const VaultDepositsSection = () => {
  const { t } = useTranslation();
  const { vault } = useContext(VaultDetailsContext);

  const hasUserDeposited = useHasUserDepositedAmount([vault]);

  return (
    <StyledDepositsSection>
      <div>
        <h2>{t("vaultAssets")}</h2>
        <VaultAssetsSection vault={vault} />
      </div>

      {hasUserDeposited && (
        <div>
          <h2>{t("yourHoldings")}</h2>
          <HoldingsSection vault={vault} />
        </div>
      )}
    </StyledDepositsSection>
  );
};
