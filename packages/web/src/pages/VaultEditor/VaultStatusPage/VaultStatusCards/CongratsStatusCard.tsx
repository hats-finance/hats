import { useContext } from "react";
import Tooltip from "rc-tooltip";
import { useAccount } from "wagmi";
import { ChainsConfig } from "@hats-finance/shared";
import { useTranslation } from "react-i18next";
import { RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import { getSafeWalletConnectLink } from "utils/gnosis.utils";
import { Button } from "components";
import { VaultStatusContext } from "../store";

export const CongratsStatusCard = () => {
  const { t } = useTranslation();
  const { address } = useAccount();

  const { vaultData, vaultChainId } = useContext(VaultStatusContext);
  const isMultisigConnected = address === vaultData.committeeMulsitigAddress;

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

      {!isMultisigConnected && (
        <>
          <p className="status-card__text mt-4 mb-3">{t("ifYouWantToConnectWalletConnect")}</p>
          <Button
            size="small"
            styleType="outlined"
            onClick={() => window.open(getSafeWalletConnectLink(vaultData.committeeMulsitigAddress, vaultChainId))}
          >
            {t("openWalletConnectOnSafe")}
          </Button>
        </>
      )}
    </div>
  );
};
