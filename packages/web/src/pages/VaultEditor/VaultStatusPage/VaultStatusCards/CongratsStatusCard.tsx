import { useContext } from "react";
import Tooltip from "rc-tooltip";
import { ChainsConfig } from "@hats-finance/shared";
import { useTranslation } from "react-i18next";
import { RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import { VaultStatusContext } from "../store";

export const CongratsStatusCard = () => {
  const { t } = useTranslation();

  const { vaultData, vaultChainId } = useContext(VaultStatusContext);

  const getVaultChainIcon = () => {
    const network = ChainsConfig[vaultChainId];

    return (
      <Tooltip overlayClassName="tooltip" overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE} overlay={network?.chain.name}>
        <div className="chain-logo">
          <img src={require(`assets/icons/chains/${vaultChainId}.png`)} alt={network?.chain.name} />
        </div>
      </Tooltip>
    );
  };

  return (
    <div className="status-card">
      <div className="status-card__title">
        {t("congrats")}
        {getVaultChainIcon()}
      </div>
      <p className="status-card__text">
        {vaultData.description ? (
          <strong>
            {t("yourVaultWasCreatedWithVaultName", { vaultName: vaultData.description?.["project-metadata"].name })}
          </strong>
        ) : (
          <strong>{t("yourVaultWasCreated")}</strong>
        )}
      </p>
      <p className="status-card__text">{t("followingStepsVaultStatus")}</p>
    </div>
  );
};
