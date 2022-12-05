import { useTranslation } from "react-i18next";
import { Dot, MyAccount, TransactionInfo, Modal } from "components";
import { useVaults } from "hooks/vaults/useVaults";
import { Colors } from "constants/constants";
import useModal from "hooks/useModal";
import { StyledWalletInfo } from "./styles";

export default function WalletInfo() {
  const { t } = useTranslation();
  const { depositTokensData } = useVaults();
  const { isShowing, show, hide } = useModal();
  // TODO: [v2] re-implement this functionality (show ongoing transaction)
  // const { data: transaction } = useTransaction({ scopeKey: "hats" });

  return (
    <StyledWalletInfo>
      <button className="wallet-info__my-account-btn" onClick={show}>
        {t("Header.WalletInfo.my-account")}
        {/* {!depositTokensData?.proofTokens && <Dot className="wallet-info__my-account-btn-notification" color={Colors.gray} />} */}
        {depositTokensData?.depositTokens?.some((nft) => !nft.isRedeemed) && (
          <Dot className="wallet-info__my-account-btn-notification" color={Colors.strongRed} />
        )}
      </button>

      {/* {transaction && <TransactionInfo />} */}

      <Modal isShowing={isShowing} onHide={hide}>
        <MyAccount />
      </Modal>
    </StyledWalletInfo>
  );
}
