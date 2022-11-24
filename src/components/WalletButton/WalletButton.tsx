import { useEffect, useRef, useState } from "react";
import { useAccount, useConnect, useDisconnect, useEnsName, useNetwork, useTransaction } from "wagmi";
import Tooltip from "rc-tooltip";
import { useTranslation } from "react-i18next";
import { shortenIfAddress } from "utils/addresses.utils";
import { Dot } from "components";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "constants/constants";
import ErrorIcon from "assets/icons/error-icon.svg";
import { StyledWalletButton, StyledDropdownOptions, WalletButtonWrapper } from "./styles";
import useOnClickOutside from "hooks/useOnClickOutside";

const WalletButton = () => {
  const { t } = useTranslation();
  const { address: account } = useAccount();
  const { connect, connectors } = useConnect();
  const { data: ens } = useEnsName({ address: account });
  const { chain, chains } = useNetwork();
  const { disconnect } = useDisconnect();
  const [canReconnect, setCanReconnect] = useState(!!account);
  const [showOptions, setShowOptions] = useState(false);
  // TODO: [v2] verify if this works well
  const { data: transaction } = useTransaction({ scopeKey: "hats" });

  const optionsRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(optionsRef, () => setShowOptions(false));

  console.log(chain, chains);
  console.log(connectors);
  /**
   * Sometimes when changing the network, the provider is deactivated. This is a workaround to
   * reconnect the provider.
   */
  useEffect(() => {
    if (!account && canReconnect) connect({ connector: connectors[0] });
  }, [account, canReconnect, connect, connectors]);

  const deactivateAccount = () => {
    disconnect();
    setCanReconnect(false);
  };

  const getButtonTitle = () => {
    if (account) {
      return <span>{ens || shortenIfAddress(account)}</span>;
    } else {
      return t("connect-wallet");
    }
  };

  const getNetworkIcon = () => {
    const supportedNetwork = chains?.find((c) => c.id === chain?.id);
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

  const getDropdownOptions = () => {
    const options = account
      ? [{ label: t("disconnect"), onClick: deactivateAccount, icon: "disconnect" }]
      : [
          {
            label: "Metamask",
            onClick: () => connect({ connector: connectors.find((c) => c.id === "metaMask") }),
            icon: "metamask",
          },
          {
            label: "WalletConnect",
            onClick: () => connect({ connector: connectors.find((c) => c.id === "walletConnect") }),
            icon: "wallet-connect",
          },
        ];

    return (
      <StyledDropdownOptions>
        {options.map((opt) => {
          const onClick = () => {
            setShowOptions(false);
            opt.onClick();
          };

          return (
            <div className="connector-option" key={opt.label} onClick={onClick}>
              <img src={require(`assets/icons/connectors/${opt.icon}.png`)} alt={opt.label} />
              <span>{opt.label}</span>
            </div>
          );
        })}
      </StyledDropdownOptions>
    );
  };

  return (
    <WalletButtonWrapper ref={optionsRef}>
      <StyledWalletButton
        onClick={() => setShowOptions((prev) => !prev)}
        connected={!!account}
        existsPendingTransaction={!!transaction}>
        {!account && <Dot color={Colors.red} />}
        {account && <div className="network-icon">{getNetworkIcon()}</div>}
        {getButtonTitle()}
      </StyledWalletButton>
      {showOptions && getDropdownOptions()}
    </WalletButtonWrapper>
  );
};

export { WalletButton };
