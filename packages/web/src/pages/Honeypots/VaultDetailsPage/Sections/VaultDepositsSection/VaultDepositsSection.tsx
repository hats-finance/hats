import { IVault } from "@hats-finance/shared";
import { useTranslation } from "react-i18next";
import { HoldingsSection } from "./HoldingsSection/HoldingsSection";
import { VaultAssetsSection } from "./VaultAssetsSection/VaultAssetsSection";
import { StyledDepositsSection } from "./styles";
import { useHasUserDepositedAmount } from "./useHasUserDepositedAmount";

type VaultDepositsSectionProps = {
  vault: IVault;
  greyBorders?: boolean;
};

export const VaultDepositsSection = ({ vault, greyBorders = false }: VaultDepositsSectionProps) => {
  const { t } = useTranslation();

  const hasUserDeposited = useHasUserDepositedAmount([vault]);

  return (
    <StyledDepositsSection greyBorders={greyBorders}>
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
