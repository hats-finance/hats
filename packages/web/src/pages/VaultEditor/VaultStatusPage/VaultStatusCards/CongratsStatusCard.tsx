import { getSafeWalletConnectLink } from "@hats.finance/shared";
import OpenIcon from "@mui/icons-material/OpenInNewOutlined";
import { Button, WithTooltip } from "components";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { appChains } from "settings";
import { useAccount } from "wagmi";
import { VaultStatusContext } from "../store";

export const CongratsStatusCard = () => {
  const { t } = useTranslation();
  const { address } = useAccount();

  const { vaultData, vaultChainId } = useContext(VaultStatusContext);
  const isMultisigConnected = address === vaultData.committeeMulsitigAddress;

  const openWalletConnectOnSafe = () => {
    window.open(getSafeWalletConnectLink(vaultData.committeeMulsitigAddress, vaultChainId));
  };

  const getVaultChainIcon = () => {
    const network = appChains[vaultChainId];

    return (
      <WithTooltip text={network?.chain.name}>
        <div className="chain-logo">
          <img src={require(`assets/icons/chains/${vaultChainId}.png`)} alt={network?.chain.name} />
        </div>
      </WithTooltip>
    );
  };

  return (
    <div className="status-card">
      <div className="status-card__title">
        <h3>{t("congrats")}</h3>
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
          <Button className="mt-4" noPadding styleType="invisible" onClick={openWalletConnectOnSafe}>
            <OpenIcon className="mr-3" />
            {t("openWalletConnectOnSafe")}
          </Button>
        </>
      )}
    </div>
  );
};
