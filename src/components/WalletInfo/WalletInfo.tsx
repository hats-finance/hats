import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import TransactionInfo from "../TransactionInfo/TransactionInfo";
import { Colors, ScreenSize } from "../../constants/constants";
import { ChainId, shortenIfAddress, useEtherBalance, useEthers, useLookupAddress, useTokenBalance, useTransactions } from "@usedapp/core";
import { formatEther } from "ethers/lib/utils";
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
  const ethBalance = formatEther(useEtherBalance(account) ?? 0);
  const ethBalanceString = (+ethBalance).toFixed(4);
  const { ens } = useLookupAddress(account);
  const { masters, nftData } = useVaults();
  const hatsBalance = formatEther(useTokenBalance(masters?.[0].rewardsToken, account) ?? 0);
  const hatsBalanceString = (+hatsBalance).toFixed(4);
  const currentTransaction = useTransactions().transactions.find(tx => !tx.receipt);
  const { isShowing: isShowingMyAccount, toggle: toggleMyAccount } = useModal();
  return (
    <div className="wallet-info-wrapper">
      <button className="wallet-info__my-account-btn" onClick={toggleMyAccount}>
        {t("Header.WalletInfo.my-account")}
        {hatsBalance && screenSize === ScreenSize.Desktop && (
          <span className="wallet-info__my-account-hat-balance">{hatsBalanceString} HAT</span>
        )}
        {!nftData?.proofTokens && <Dot className="wallet-info__my-account-btn-notification" color={Colors.gray} />}
        {(nftData?.proofRedeemables?.length ?? 0) > 0 ||
          ((nftData?.treeRedeemables?.length ?? 0) > 0) &&
          <Dot className="wallet-info__my-account-btn-notification" color={Colors.strongRed} />}
      </button>
      {screenSize === ScreenSize.Desktop &&
        <div className="wallet-balance">
          {ethBalance && <span>{ethBalanceString} ETH</span>}
        </div>}
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
