import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import TransactionInfo from "../TransactionInfo/TransactionInfo";
import { Colors, ScreenSize } from "../../constants/constants";
import { ChainId, shortenIfAddress, useEthers, useLookupAddress, useTransactions } from "@usedapp/core";
import { useVaults } from "hooks/useVaults";
import useModal from "hooks/useModal";
import MyAccount from "components/MyAccount/MyAccount";
import Dot from "components/Shared/Dot/Dot";
import Modal from "components/Shared/Modal/Modal";
import "./WalletInfo.scss";

export default function WalletInfo() {
  const { t } = useTranslation();
  const screenSize = useSelector((state: RootState) => state.layoutReducer.screenSize);
  const { account, chainId } = useEthers();
  const { ens } = useLookupAddress(account);
  const { nftData } = useVaults();
  const currentTransaction = useTransactions().transactions.find(tx => !tx.receipt);
  const { isShowing: isShowingMyAccount, toggle: toggleMyAccount } = useModal();
  return (
    <div className="wallet-info-wrapper">
      <button className="wallet-info__my-account-btn" onClick={toggleMyAccount}>
        {t("Header.WalletInfo.my-account")}

        {!nftData?.proofTokens && <Dot className="wallet-info__my-account-btn-notification" color={Colors.gray} />}
        {((nftData?.withRedeemed?.filter(nft => !nft.isRedeemed).length ?? 0) > 0) &&
          <Dot className="wallet-info__my-account-btn-notification" color={Colors.strongRed} />}
      </button>
      {currentTransaction ? (
        <TransactionInfo />
      ) : (
        screenSize === ScreenSize.Desktop && (
          <div className="wallet-user">
            <div className="davatar">
              {/** TODO: Temporary disabled - causing netwrok errors in development mode */}
              {/* <Davatar size={20} address={account!} generatedAvatarType="jazzicon" /> */}
            </div>
            <span>{ens || shortenIfAddress(account)}</span>
          </div>)
      )}
      {screenSize === ScreenSize.Desktop && <span className="network-name">{ChainId[chainId!]}</span>}
      <Modal
        isShowing={isShowingMyAccount}
        hide={toggleMyAccount}>
        <MyAccount />
      </Modal>
    </div>
  )
}
