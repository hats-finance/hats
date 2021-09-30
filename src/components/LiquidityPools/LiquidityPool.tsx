import classNames from "classnames";
import moment from "moment";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTransaction, uniswapClaimReward } from "../../actions/contractsActions";
import { RootState } from "../../reducers";
import "../../styles/LiquidityPools.scss";
import { IIncentive } from "../../types/types";
import { fetchWalletBalance, getNetworkNameByChainId, isDigitsOnly, isProviderAndNetwork } from "../../utils";
import Loading from "../Shared/Loading";
import Modal from "../Shared/Modal";
import Positions from "./Positions";

interface IProps {
  incentive: IIncentive
}

export default function LiquidityPool(props: IProps) {
  const dispatch = useDispatch();
  const provider = useSelector((state: RootState) => state.web3Reducer.provider);
  const selectedAddress = useSelector((state: RootState) => state.web3Reducer.provider?.selectedAddress) ?? "";
  const rewardsToken = useSelector((state: RootState) => state.dataReducer.rewardsToken);
  const chainId = useSelector((state: RootState) => state.web3Reducer.provider?.chainId) ?? "";
  const { incentive } = props;
  const [showModal, setShowModal] = useState(false);
  const [userIncentive, setUserIncentive] = useState("");
  const startTime = moment.unix(Number(incentive?.startTime)).local().format('DD-MM-YYYY HH:mm');
  const endTime = moment.unix(Number(incentive?.endTime)).local().format('DD-MM-YYYY HH:mm');
  const [pendingWalletAction, setPendingWalletAction] = useState(false);

  const claim = async () => {
    setPendingWalletAction(true);
    await createTransaction(
      async () => uniswapClaimReward(incentive.rewardToken, selectedAddress),
      () => { },
      () => {
        setPendingWalletAction(false);
        fetchWalletBalance(dispatch, getNetworkNameByChainId(chainId), selectedAddress, rewardsToken);
      },
      () => { setPendingWalletAction(false); },
      dispatch,
      "Claim Success!"
    )
  }

  const lpWrapperClass = classNames({
    "lp-wrapper": true,
    "disabled": pendingWalletAction
  })

  return (
    <div className={lpWrapperClass}>
      <div className="lp-top">
        <div className="lp-title">Uniswap V3 HAT-ETH</div>
        <div className="lp-active">{`Active ${startTime} to ${endTime}`}</div>
      </div>
      <div className="lp-incentive">
        <div className="sub-title">Pool Incentive:</div>
        <div className="data-container">
          <div className="data-element">
            <span className="element-value">??? HAT</span>
            <span>Total Rewared</span>
          </div>
          <div className="data-element">
            <span className="element-value">??? HAT</span>
            <span>Total Available</span>
          </div>
        </div>
      </div>
      <div className="your-incentive">
        <div className="sub-title">Your Incentive:</div>
        <div className="data-container">
          <div className="data-element">
            <input value={userIncentive} placeholder="0.0" type="number" min="0" autoFocus onChange={(e) => { isDigitsOnly(e.target.value) && setUserIncentive(e.target.value) }} />
            <span>Staked Uniswap V3 NFTs</span>
          </div>
          <div className="data-element">
            <span className="element-value">??? HAT</span>
            <span>Pending Rewards</span>
          </div>
          <div className="data-element">
            <span className="element-value">??? HAT</span>
            <span>Accrued Rewards</span>
          </div>
        </div>
      </div>
      <div className="lp-actions">
        <button className="lp-action-btn stake" onClick={() => setShowModal(true)} disabled={!isProviderAndNetwork(provider)}>STAKE &#38; UNSTAKE LP TOKENS</button>
        <button className="lp-action-btn claim" onClick={async () => await claim()} disabled={!isProviderAndNetwork(provider)}>CLAIM ACCRUED REWARDS</button>
      </div>

      {pendingWalletAction && <Loading />}

      {showModal && (
        <Modal title="Uniswap v3 HAT-ETH" setShowModal={setShowModal} height="fit-content">
          <Positions incentive={incentive} setShowModal={setShowModal} />
        </Modal>
      )}
    </div>
  )
}
