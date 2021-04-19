import { useState } from "react";
import Modal from "./Shared/Modal";
import { useSelector } from "react-redux";
import Pool from "./Pool";
import DepositWithdraw from "./DepositWithdraw";
import Loading from "./Shared/Loading";
import "../styles/LiquidityPools.scss";

export default function LiquidityPools() {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const poolsData = useSelector(state => state.dataReducer.vaults);

  // TODO: need to filter only the liquidity pools
  const pools = poolsData.map((pool, index) => {
    return <Pool key={index} data={pool} setShowModal={setShowModal} setModalData={setModalData} />
  });

  return (
    <div className="content liquidity-pools-wrapper">
      {poolsData.length === 0 ? <Loading fixed /> : <div>{pools}</div>}
      {showModal &&
        <Modal title={modalData.name} setShowModal={setShowModal} >
          <DepositWithdraw data={modalData} />
        </Modal>}
    </div>
  )
}
