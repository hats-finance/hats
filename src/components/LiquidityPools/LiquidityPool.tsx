import { useState } from "react";
import "../../styles/LiquidityPools.scss";
import Modal from "../Shared/Modal";
import Positions from "./Positions";

export default function LiquidityPool() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="lp-wrapper">
      <div className="lp-top">

      </div>
      <div className="lp-content">

      </div>
      <div className="lp-actions">
        <button onClick={() => setShowModal(true)}>Stake &#38; Unstake LP Tokens</button>
      </div>

      {showModal && (
        <Modal title="Uniswap v3 HAT-ETH" setShowModal={setShowModal} height="fit-content">
          <Positions />
        </Modal>
      )}
    </div>
  )
}
