import { ChainId, shortenIfAddress, useEthers, useLookupAddress, useTransactions } from "@usedapp/core";
import { useTranslation } from "react-i18next";
// import Davatar from "@davatar/react"
import { useVaults } from "hooks/useVaults";
import { Colors } from "../../constants/constants";
import useModal from "hooks/useModal";
import TransactionInfo from "../TransactionInfo/TransactionInfo";
import MyAccount from "components/MyAccount/MyAccount";
import Dot from "components/Shared/Dot/Dot";
import Modal from "components/Shared/Modal/Modal";
import { StyledNetworkName, StyledWalletInfo, StyledWalletUser } from "./styles";

export default function WalletInfo() {
  const { t } = useTranslation();
  const { account, chainId } = useEthers();
  const { ens } = useLookupAddress(account);
  const { nftData } = useVaults();
  const { isShowing: isShowingMyAccount, toggle: toggleMyAccount } = useModal();
  const currentTransaction = useTransactions().transactions.find((tx) => !tx.receipt);

  return (
    <StyledWalletInfo>
      <button className="wallet-info__my-account-btn" onClick={toggleMyAccount}>
        {t("Header.WalletInfo.my-account")}
        {!nftData?.proofTokens && <Dot className="wallet-info__my-account-btn-notification" color={Colors.gray} />}
        {(nftData?.withRedeemed?.filter((nft) => !nft.isRedeemed).length ?? 0) > 0 && (
          <Dot className="wallet-info__my-account-btn-notification" color={Colors.strongRed} />
        )}
      </button>

      {currentTransaction ? (
        <TransactionInfo />
      ) : (
        <StyledWalletUser className="onlyDesktop">
          {/* <div className="davatar">
            <Davatar size={20} address={account!} generatedAvatarType="jazzicon" />
          </div> */}
          <span>{ens || shortenIfAddress(account)}</span>
        </StyledWalletUser>
      )}

      <StyledNetworkName className="onlyDesktop">{ChainId[chainId!]}</StyledNetworkName>

      <Modal isShowing={isShowingMyAccount} hide={toggleMyAccount}>
        <MyAccount />
      </Modal>
    </StyledWalletInfo>
  );
}
