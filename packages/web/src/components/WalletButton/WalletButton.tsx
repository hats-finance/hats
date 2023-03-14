import { useCallback, useEffect, useState } from "react";
import { Connector, useAccount, useConnect, useDisconnect, useEnsName, useNetwork } from "wagmi";
import { isAddressAMultisigMember } from "@hats-finance/shared";
import Tooltip from "rc-tooltip";
import { useTranslation } from "react-i18next";
import { appChains } from "settings";
import { shortenIfAddress } from "utils/addresses.utils";
import { useSupportedNetwork } from "hooks/wagmi/useSupportedNetwork";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { Dot, DropdownSelector } from "components";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import ErrorIcon from "assets/icons/error-icon.svg";
import { StyledWalletButton, WalletButtonWrapper } from "./styles";
import { connectorIcons } from "./connector.icons";
import { chainIcons } from "./chains.icons";

const WalletButton = () => {
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: ens } = useEnsName({ address: account });
  const { chain } = useNetwork();
  const supportedNetwork = useSupportedNetwork();
  const { disconnect } = useDisconnect();
  const [canReconnect, setCanReconnect] = useState(false);
  const [showConnectors, setShowConnectors] = useState(false);
  const [isGovMember, setIsGovMember] = useState(false);

  const { isAuthenticated, updateProfile } = useSiweAuth();

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
  useEffect(() => setCanReconnect(!!account), [account]);
  useEffect(() => {
    if (!account && canReconnect) {
      const preferredConnectorId = localStorage.getItem("wagmi.wallet")?.replaceAll('"', "");
      preferredConnectorId && activateAccount(connectors.find((c) => c.id === preferredConnectorId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, canReconnect]);

  useEffect(() => {
    const checkGovMember = async () => {
      if (account && chain && chain.id) {
        const chainId = Number(chain.id);
        console.log(appChains);
        const govMultisig = appChains[Number(chainId)].govMultisig;

        const isGov = await isAddressAMultisigMember(govMultisig, account, chainId);
        setIsGovMember(isGov);
      }
    };
    checkGovMember();
  }, [account, chain]);

  const getButtonTitle = () => {
    if (account) {
      return (
        <span>
          {ens || shortenIfAddress(account)} {isGovMember && "[Gov]"}
        </span>
      );
    } else {
      return t("connect-wallet");
    }
  };

  const getNetworkIcon = () => {
    const network = supportedNetwork && chain ? chain.name : t("unsupported-network");

    return (
      <Tooltip overlayClassName="tooltip" overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE} overlay={network}>
        {supportedNetwork && chain ? (
          <img src={chainIcons[chain.id]} alt={chain.name} />
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
        ? [{ label: t("disconnect"), onClick: deactivateAccount, icon: connectorIcons.disconnect }]
        : [
            {
              id: "metaMask",
              label: "Metamask",
              onClick: () => activateAccount(connectors.find((c) => c.id === "metaMask")),
              icon: connectorIcons.metaMask,
            },
            {
              id: "coinbaseWallet",
              label: "Coinbase Wallet",
              onClick: () => activateAccount(connectors.find((c) => c.id === "coinbaseWallet")),
              icon: connectorIcons.coinbaseWallet,
            },
            {
              id: "walletConnect",
              label: "WalletConnect",
              onClick: () => activateAccount(connectors.find((c) => c.id === "walletConnect")),
              icon: connectorIcons.walletConnect,
            },
          ],
    [connectors, account, activateAccount, deactivateAccount, t]
  );

  return (
    <WalletButtonWrapper onMouseEnter={updateProfile}>
      <StyledWalletButton
        onClick={() => setShowConnectors((prev) => !prev)}
        connected={!!account}
        existsPendingTransaction={false}
      >
        {!account && <Dot color={Colors.red} />}
        {/* {account && connectedConnector && <div className="provider-icon">{getProviderIcon()}</div>} */}
        {account && <div className="network-icon">{getNetworkIcon()}</div>}
        {getButtonTitle()}
        {isAuthenticated && <p className="signedIn">{t("signedInWithSiwe")}</p>}
      </StyledWalletButton>

      <DropdownSelector options={getConnectorsOptions()} show={showConnectors} onClose={() => setShowConnectors(false)} />
    </WalletButtonWrapper>
  );
};

export { WalletButton };
