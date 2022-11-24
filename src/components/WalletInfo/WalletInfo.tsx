import { useTranslation } from "react-i18next";
import { useTransaction } from "wagmi";
import { Dot, MyAccount, TransactionInfo, Modal } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import { Colors } from "constants/constants";
import useModal from "hooks/useModal";
import { StyledWalletInfo } from "./styles";

export default function WalletInfo() {
  const { t } = useTranslation();
  const { nftData } = useVaults();
  const { isShowing, show, hide } = useModal();
  // TODO: [v2] verify if this works well
  const { data: transaction } = useTransaction({ scopeKey: "hats" });

  return (
    <StyledWalletInfo>
      <button className="wallet-info__my-account-btn" onClick={show}>
        {t("Header.WalletInfo.my-account")}
        {!nftData?.proofTokens && <Dot className="wallet-info__my-account-btn-notification" color={Colors.gray} />}
        {(nftData?.withRedeemed?.filter((nft) => !nft.isRedeemed).length ?? 0) > 0 && (
          <Dot className="wallet-info__my-account-btn-notification" color={Colors.strongRed} />
        )}
      </button>

      {transaction && <TransactionInfo />}

      <Modal isShowing={isShowing} onHide={hide}>
        <MyAccount />
      </Modal>
    </StyledWalletInfo>
  );
}
