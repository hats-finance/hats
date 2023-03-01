import { useTranslation } from "react-i18next";
import { MyAccount, Modal } from "components";
import useModal from "hooks/useModal";
import { StyledWalletInfo } from "./styles";

export default function WalletInfo() {
  const { t } = useTranslation();
  const { isShowing, show, hide } = useModal();
  // TODO: [v2] re-implement this functionality (show ongoing transaction)
  // const { data: transaction } = useTransaction({ scopeKey: "hats" });

  return (
    <StyledWalletInfo>
      <button className="wallet-info__my-account-btn" onClick={show}>
        {t("Header.WalletInfo.my-account")}
        {/* {userNfts && userNfts.length > 0 && <Dot className="wallet-info__my-account-btn-notification" color={Colors.gray} />}
        {false && <Dot className="wallet-info__my-account-btn-notification" color={Colors.strongRed} />} */}
      </button>

      {/* {transaction && <TransactionInfo />} */}

      <Modal isShowing={isShowing} onHide={hide}>
        <MyAccount />
      </Modal>
    </StyledWalletInfo>
  );
}
