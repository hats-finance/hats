import { Button, Modal, MyAccount } from "components";
import useModal from "hooks/useModal";
import { useTranslation } from "react-i18next";
import { StyledWalletInfo } from "./styles";

export default function WalletInfo() {
  const { t } = useTranslation();
  const { isShowing, show, hide } = useModal();
  // TODO: [v2] re-implement this functionality (show ongoing transaction)
  // const { data: transaction } = useTransaction({ scopeKey: "hats" });

  return (
    <StyledWalletInfo>
      <Button styleType="outlined" onClick={show}>
        {t("Header.WalletInfo.my-account")}
      </Button>

      {/* {transaction && <TransactionInfo />} */}

      <Modal isShowing={isShowing} onHide={hide}>
        <MyAccount />
      </Modal>
    </StyledWalletInfo>
  );
}
