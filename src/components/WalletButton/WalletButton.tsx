import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useTransaction } from "wagmi";
import { shortenIfAddress } from "utils/addresses.utils";
import { Dot } from "components";
import { Colors } from "../../constants/constants";
import { StyledWalletButton } from "./styles";

const WalletButton = () => {
  const [canReconnect, setCanReconnect] = useState(false);
  const { address: account } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  // TODO: [v2] verify if this works well
  const { data: transaction } = useTransaction({ scopeKey: "hats" });

  /**
   * Sometimes when changing the network, the provider is deactivated. This is a workaround to
   * reconnect the provider.
   */
  useEffect(() => {
    if (!account && canReconnect) connect({ connector: connectors[0] });
  }, [account, canReconnect, connect, connectors]);

  console.log(account);

  const activateAccount = () => {
    connect({ connector: connectors[0] });
    setCanReconnect(true);
  };

  const deactivateAccount = () => {
    disconnect();
    setCanReconnect(false);
  };

  const getButtonTitle = () => {
    if (account) {
      return (
        <>
          <span className="onlyDesktop">Disconnect Wallet</span>
          <span className="onlyMobile">{shortenIfAddress(account)}</span>
        </>
      );
    } else {
      return "Connect Wallet";
    }
  };

  return (
    <StyledWalletButton onClick={account ? deactivateAccount : activateAccount} existsPendingTransaction={!!transaction}>
      <Dot color={account ? Colors.turquoise : Colors.red} />
      {getButtonTitle()}
    </StyledWalletButton>
  );
};

export { WalletButton };
