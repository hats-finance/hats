import { IVault } from "@hats.finance/shared";
import { Alert, Button } from "components";
import { useVaultApy } from "hooks/vaults/useVaultApy";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { VaultAsset } from "./components/VaultAsset";
import { StyledVaultAssetsSection } from "./styles";

type VaultAssetsSectionProps = {
  vault: IVault;
};

export const VaultAssetsSection = ({ vault }: VaultAssetsSectionProps) => {
  const { t } = useTranslation();

  const vaultApy = useVaultApy(vault);

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

      <StyledVaultAssetsSection className="subsection-container" rewardsCount={vaultApy.length}>
        <div className="header">
          <div>{t("token")}</div>
          <div>{t("totalDeposited")}</div>
          <div>{t("totalValue")} ($)</div>
          {vaultApy.map((_, index) => (
            <Fragment key={index}>
              <div>
                {t("reward")} #{index + 1}
              </div>
              <div className="uppercase">{t("apy")}</div>
            </Fragment>
          ))}
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
