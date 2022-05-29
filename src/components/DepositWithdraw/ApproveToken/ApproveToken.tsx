import ReactDOM from "react-dom";
import LockIcon from "../../../assets/icons/lock.icon";
import { toWei } from "../../../utils";
import "./index.scss";

interface IProps {
  approveToken: Function
  userInput: string
  hideApproveSpending: () => void
  stakingTokenDecimals: string
}

export default function ApproveToken(props: IProps) {
  const { userInput, approveToken, hideApproveSpending, stakingTokenDecimals } = props;

  return ReactDOM.createPortal(
    <div className="approve-token-backdrop">
      <div className="approve-token-content">
        <span onClick={hideApproveSpending} className="close">&times;</span>
        <LockIcon />
        <span className="title">APPROVE TOKEN</span>
        <span>Before you can proceed, you need to approve your token spending amount.</span>
        <span className="sub-text yellow">You will have to sign two transactions, one for approve spend and one for deposit. If you choose unlimited approval you will need to do it only for the first time</span>
        <button className="unlimited-approval-button" onClick={async () => {
          hideApproveSpending();
          await approveToken();
        }}>UNLIMITED APPROVAL</button>
        <span className="sub-text">Want to approve before each transaction?</span>
        <button className="limited-approval-button" onClick={async () => {
          hideApproveSpending();
          await approveToken(toWei(userInput, stakingTokenDecimals));
        }}>Limited approval</button>
      </div>
    </div>, document.body
  )
}
