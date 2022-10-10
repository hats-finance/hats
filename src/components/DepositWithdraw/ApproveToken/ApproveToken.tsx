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
        <span className="title">{t("DepositWithdraw.ApproveToken.approveToken")}</span>
        <span>{t("DepositWithdraw.ApproveToken.approveSpending")}</span>
        <span className="sub-text yellow">{t("DepositWithdraw.ApproveToken.twoSigns")}</span>
        <button className="unlimited-approval-button" onClick={async () => {
          hideApproveSpending();
          await approveToken();
        }}>{t("DepositWithdraw.ApproveToken.unlimitedApproval")}</button>
        <span className="sub-text">{t("DepositWithdraw.ApproveToken.approveBefore")}</span>
        <button className="limited-approval-button" onClick={async () => {
          hideApproveSpending();
          await approveToken(ethers.utils.parseUnits(userInput, stakingTokenDecimals));
        }}>{t("DepositWithdraw.ApproveToken.limitedApproval")}</button>
      </div>
    </div>, document.body
  )
}
