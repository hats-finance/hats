import { ethers } from "ethers";
import LockIcon from "../../../../assets/icons/lock.icon";
import "./index.scss";

interface IProps {
  approveToken: Function;
  userInput: string;
  stakingTokenDecimals: string;
}

export function ApproveToken(props: IProps) {
  const { userInput, approveToken, stakingTokenDecimals } = props;

  return (
    <div className="approve-token-content">
      <LockIcon />
      <span className="title">APPROVE TOKEN</span>
      <span>Before you can proceed, you need to approve your token spending amount.</span>
      <span className="sub-text yellow">
        You will have to sign two transactions, one for approve spend and one for deposit. If you choose unlimited approval you
        will need to do it only for the first time
      </span>
      <button className="unlimited-approval-button" onClick={() => approveToken()}>
        UNLIMITED APPROVAL
      </button>
      <span className="sub-text">Want to approve before each transaction?</span>
      <button
        className="limited-approval-button"
        onClick={() => approveToken(ethers.utils.parseUnits(userInput, stakingTokenDecimals))}>
        Limited approval
      </button>
    </div>
  );
}
