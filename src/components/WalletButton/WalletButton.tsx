import { useCallback, useEffect, useState } from "react";
import { Connector, useAccount, useConnect, useDisconnect, useEnsName, useNetwork, useTransaction } from "wagmi";
import Tooltip from "rc-tooltip";
import { useTranslation } from "react-i18next";
import { shortenIfAddress } from "utils/addresses.utils";
import { useSupportedNetwork } from "hooks/useSupportedNetwork";
import { Dot, DropdownSelector } from "components";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import ErrorIcon from "assets/icons/error-icon.svg";
import { StyledWalletButton, WalletButtonWrapper } from "./styles";

const WalletButton = () => {
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: ens } = useEnsName({ address: account });
  const { chain } = useNetwork();
  const supportedNetwork = useSupportedNetwork();
  const { disconnect } = useDisconnect();
  const [canReconnect, setCanReconnect] = useState(!!account);
  const [showConnectors, setShowConnectors] = useState(false);
  // TODO: [v2] verify if this works well
  const { data: transaction } = useTransaction({ scopeKey: "hats" });

  const deactivateAccount = useCallback(() => {
    disconnect();
    setCanReconnect(false);
    localStorage.removeItem("wagmi.wallet");
  }, [disconnect]);

  const activateAccount = useCallback(
    (connector: Connector | undefined) => {
      connect({ connector });
      setCanReconnect(true);
    },
    [connect]
  );
  /**
   * Sometimes when changing the network, the provider is deactivated. This is a workaround to
   * reconnect the provider.
   */
  useEffect(() => {
    if (!account && canReconnect) {
      const preferredConnectorId = localStorage.getItem("wagmi.wallet")?.replaceAll('"', "");
      preferredConnectorId && activateAccount(connectors.find((c) => c.id === preferredConnectorId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, canReconnect]);

  const getButtonTitle = () => {
    if (account) {
      return <span>{ens || shortenIfAddress(account)}</span>;
    } else {
      return t("connect-wallet");
    }
  };

  const getNetworkIcon = () => {
    const network = supportedNetwork && chain ? chain.name : t("unsupported-network");

    return (
      <Tooltip overlayClassName="tooltip" overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE} overlay={network}>
        {supportedNetwork && chain ? (
          <img src={require(`assets/icons/chains/${chain.id}.png`)} alt={chain.name} />
        ) : (
          <img src={ErrorIcon} alt={t("unsupported-network")} />
        )}
      </Tooltip>
    );
  };

  // const getProviderIcon = () => {
  //   if (!connectedConnector) return null;

  //   return (
  //     <Tooltip overlayClassName="tooltip" overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE} overlay={connectedConnector.name}>
  //       <img src={require(`assets/icons/connectors/${connectedConnector.id}.png`)} alt={connectedConnector.name} />
  //     </Tooltip>
  //   );
  // };

  const getConnectorsOptions = useCallback(
    () =>
      account
        ? [{ label: t("disconnect"), onClick: deactivateAccount, icon: require("../../assets/icons/connectors/disconnect.png") }]
        : [
            {
              id: "metaMask",
              label: "Metamask",
              onClick: () => activateAccount(connectors.find((c) => c.id === "metaMask")),
              icon: require("../../assets/icons/connectors/metaMask.png"),
            },
            {
              id: "coinbaseWallet",
              label: "Coinbase Wallet",
              onClick: () => activateAccount(connectors.find((c) => c.id === "coinbaseWallet")),
              icon: require("../../assets/icons/connectors/coinbaseWallet.png"),
            },
            {
              id: "walletConnect",
              label: "WalletConnect",
              onClick: () => activateAccount(connectors.find((c) => c.id === "walletConnect")),
              icon: require("../../assets/icons/connectors/walletConnect.png"),
            },
          ],
    [connectors, account, activateAccount, deactivateAccount, t]
  );

  return (
    <WalletButtonWrapper>
      <StyledWalletButton
        onClick={() => setShowConnectors((prev) => !prev)}
        connected={!!account}
        existsPendingTransaction={!!transaction}>
        {!account && <Dot color={Colors.red} />}
        {/* {account && connectedConnector && <div className="provider-icon">{getProviderIcon()}</div>} */}
        {account && <div className="network-icon">{getNetworkIcon()}</div>}
        {getButtonTitle()}
      </StyledWalletButton>

      <DropdownSelector options={getConnectorsOptions()} show={showConnectors} onClose={() => setShowConnectors(false)} />
    </WalletButtonWrapper>
  );
};

export { WalletButton };
