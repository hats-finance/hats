import { shortenIfAddress, useEthers, useTransactions } from "@usedapp/core";
// import { useWeb3Modal } from "hooks/useWeb3Modal";
import { Colors } from "../../constants/constants";
import { Dot } from "components";
import { StyledWalletButton } from "./styles";
import { useEffect, useState } from "react";

const WalletButton = () => {
  const [canReconnect, setCanReconnect] = useState(true);
  const { account, activateBrowserWallet, deactivate } = useEthers();
  // const { activateProvider, deactivateProvider } = useWeb3Modal();
  const currentTransaction = useTransactions().transactions.find((tx) => !tx.receipt);

  useEffect(() => {
    if (!account && canReconnect) activateBrowserWallet();
  }, [account, canReconnect, activateBrowserWallet]);

  const activateAccount = () => {
    activateBrowserWallet();
    setCanReconnect(true);
  };

  const deactivateAccount = () => {
    deactivate();
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
    <StyledWalletButton onClick={account ? deactivateAccount : activateAccount} existsPendingTransaction={!!currentTransaction}>
      <Dot color={account ? Colors.turquoise : Colors.red} />
      {getButtonTitle()}
    </StyledWalletButton>
  );
};

export { WalletButton };
