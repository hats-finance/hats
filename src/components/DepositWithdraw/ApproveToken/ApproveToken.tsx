import ReactDOM from "react-dom";
import { ethers } from "ethers";
import LockIcon from "../../../assets/icons/lock.icon";
import "./index.scss";
import { useTranslation } from "react-i18next";

interface IProps {
  approveToken: Function
  userInput: string
  hideApproveSpending: () => void
  stakingTokenDecimals: string
}

export default function ApproveToken(props: IProps) {
  const { t } = useTranslation();
  const { userInput, approveToken, hideApproveSpending, stakingTokenDecimals } = props;

  return ReactDOM.createPortal(
    <div className="approve-token-backdrop">
      <div className="approve-token-content">
        <span onClick={hideApproveSpending} className="close">&times;</span>
        <LockIcon />
        <span className="title">{t("DepositWithdraw.ApproveToken.text-0")}</span>
        <span>{t("DepositWithdraw.ApproveToken.text-1")}</span>
        <span className="sub-text yellow">{t("DepositWithdraw.ApproveToken.text-2")}</span>
        <button className="unlimited-approval-button" onClick={async () => {
          hideApproveSpending();
          await approveToken();
        }}>{t("DepositWithdraw.ApproveToken.text-3")}</button>
        <span className="sub-text">{t("DepositWithdraw.ApproveToken.text-4")}</span>
        <button className="limited-approval-button" onClick={async () => {
          hideApproveSpending();
          await approveToken(ethers.utils.parseUnits(userInput, stakingTokenDecimals));
        }}>{t("DepositWithdraw.ApproveToken.text-5")}</button>
      </div>
    </div>, document.body
  )
}
