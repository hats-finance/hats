import { IVault } from "@hats.finance/shared";
import { Alert, Button } from "components";
import { useTranslation } from "react-i18next";
import { VaultAsset } from "./components/VaultAsset";
import { StyledVaultAssetsSection } from "./styles";

type VaultAssetsSectionProps = {
  vault: IVault;
};

export const VaultAssetsSection = ({ vault }: VaultAssetsSectionProps) => {
  const { t } = useTranslation();

  return (
    <>
      {!vault.committeeCheckedIn && (
        <Alert className="mt-4" type="warning">
          {t("cantDepositBecauseCheckin")}
        </Alert>
      )}
      {vault.depositPause && (
        <Alert className="mt-4" type="warning">
          {t("cantDepositBecausePause")}
        </Alert>
      )}

      <StyledVaultAssetsSection className="subsection-container">
        <div className="header">
          <div>{t("token")}</div>
          <div>{t("totalDeposited")}</div>
          <div>{t("totalValue")} ($)</div>
          <Button className="hidden last" size="medium">
            {t("deposit")}
          </Button>
        </div>
        <div className="separator small" />
        <VaultAsset vault={vault} />
      </StyledVaultAssetsSection>
    </>
  );
};
