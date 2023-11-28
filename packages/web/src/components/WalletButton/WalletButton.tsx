import WalletIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ErrorIcon from "assets/icons/error-icon.svg";
import { Dot, DropdownSelector, WithTooltip } from "components";
import { Colors } from "constants/constants";
import { useSiweAuth } from "hooks/siwe/useSiweAuth";
import { useIsGovMember } from "hooks/useIsGovMember";
import { useSupportedNetwork } from "hooks/wagmi/useSupportedNetwork";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IS_PROD, appChains } from "settings";
import { shortenIfAddress } from "utils/addresses.utils";
import { Connector, useAccount, useConnect, useDisconnect, useEnsName, useNetwork } from "wagmi";
import { chainIcons } from "./chains.icons";
import { connectorIcons } from "./connector.icons";
import { StyledWalletButton, WalletButtonWrapper } from "./styles";

type WalletButtonProps = {
  expanded?: boolean;
};

const WalletButton = ({ expanded = false }: WalletButtonProps) => {
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: ens } = useEnsName({ address: account });
  const { chain } = useNetwork();
  const supportedNetwork = useSupportedNetwork();
  const { disconnect } = useDisconnect();

  const [canReconnect, setCanReconnect] = useState(false);
  const [selectedConnectorWaitingChain, setSelectedConnectorWaitingChain] = useState<
    { connector: string; chainId?: number } | undefined
  >();
  const [showConnectors, setShowConnectors] = useState(false);
  const isGovMember = useIsGovMember();

  const { isAuthenticated, updateProfile } = useSiweAuth();

  const deactivateAccount = useCallback(() => {
    disconnect();
    setCanReconnect(false);
    localStorage.removeItem("wagmi.wallet");
  }, [disconnect]);

  const activateAccount = useCallback(
    (connector: Connector | undefined, chainId?: number) => {
      connect({ connector, chainId });
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
      preferredConnectorId &&
        activateAccount(
          connectors.find((c) => c.id === preferredConnectorId),
          selectedConnectorWaitingChain?.chainId
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, canReconnect]);

  const getButtonTitle = () => {
    if (account) {
      return (
        <span>
          {ens || shortenIfAddress(account, { startLength: 6 })} {isGovMember && "[Gov]"}
        </span>
      );
    } else {
      return t("connect-wallet");
    }
  };

  const getNetworkIcon = () => {
    const network = supportedNetwork && chain ? chain.name : t("unsupported-network");

    return (
      <WithTooltip text={network}>
        {supportedNetwork && chain ? (
          <img src={chainIcons[chain.id]} alt={chain.name} />
        ) : (
          <img src={ErrorIcon} alt={t("unsupported-network")} />
        )}
      </WithTooltip>
    );
  };

  const getConnectorsOptions = useCallback(
    () =>
      account
        ? [{ label: t("disconnect"), onClick: deactivateAccount, icon: connectorIcons.disconnect }]
        : [
            {
              id: "injected",
              label: connectors.find((c) => c.id === "injected")?.name || "Injected",
              onClick: () => activateAccount(connectors.find((c) => c.id === "injected")),
              icon: <WalletIcon />,
            },
            {
              id: "metaMask",
              label: "Metamask",
              onClick: () => activateAccount(connectors.find((c) => c.id === "metaMask")),
              icon: connectorIcons.metaMask,
            },
            // {
            //   id: "safe",
            //   label: "Safe",
            //   onClick: () => setSelectedConnectorWaitingChain("safe"),
            //   icon: connectorIcons.walletConnect,
            // },
            {
              id: "walletConnect",
              label: "WalletConnect (v2)",
              onClick: () => setSelectedConnectorWaitingChain({ connector: "walletConnect" }),
              icon: connectorIcons.walletConnect,
            },
            {
              id: "coinbaseWallet",
              label: "Coinbase Wallet",
              onClick: () => activateAccount(connectors.find((c) => c.id === "coinbaseWallet")),
              icon: connectorIcons.coinbaseWallet,
            },
          ],
    [connectors, account, activateAccount, deactivateAccount, t]
  );

  const supportedNetworksOptions = Object.values(appChains)
    .filter((chainInfo) => (IS_PROD ? !chainInfo.chain.testnet : true))
    .sort((a) => (a.chain.testnet ? 1 : -1))
    .map((chainInfo) => ({
      id: chainInfo.chain.network,
      label: chainInfo.chain.name,
      onClick: () => {
        if (!selectedConnectorWaitingChain) return;

        setSelectedConnectorWaitingChain({ ...selectedConnectorWaitingChain, chainId: chainInfo.chain.id });
        activateAccount(
          connectors.find((c) => c.id === selectedConnectorWaitingChain?.connector),
          chainInfo.chain.id
        );
      },
      icon: chainIcons[chainInfo.chain.id],
    }));

  return (
    <WalletButtonWrapper onMouseEnter={updateProfile}>
      <StyledWalletButton
        onClick={() => {
          if (showConnectors) setShowConnectors(false);
          if (!showConnectors && !selectedConnectorWaitingChain) setShowConnectors(true);
          if (selectedConnectorWaitingChain) setSelectedConnectorWaitingChain(undefined);
        }}
        connected={!!account}
        existsPendingTransaction={false}
        expanded={expanded}
      >
        {!account && <Dot color={Colors.red} />}
        {/* {account && connectedConnector && <div className="provider-icon">{getProviderIcon()}</div>} */}
        {account && <div className="network-icon">{getNetworkIcon()}</div>}
        {getButtonTitle()}
        {isAuthenticated && <p className="signedIn">{t("signedInWithSiwe")}</p>}
      </StyledWalletButton>

      <DropdownSelector options={getConnectorsOptions()} show={showConnectors} onClose={() => setShowConnectors(false)} />
      <DropdownSelector
        options={supportedNetworksOptions}
        show={!!selectedConnectorWaitingChain}
        onClose={() => setSelectedConnectorWaitingChain(undefined)}
      />
    </WalletButtonWrapper>
  );
};

export { WalletButton };
