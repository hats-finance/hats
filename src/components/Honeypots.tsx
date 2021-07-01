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
import Tooltip from "rc-tooltip";
import InfoIcon from "../assets/icons/info.icon";
import { Colors, RC_TOOLTIP_OVERLAY_INNER_STYLE } from "../constants/constants";

export default function Honeypots() {
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const vaultsData = useSelector((state: RootState) => state.dataReducer.vaults);
  const withdrawSafetyPeriodData: IWithdrawSafetyPeriod = useSelector((state: RootState) => state.dataReducer.withdrawSafetyPeriod);
  const safetyPeriodDate = moment().add(Math.abs(withdrawSafetyPeriodData.timeLeftForSafety), "seconds").local().format('DD-MM-YYYY HH:mm');

  const vaults = vaultsData.map((vault: IVault) => {
    if (!vault.liquidityPool && vault.registered) {
      try {
        JSON.parse(vault.description as any);
        return <Vault key={vault.id} data={vault} setShowModal={setShowModal} setModalData={setModalData} />
      } catch (err) {
        console.error(err);
      }
    }
    return null;
  });

  return (
    <div className="content honeypots-wrapper">
      {vaultsData.length === 0 ? <Loading fixed /> :
        <table>
          <tbody>
            {withdrawSafetyPeriodData.timeLeftForSafety !== 0 &&
              <tr>
                <th colSpan={7} className={`safe-period ${withdrawSafetyPeriodData.isSafetyPeriod && "on"}`}>
                  <div className="text-wrapper">
                    {withdrawSafetyPeriodData.isSafetyPeriod ? <div>{`WITHDRAWAL SAFE PERIOD IS ON UNTIL ${safetyPeriodDate}`}</div> : <div>{`THE NEXT SAFE PERIOD WILL START AT ${safetyPeriodDate}`}</div>}
                    <Tooltip
                      overlayClassName="tooltip"
                      overlayInnerStyle={RC_TOOLTIP_OVERLAY_INNER_STYLE}
                      overlay="Safe period - twice a day and for 1 hour the committee gathers. During that time withdraw is disabled">
                      <div style={{ display: "flex", marginLeft: "10px" }}><InfoIcon fill={withdrawSafetyPeriodData.isSafetyPeriod ? Colors.darkBlue : Colors.turquoise} /></div>
                    </Tooltip>
                  </div>
                </th>
              </tr>}
            <tr>
              <th style={{ width: "30px" }}></th>
              <th>PROJECT NAME</th>
              <th>TOTAL VAULT</th>
              {/* <th>#VULNERABILITIES</th> */}
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
