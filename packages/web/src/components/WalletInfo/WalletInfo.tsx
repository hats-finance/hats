import { Button, Modal, MyAccount } from "components";
import useModal from "hooks/useModal";
import { useTranslation } from "react-i18next";
import { StyledWalletInfo } from "./styles";

export default function WalletInfo() {
  const { t } = useTranslation();
  const { isShowing, show, hide } = useModal();

  return (
    <StyledWalletInfo>
      <Button styleType="outlined" onClick={show}>
        {t("Header.WalletInfo.my-account")}
      </Button>

      <Modal isShowing={isShowing} onHide={hide}>
        <MyAccount />
      </Modal>
    </StyledWalletInfo>
  );
}
