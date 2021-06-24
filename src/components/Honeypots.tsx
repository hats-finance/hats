import { useState } from "react";
import Loading from "./Shared/Loading";
import Modal from "./Shared/Modal";
import Vault from "./Vault";
import DepositWithdraw from "./DepositWithdraw";
import "../styles/Honeypots.scss";
import { useSelector } from "react-redux";
import { RootState } from "../reducers";
import { IVault, IWithdrawSafetyPeriod } from "../types/types";
import moment from "moment";

export default function Honeypots() {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const vaultsData = useSelector((state: RootState) => state.dataReducer.vaults);
  const withdrawSafetyPeriodData: IWithdrawSafetyPeriod = useSelector((state: RootState) => state.dataReducer.withdrawSafetyPeriod);
  const safetyPeriodDate = moment().add(Math.abs(withdrawSafetyPeriodData.timeLeftForSaftety), "seconds").local().format('DD-MM-YYYY HH:mm');

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
            {withdrawSafetyPeriodData.timeLeftForSaftety !== 0 && <tr>
              <th colSpan={7} className={`safe-period ${withdrawSafetyPeriodData.isSafetyPeriod && "on"}`}>
                {withdrawSafetyPeriodData.isSafetyPeriod ? <span>{`WITHDRAWAL SAFE PERIOD IS ON UNTIL ${safetyPeriodDate}`}</span> : <span>{`WITHDRAWAL SAFE PERIOD WILL BEGIN AT ${safetyPeriodDate}`}</span>}
              </th>
            </tr>}
            <tr>
              <th style={{ width: "30px" }}></th>
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
