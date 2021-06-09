import { useState } from "react";
import Loading from "./Shared/Loading";
import Modal from "./Shared/Modal";
import Vault from "./Vault";
import DepositWithdraw from "./DepositWithdraw";
import "../styles/Honeypots.scss";
import { useSelector } from "react-redux";
import { RootState } from "../reducers";
import { IVault } from "../types/types";

export default function Honeypots() {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const vaultsData = useSelector((state: RootState) => state.dataReducer.vaults);

  const vaults = vaultsData.map((vault: IVault) => {
    if (!vault.liquidityPool && vault.registered) {
      return <Vault key={vault.id} data={vault} setShowModal={setShowModal} setModalData={setModalData} />
    }
    return null;
  });

  return (
    <div className="content honeypots-wrapper">
      {vaultsData.length === 0 ? <Loading fixed /> :
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>PROJECT NAME</th>
              <th>TOTAL STAKED</th>
              <th>#VULNERABILITIES</th>
              <th>FUNDS GIVEN</th>
              <th>APY</th>
              <th></th>
            </tr>
            {vaults}
          </tbody>
        </table>}
      {showModal &&
        <Modal title="" setShowModal={setShowModal} height="fit-content" >
          <DepositWithdraw data={modalData as any} />
        </Modal>}
    </div>
  )
}
