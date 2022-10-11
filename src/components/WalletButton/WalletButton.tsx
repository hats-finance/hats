import { shortenIfAddress, useEthers, useTransactions } from "@usedapp/core";
import { useWeb3Modal } from "hooks/useWeb3Modal";
import { Colors } from "../../constants/constants";
import Dot from "../Shared/Dot/Dot";
import { StyledWalletButton } from "./styles";

const WalletButton = () => {
  const { account } = useEthers();
  const { activateProvider, deactivateProvider } = useWeb3Modal();
  const currentTransaction = useTransactions().transactions.find((tx) => !tx.receipt);

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
    <StyledWalletButton onClick={account ? deactivateProvider : activateProvider} existsPendingTransaction={!!currentTransaction}>
      <Dot color={account ? Colors.turquoise : Colors.red} />
      {getButtonTitle()}
    </StyledWalletButton>
  );
};

export { WalletButton };
