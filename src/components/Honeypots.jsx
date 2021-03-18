import React, { useState } from "react";
import Loading from "./Shared/Loading";
import Modal from "./Shared/Modal";
import Vault from "./Vault";
import DepositeWithdraw from "./DepositeWithdraw";
import "../styles/Honeypots.scss";
import { useSelector } from "react-redux";

export default function Honeypots(props) {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const vaultsData = useSelector(state => state.dataReducer.vaults);

  const vaults = vaultsData.map((vault, index) => {
    return <Vault key={index} data={vault} setShowModal={setShowModal} setModalData={setModalData} />
  });

  return (
    <div className="content honeypots-wrapper">
      {vaultsData.length === 0 ? <Loading fixed /> : <table>
        <tbody>
          <tr>
            <th></th>
            <th>Project</th>
            <th>Honeypot</th>
            <th>Vulnerabilities found</th>
            <th>Funds given</th>
            <th>APY</th>
            <th></th>
          </tr>
          {vaults}
        </tbody>
      </table>}
      {showModal &&
        <Modal title={modalData.name} setShowModal={setShowModal} >
          <DepositeWithdraw data={modalData} updateVualts={props.refetchVaults} />
        </Modal>}
    </div>
  )
}
