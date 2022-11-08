import { ChainId, shortenIfAddress, useEthers, useLookupAddress, useTransactions } from "@usedapp/core";
import { useTranslation } from "react-i18next";
import { useVaults } from "hooks/useVaults";
import { Colors } from "constants/constants";
import useModal from "hooks/useModal";
import { Dot, MyAccount, TransactionInfo, Modal } from "components";
import { StyledNetworkName, StyledWalletInfo, StyledWalletUser } from "./styles";

export default function WalletInfo() {
  const { t } = useTranslation();
  const { account, chainId } = useEthers();
  const { ens } = useLookupAddress(account);
  const { nftData } = useVaults();
  const { isShowing, show, hide } = useModal();
  const currentTransaction = useTransactions().transactions.find((tx) => !tx.receipt);

  return (
    <StyledWalletInfo>
      <button className="wallet-info__my-account-btn" onClick={show}>
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

      <Modal isShowing={isShowing} onHide={hide}>
        <MyAccount />
      </Modal>
    </StyledWalletInfo>
  );
}
