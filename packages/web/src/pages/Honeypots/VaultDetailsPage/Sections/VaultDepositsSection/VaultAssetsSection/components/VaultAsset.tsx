import { IVault } from "@hats-finance/shared";
import { Button } from "components";
import millify from "millify";
import { useTranslation } from "react-i18next";
import { VaultTokenIcon } from "../../components";

type VaultAssetProps = {
  vault: IVault;
};

export const VaultAsset = ({ vault }: VaultAssetProps) => {
  const { t } = useTranslation();

  const isAudit = vault.description && vault.description["project-metadata"].type === "audit";

  return (
    <div className="row">
      <VaultTokenIcon vault={vault} />
      <div>
        {millify(vault.amountsInfo?.depositedAmount.tokens ?? 0)} {vault.stakingTokenSymbol}
      </div>
      <div>~${millify(vault.amountsInfo?.depositedAmount.usd ?? 0)}</div>
      <div className="action-button">
        <Button size="medium" filledColor={isAudit ? "primary" : "secondary"}>
          {t("deposit")}
        </Button>
      </div>
    </div>
  );
};
