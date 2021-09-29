import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers";
import "../../styles/LiquidityPools.scss";
import { IIncentive } from "../../types/types";
import { isProviderAndNetwork } from "../../utils";
import Modal from "../Shared/Modal";
import Positions from "./Positions";

interface IProps {
  incentive: IIncentive
}

export default function LiquidityPool(props: IProps) {
  const provider = useSelector((state: RootState) => state.web3Reducer.provider);
  const { incentive } = props;
  const [showModal, setShowModal] = useState(false);
  const startTime = moment.unix(Number(incentive?.startTime)).local().format('DD-MM-YYYY HH:mm');
  const endTime = moment.unix(Number(incentive?.endTime)).local().format('DD-MM-YYYY HH:mm');

  return (
    <div className="lp-wrapper">
      <div className="lp-top">
        <div className="lp-title">Uniswap V3 HAT-ETH</div>
        <div className="lp-active">{`Active ${startTime} to ${endTime}`}</div>
      </div>
      <div className="lp-incentive">
        <div>Pool Incentive:</div>

      </div>
      <div className="your-incentive">
        <div>Your Incentive:</div>
      </div>
      <div className="lp-actions">
        <button className="lp-action-btn stake" onClick={() => setShowModal(true)} disabled={!isProviderAndNetwork(provider)}>STAKE &#38; UNSTAKE LP TOKENS</button>
        <button className="lp-action-btn claim" disabled={!isProviderAndNetwork(provider)}>CLAIM ACCRUED REWARDS</button>
      </div>

      {showModal && (
        <Modal title="Uniswap v3 HAT-ETH" setShowModal={setShowModal} height="fit-content">
          <Positions />
        </Modal>
      )}
    </div>
  )
}
