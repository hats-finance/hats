import { useState } from "react";
import Modal from "./Shared/Modal";
import { useSelector } from "react-redux";
import Pool from "./Pool";
import DepositWithdraw from "./DepositWithdraw";
import Loading from "./Shared/Loading";
import "../styles/LiquidityPools.scss";
import { POOL_PREFIX } from "../constants/constants";

export default function LiquidityPools() {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const poolsData = useSelector(state => state.dataReducer.vaults);
  const pools = poolsData.map((pool, index) => {
    if (pool.name.startsWith(POOL_PREFIX)) {
      return <Pool key={index} data={pool} setShowModal={setShowModal} setModalData={setModalData} />
    }
    return null;
  });

  return (
    <div className="content liquidity-pools-wrapper">
      {poolsData.length === 0 ? <Loading fixed /> : pools}
      {showModal &&
        <Modal title={modalData.name} setShowModal={setShowModal} >
          <DepositWithdraw data={modalData} />
        </Modal>}
    </div>
  )
}
