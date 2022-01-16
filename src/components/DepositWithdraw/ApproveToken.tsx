import LockIcon from "../../assets/icons/lock.icon";
import "../../styles/DepositWithdraw/ApproveToken.scss";
import { toWei } from "../../utils";
import ReactDOM from "react-dom";

interface IProps {
  approveToken: Function
  userInput: string
  depositAndClaim: Function
  setShowUnlimitedMessage: Function
  stakingTokenDecimals: string
}

export default function ApproveToken(props: IProps) {
  const { userInput, approveToken, depositAndClaim, setShowUnlimitedMessage, stakingTokenDecimals } = props;

  return ReactDOM.createPortal(
    <div className="approve-token-backdrop">
      <div className="approve-token-content">
        <span onClick={() => setShowUnlimitedMessage(false)} className="close">&times;</span>
        <LockIcon />
        <span className="title">APPROVE TOKEN</span>
        <span>Before you can proceed, you need to approve your token spending amount.</span>
        <span className="sub-text yellow">You will have to sign two transactions, one for approve spend and one for deposit. If you choose unlimited approval you will need to do it only for the first time</span>
        <button className="unlimited-approval-button" onClick={async () => {
          setShowUnlimitedMessage(false);
          await approveToken();
          await depositAndClaim();
        }}>UNLIMITED APPROVAL</button>
        <span className="sub-text">Want to approve before each transaction?</span>
        <button className="limited-approval-button" onClick={async () => {
          setShowUnlimitedMessage(false);
          await approveToken(toWei(userInput, stakingTokenDecimals));
          await depositAndClaim();
        }}>Limited approval</button>
      </div>
    </div>, document.body
  )
}
